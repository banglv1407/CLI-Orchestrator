#!/usr/bin/env node
/**
 * Hermes ACP integration test
 * ─────────────────────────────────────────────────────────────────────────
 * Spawns `hermes acp --accept-hooks`, drives the full ACP handshake:
 *   initialize → session/new → session/prompt("hello")
 * and prints every frame received, with pass/fail summary.
 *
 * Usage:
 *   node scripts/test-hermes-acp.mjs
 *   node scripts/test-hermes-acp.mjs --hermes "C:/path/to/hermes.exe"
 */

import { spawn } from 'node:child_process';
import * as readline from 'node:readline';
import process from 'node:process';

// ── Config ────────────────────────────────────────────────────────────────
const HERMES_BIN = (() => {
  const idx = process.argv.indexOf('--hermes');
  return idx !== -1 ? process.argv[idx + 1] : 'hermes';
})();

const TIMEOUT_MS = 30_000; // 30s max per step

// ── State ─────────────────────────────────────────────────────────────────
let sessionId = null;
let initializeDone = false;
let responseChunks = [];
let stopReasonReceived = false;
let errorReceived = null;
let frameCount = 0;

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const GRAY   = '\x1b[90m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';

function log(color, label, msg) {
  console.log(`${color}${BOLD}[${label}]${RESET} ${msg}`);
}
function uid() {
  return Math.random().toString(36).slice(2, 11);
}

// ── Spawn Hermes ──────────────────────────────────────────────────────────
log(CYAN, 'START', `Spawning: ${HERMES_BIN} acp --accept-hooks`);

const child = spawn(HERMES_BIN, ['acp', '--accept-hooks'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, HERMES_ACCEPT_HOOKS: '1', PYTHONUNBUFFERED: '1' },
  windowsHide: true,
});

child.on('error', (err) => {
  log(RED, 'FATAL', `Failed to spawn Hermes: ${err.message}`);
  log(RED, 'HINT',  `Make sure 'hermes' is on PATH or pass --hermes <path>`);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  log(code === 0 || code === null ? GREEN : RED, 'EXIT',
    `Hermes exited: code=${code} signal=${signal}`);
});

// stderr → diagnostics
readline.createInterface({ input: child.stderr }).on('line', (line) => {
  log(GRAY, 'STDERR', line);
});

// ── Helpers ───────────────────────────────────────────────────────────────
function sendFrame(frame) {
  const json = JSON.stringify(frame);
  log(CYAN, 'SEND', json);
  child.stdin.write(json + '\n');
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function waitFor(predicate, label, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const iv = setInterval(() => {
      if (predicate()) { clearInterval(iv); clearTimeout(t); resolve(); }
    }, 100);
    const t = setTimeout(() => {
      clearInterval(iv);
      reject(new Error(`Timeout (${timeoutMs}ms) waiting for: ${label}`));
    }, timeoutMs);
  });
}

// ── Frame handler ─────────────────────────────────────────────────────────
readline.createInterface({ input: child.stdout }).on('line', (line) => {
  frameCount++;
  log(YELLOW, `RECV #${frameCount}`, line.slice(0, 300) + (line.length > 300 ? '…' : ''));

  let frame;
  try { frame = JSON.parse(line); }
  catch { log(GRAY, 'PARSE', `Non-JSON: ${line}`); return; }

  // initialize response
  if (frame.id === 'acp-init' && frame.result !== undefined && !frame.method) {
    initializeDone = true;
    log(GREEN, 'ACK', `initialize OK → ${JSON.stringify(frame.result?.serverInfo ?? frame.result)}`);
  }

  // session/new response — capture sessionId from ANY result frame during session setup
  if (!frame.method && frame.result !== undefined) {
    const sid =
      frame.result?.sessionId ??
      frame.result?._meta?.hermes?.sessionProvenance?.acpSessionId ??
      frame.result?.id ?? frame.result?.session_id ??
      (typeof frame.result === 'string' ? frame.result : null);
    if (sid && String(frame.id ?? '').startsWith('session-new-')) {
      sessionId = String(sid);
      log(GREEN, 'ACK', `session/new OK → sessionId: ${sessionId}`);
    } else if (String(frame.id ?? '').startsWith('session-new-')) {
      // Hermes returned something for our session-new request but without sessionId
      log(YELLOW, 'WARN', `session/new result (no sessionId field): ${JSON.stringify(frame.result).slice(0, 300)}`);
    }
  }

  // streaming chunks
  if (frame.method === 'session/update' || frame.method === 'session/chunk') {
    const delta = frame.params?.delta ?? frame.params?.text ?? '';
    const type  = frame.params?.type ?? 'text';
    if (type !== 'reasoning' && delta) {
      responseChunks.push(delta);
      process.stdout.write(GREEN + delta + RESET);
    }
  }

  // end of turn
  if (!frame.method && frame.result?.stopReason) {
    stopReasonReceived = true;
    log(GREEN, 'DONE', `stopReason: ${frame.result.stopReason}`);
  }
  if (frame.method === 'session/complete') {
    stopReasonReceived = true;
    log(GREEN, 'DONE', 'session/complete received');
  }

  // error
  if (frame.error && !frame.method) {
    errorReceived = frame.error?.message ?? JSON.stringify(frame.error);
    log(RED, 'ERROR', errorReceived);
  }
});

// ── Main sequence ─────────────────────────────────────────────────────────
async function runTest() {
  log(CYAN, 'WAIT', 'Waiting 1.5s for Hermes startup…');
  await sleep(1500);

  // Step 1 – initialize
  log(BOLD + CYAN, 'STEP 1', 'initialize handshake…');
  sendFrame({
    jsonrpc: '2.0', method: 'initialize',
    params: { protocolVersion: 1, clientInfo: { name: 'acp-test', version: '1.0' }, capabilities: {} },
    id: 'acp-init',
  });
  try {
    await waitFor(() => initializeDone, 'initialize response', 8_000);
    log(GREEN, 'PASS', 'Step 1 ✓');
  } catch {
    log(YELLOW, 'WARN', 'No initialize response — treating as optional, continuing…');
    initializeDone = true;
  }

  // Step 2 – session/new (OPTIONAL — Hermes may auto-create on first prompt)
  log(BOLD + CYAN, 'STEP 2', 'session/new…');
  const sessionReqId = `session-new-${uid()}`;
  sendFrame({
    jsonrpc: '2.0', method: 'session/new',
    params: { cwd: process.cwd(), mcpServers: [] },
    id: sessionReqId,
  });
  // Wait up to 120s — Hermes agent init (model load + vision detect + memory) takes ~35-40s
  const timeoutId = setTimeout(() => {
    log(RED, 'FAIL', 'No sessionId received within 120s — aborting.');
    log(YELLOW, 'HINT', 'Check STDERR above for Hermes errors.');
    child.kill();
    process.exit(1);
  }, 120000);

  await waitFor(() => sessionId !== null, 'sessionId', 120_000);
  clearTimeout(timeoutId);
  log(GREEN, 'PASS', `Step 2 ✓  sessionId=${sessionId}`);

  // Step 3 – session/prompt
  log(BOLD + CYAN, 'STEP 3', 'session/prompt "hello"…');
  console.log('\n--- ASSISTANT RESPONSE ---');
  sendFrame({
    jsonrpc: '2.0', method: 'session/prompt',
    params: { prompt: [{ type: 'text', text: 'hello, just say hi back in one short sentence' }], sessionId },
    id: `prompt-${uid()}`,
  });

  try {
    await waitFor(() => stopReasonReceived || errorReceived !== null, 'stopReason or error', TIMEOUT_MS);
  } catch {
    log(RED, 'TIMEOUT', `No stopReason within ${TIMEOUT_MS / 1000}s`);
  }

  console.log('\n--- END RESPONSE ---\n');

  // Summary
  const fullResponse = responseChunks.join('');
  const passed = fullResponse.length > 0 && !errorReceived;

  console.log('═'.repeat(60));
  log(passed ? GREEN : RED, 'RESULT', passed ? '✅ TEST PASSED' : '❌ TEST FAILED');
  console.log('═'.repeat(60));
  log(CYAN, 'STATS', `Frames received   : ${frameCount}`);
  log(CYAN, 'STATS', `initialize done   : ${initializeDone}`);
  log(CYAN, 'STATS', `Session ID        : ${sessionId}`);
  log(CYAN, 'STATS', `Stop reason rcvd  : ${stopReasonReceived}`);
  log(CYAN, 'STATS', `Response length   : ${fullResponse.length} chars`);
  if (errorReceived) log(RED, 'ERROR', errorReceived);

  if (!passed && frameCount === 0) {
    log(RED,    'HINT', 'No frames at all → Hermes crashed immediately. Check STDERR above.');
    log(RED,    'HINT', 'Try: hermes acp --check');
  } else if (!passed && !stopReasonReceived) {
    log(YELLOW, 'HINT', 'Frames received but no stopReason → model/API key may not be configured.');
    log(YELLOW, 'HINT', 'Run: hermes acp --setup   to configure provider');
  }

  child.kill();
  process.exit(passed ? 0 : 1);
}

runTest().catch((err) => {
  log(RED, 'FATAL', err.message);
  child.kill();
  process.exit(1);
});

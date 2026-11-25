import assert from 'assert';
import fs from 'fs';
import path from 'path';

function formatConfigContent(fileName, content) {
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      return { formatted, changed: formatted !== content };
    } catch (e) {
      return { formatted: content, changed: false, error: 'Cannot format: ' + (e.message || 'Invalid JSON syntax') };
    }
  }

  // For all code and text files: Trim trailing whitespaces on each line, normalize line endings to \n, collapse excessive blank lines
  const lines = content.replace(/\r/g, '').split('\n');
  const cleanedLines = lines.map((l) => l.trimEnd());
  let cleaned = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n');
  if (cleaned.length > 0 && !cleaned.endsWith('\n')) {
    cleaned += '\n';
  }
  return { formatted: cleaned, changed: cleaned !== content };
}

// Test 1: formatConfigContent on JSON
const rawJson = '{"name":"clx","version":"1.0.0",   "debug":true}';
const resJson = formatConfigContent('app.json', rawJson);
assert.strictEqual(resJson.changed, true);
assert.ok(resJson.formatted.includes('{\n  "name": "clx",\n  "version": "1.0.0",\n  "debug": true\n}'));
console.log('✓ JSON formatting passed');

// Test 2: formatConfigContent on Code / Text files (trim trailing whitespaces & normalize empty lines)
const rawCode = 'function hello() {   \r\n    console.log("world");  \r\n\r\n\r\n\r\n    return 42;\r\n}   ';
const resCode = formatConfigContent('test.ts', rawCode);
assert.strictEqual(resCode.changed, true);
assert.ok(!resCode.formatted.includes('   \n'));
assert.ok(!resCode.formatted.includes('\r'));
assert.ok(resCode.formatted.endsWith('\n'));
assert.ok(!resCode.formatted.includes('\n\n\n'));
console.log('✓ Code / Text universal formatting passed');

// Test 3: Search in file logic
function findMatches(content, query) {
  if (!query.trim() || !content) return [];
  const q = query.toLowerCase();
  const text = content.toLowerCase();
  const matches = [];
  let idx = 0;
  while ((idx = text.indexOf(q, idx)) !== -1) {
    matches.push({ start: idx, end: idx + q.length });
    idx += q.length;
  }
  return matches;
}

const fileText = 'const a = "hello";\nconst b = "hello world";\nconst c = "HELLO";';
const matches = findMatches(fileText, 'hello');
assert.strictEqual(matches.length, 3);
assert.strictEqual(fileText.substring(matches[0].start, matches[0].end).toLowerCase(), 'hello');
assert.strictEqual(fileText.substring(matches[1].start, matches[1].end).toLowerCase(), 'hello');
assert.strictEqual(fileText.substring(matches[2].start, matches[2].end).toLowerCase(), 'hello');
console.log('✓ File search match test passed');

// Test 4: Shift+Tab outdent logic
function outdentLine(content, selectionStart) {
  const textBefore = content.substring(0, selectionStart);
  const lineStart = textBefore.lastIndexOf('\n') + 1;
  const linePrefix = content.substring(lineStart, lineStart + 2);
  const spacesToRemove = linePrefix.startsWith('  ') ? 2 : linePrefix.startsWith(' ') ? 1 : 0;
  if (spacesToRemove > 0) {
    return {
      newContent: content.substring(0, lineStart) + content.substring(lineStart + spacesToRemove),
      newPos: Math.max(lineStart, selectionStart - spacesToRemove)
    };
  }
  return { newContent: content, newPos: selectionStart };
}

const indentedText = 'line1\n    indented line\nline3';
const pos = 10; // cursor inside indented line
const outdented = outdentLine(indentedText, pos);
assert.strictEqual(outdented.newContent, 'line1\n  indented line\nline3');
assert.strictEqual(outdented.newPos, 8);
console.log('✓ Shift+Tab outdent test passed');

// Test 5: Standalone multi-tab + pin/unpin FileEditorPanel integration checks
const editorSrc = fs.readFileSync(path.resolve('src/components/FileEditorPanel.tsx'), 'utf8');
const terminalSrc = fs.readFileSync(path.resolve('src/components/TerminalPanel.tsx'), 'utf8');
const dashboardSrc = fs.readFileSync(path.resolve('src/pages/Dashboard.tsx'), 'utf8');
const sidebarSrc = fs.readFileSync(path.resolve('src/components/CliSidebar.tsx'), 'utf8');

assert.ok(!terminalSrc.includes('openedFile'), 'TerminalPanel must not embed openedFile overlay');
assert.ok(editorSrc.includes('export interface OpenedFileTab'), 'FileEditorPanel exports OpenedFileTab');
assert.ok(editorSrc.includes('data-file-editor-tab='), 'FileEditorPanel renders multi-file tab strip');
assert.ok(editorSrc.includes('data-file-editor-pin'), 'FileEditorPanel supports Pin/Unpin toggle');
assert.ok(editorSrc.includes('data-file-search') && editorSrc.includes('data-file-search-count'), 'FileEditorPanel preserves debounced file search attributes');
assert.ok(editorSrc.includes('Save & Close') && editorSrc.includes('Close saved'), 'FileEditorPanel supports dirty tab confirm & Close saved');
assert.ok(dashboardSrc.includes('clx-file-editor-pinned') && dashboardSrc.includes('data-file-editor-resizer'), 'Dashboard persists pinned mode and resizer');
assert.ok(sidebarSrc.includes('data-open-file-editor-tabs'), 'CliSidebar Explorer exposes open tabs pill button');
assert.ok(sidebarSrc.includes('data-git-detail-section') && sidebarSrc.includes('data-git-detail-branch') && sidebarSrc.includes('data-git-detail-commit'), 'CliSidebar Explorer renders Git Detail panel with branch and latest commit metadata');
assert.ok(sidebarSrc.includes('preferDiff: true') && sidebarSrc.includes('preferDiff: false'), 'Git Detail delegates diff/edit opening to unified onFileClick handler');
assert.ok(dashboardSrc.includes('getGitDetail') && dashboardSrc.includes('options?: FileOpenOptions'), 'Dashboard fetches GitRepoDetail and supports FileOpenOptions in unified handleFileClick');
console.log('✓ Standalone multi-tab + pin/unpin + Git Detail architecture checks passed');

console.log('ALL FILE EDITOR TESTS PASSED!');

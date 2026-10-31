import assert from 'assert';

// Test 1: toRelativePath
function toRelativePath(fullPath, root) {
  if (!root) return fullPath;
  const normalizedFull = fullPath.replace(/\\/g, '/');
  const normalizedRoot = root.replace(/\\/g, '/').replace(/\/+$/, '');
  if (normalizedFull.startsWith(normalizedRoot + '/')) {
    return normalizedFull.slice(normalizedRoot.length + 1);
  }
  return fullPath;
}

assert.strictEqual(toRelativePath('D:\\CLI-Ochestor\\package.json', 'D:/CLI-Ochestor'), 'package.json');
assert.strictEqual(toRelativePath('D:/CLI-Ochestor/src/components/Notepad.tsx', 'D:\\CLI-Ochestor'), 'src/components/Notepad.tsx');
assert.strictEqual(toRelativePath('C:\\Windows\\system32\\drivers.sys', 'D:\\CLI-Ochestor'), 'C:\\Windows\\system32\\drivers.sys');
console.log('✓ toRelativePath passed');

// Test 2: Search matching
function getMatches(text, query) {
  if (!query.trim() || !text) return [];
  const q = query.toLowerCase();
  const lower = text.toLowerCase();
  const matches = [];
  let idx = 0;
  while ((idx = lower.indexOf(q, idx)) !== -1) {
    matches.push({ start: idx, end: idx + q.length });
    idx += q.length;
  }
  return matches;
}

const sampleNote = 'Hello world\nThis is a note with test and another TEST!';
const matches = getMatches(sampleNote, 'test');
assert.strictEqual(matches.length, 2);
assert.strictEqual(sampleNote.slice(matches[0].start, matches[0].end).toLowerCase(), 'test');
assert.strictEqual(sampleNote.slice(matches[1].start, matches[1].end).toLowerCase(), 'test');
console.log('✓ Search matches passed');

// Test 3: Safe highlighting tag collision check
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function highlightPython(code) {
  const tokenRegex = /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:def|class|import|from|return|if|elif|else|for|while|try|except|raise|with|as|pass|break|continue|in|is|not|and|or|lambda|yield|async|await|None|True|False|self)\b)/g;
  let lastIndex = 0;
  let out = '';
  let match;
  while ((match = tokenRegex.exec(code)) !== null) {
    out += escapeHtml(code.slice(lastIndex, match.index));
    const [full, comment, str, num, kw] = match;
    if (comment) out += `<span class="comment">${escapeHtml(comment)}</span>`;
    else if (str) out += `<span class="string">${escapeHtml(str)}</span>`;
    else if (num) out += `<span class="num">${escapeHtml(num)}</span>`;
    else if (kw) out += `<span class="kw">${escapeHtml(kw)}</span>`;
    lastIndex = tokenRegex.lastIndex;
  }
  out += escapeHtml(code.slice(lastIndex));
  return out;
}

const pyCode = 'import os\nkeyword_var = "test keyword import here"\n# comment 123';
const highlightedPy = highlightPython(pyCode);
assert.ok(!highlightedPy.includes('<span class=<span'));
assert.ok(highlightedPy.includes('<span class="kw">import</span>'));
assert.ok(highlightedPy.includes('<span class="string">&quot;test keyword import here&quot;</span>'));
console.log('✓ Syntax highlighting tag collision test passed');

// Test 4: Search highlight in HTML
function applySearchHighlight(html, query, activeIdx) {
  if (!query.trim()) return html;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?![^<]*>)(${escapedQuery})`, 'gi');
  let matchCount = 0;
  return html.replace(regex, (m) => {
    const isCurrent = matchCount === activeIdx;
    matchCount++;
    if (isCurrent) return `<mark class="active">${m}</mark>`;
    return `<mark>${m}</mark>`;
  });
}

const marked = applySearchHighlight(highlightedPy, 'import', 0);
assert.ok(marked.includes('<span class="kw"><mark class="active">import</mark></span>'));
assert.ok(!marked.includes('<span <mark'));
assert.ok(!marked.includes('<mark class="kw"'));
console.log('✓ HTML search mark test passed');

console.log('ALL TESTS PASSED!');

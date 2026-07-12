import { useCallback, useEffect, useRef, useState } from 'react';
import { getNotepad, saveNotepad } from '../lib/tauri';
import type { NotepadContent } from '../types';

// ---------------------------------------------------------------------------
// Language definitions
// ---------------------------------------------------------------------------

type LangDef = { id: string; label: string; regexes: RegExp[] };

const LANGS: LangDef[] = [
  {
    id: 'json', label: 'JSON', regexes: [
      /"[^"]*"\s*:/g, /\btrue\b|\bfalse\b|\bnull\b/g, /\b\d+\.?\d*\b/g,
    ]
  },
  {
    id: 'python', label: 'Python', regexes: [
      /\bdef\s+\w+/g, /\bclass\s+\w+/g,
      /\bimport\s|\bfrom\s/g,
      /\breturn\b|\bif\b|\belif\b|\belse\b|\bfor\b|\bwhile\b|\btry\b|\bexcept\b|\braise\b/g,
      /\bTrue\b|\bFalse\b|\bNone\b|\bself\b|\bwith\b|\bas\b/g,
      /#.*$/gm, /"[^"]*"/g, /'[^']*'/g,
    ]
  },
  {
    id: 'sql', label: 'PostgreSQL', regexes: [
      /\bSELECT\b|\bFROM\b|\bWHERE\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bCREATE\b|\bALTER\b|\bDROP\b/g,
      /\bJOIN\b|\bLEFT\b|\bRIGHT\b|\bINNER\b|\bOUTER\b|\bON\b/g,
      /\bAND\b|\bOR\b|\bNOT\b|\bIN\b|\bLIKE\b|\bBETWEEN\b|\bIS\b|\bNULL\b/g,
      /\bORDER\b|\bBY\b|\bGROUP\b|\bHAVING\b|\bLIMIT\b|\bOFFSET\b|\bAS\b/g,
      /\bBEGIN\b|\bCOMMIT\b|\bROLLBACK\b|\bTRANSACTION\b/g,
      /--.*$/gm, /'[^']*'/g,
      /\bINT\b|\bINTEGER\b|\bVARCHAR\b|\bTEXT\b|\bBOOLEAN\b|\bTIMESTAMP\b|\bSERIAL\b|\bPRIMARY\b|\bKEY\b|\bREFERENCES\b/g,
      /\bCOUNT\b|\bSUM\b|\bAVG\b|\bMAX\b|\bMIN\b/g,
    ]
  },
  {
    id: 'markdown', label: 'Markdown', regexes: [
      /^#{1,6}\s.*$/gm, /(\*\*|__).*?(\*\*|__)/g,
      /\[.*?\]\(.*?\)/g, /^-\s/gm,
      /`[^`]+`/g,
    ]
  },
];

// ---------------------------------------------------------------------------
// Auto-detect language from content
// ---------------------------------------------------------------------------

function guessLanguage(text: string): string {
  const t = text.trim();
  if (!t) return 'markdown';

  // JSON: starts with { or [ and parses as valid JSON
  if ((t.startsWith('{') || t.startsWith('[')) && /^{|\[/.test(t)) {
    try { JSON.parse(t); return 'json'; } catch {}
  }

  // SQL: has SELECT/FROM/INSERT/UPDATE/CREATE as top-level keywords
  const upper = t.toUpperCase();
  const sqlScore = [
    /\bSELECT\b/, /\bINSERT\b/, /\bUPDATE\b/, /\bDELETE\b/, /\bCREATE\b/,
    /\bFROM\b/, /\bWHERE\b/, /\bALTER\b/, /\bDROP\b/,
  ].filter(r => r.test(upper)).length;
  if (sqlScore >= 2) return 'sql';

  // Python: has def/class/import or indentation-based blocks
  const pyScore = [
    /\bdef\s/, /\bclass\s/, /\bimport\s/, /\bfrom\s\w+\simport/,
    /^    /m, /\breturn\b/, /\braise\b/, /\bself\b/,
  ].filter(r => r.test(t)).length;
  if (pyScore >= 2) return 'python';

  // Default: markdown
  return 'markdown';
}

// ---------------------------------------------------------------------------
// Pretty formatter — human-readable output
// ---------------------------------------------------------------------------

function prettyFormat(text: string, langId: string): string {
  switch (langId) {
    case 'json': {
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text; // invalid JSON, leave as-is
      }
    }

    case 'sql': {
      // Simple SQL formatter: uppercase keywords, newline before major clauses
      const MAJOR = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
        'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE',
        'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
        'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
        'ON', 'BEGIN', 'COMMIT', 'ROLLBACK',
      ];
      let result = text;
      // Uppercase keywords
      result = result.replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|SET|INTO|VALUES|TABLE|BEGIN|COMMIT|ROLLBACK|TRANSACTION|EXISTS|CASE|WHEN|THEN|ELSE|END|CAST|COALESCE|NULLIF|DISTINCT|ALL|UNION|INTERSECT|EXCEPT)\b/gi,
        (m: string) => m.toUpperCase());
      // Newline before major clauses
      for (const kw of MAJOR) {
        const re = new RegExp('\b' + kw + '\b', 'gi');
        result = result.replace(re, '\n' + kw.toUpperCase());
      }
      // Clean up leading newline
      return result.trimStart();
    }

    case 'python':
    case 'markdown':
    default:
      return text;
  }
}

// ---------------------------------------------------------------------------
// Syntax highlighter
// ---------------------------------------------------------------------------

function highlight(code: string, langId: string): string {
  const lang = LANGS.find(l => l.id === langId);
  if (!lang) return escapeHtml(code);
  let html = escapeHtml(code);
  for (const re of lang.regexes) {
    html = html.replace(re, (match: string) => {
      const src = re.source;
      if (src.startsWith('#') || src.startsWith('--')) return '<span class="sl-comment">' + match + '</span>';
      if (src.includes('"[^"]') || src.includes("'[^']")) return '<span class="sl-string">' + match + '</span>';
      if (src.includes('\\d')) return '<span class="sl-number">' + match + '</span>';
      if (src.startsWith('^#')) return '<span class="sl-heading">' + match + '</span>';
      return '<span class="sl-keyword">' + match + '</span>';
    });
  }
  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Props = { onClose?: () => void };

export function Notepad({ onClose }: Props) {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('markdown');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  // ---- load ----
  useEffect(() => {
    void (async () => {
      try {
        const data = await getNotepad();
        const content = data.text;
        setText(content);
        // Auto-detect language if not explicitly set
        const detected = data.language && data.language !== 'markdown'
          ? data.language
          : guessLanguage(content);
        setLang(detected);
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateHtml = useCallback((txt: string, lid: string) => {
    setHtml(highlight(txt, lid));
  }, []);

  // ---- auto-save ----
  useEffect(() => {
    if (loading) return;
    setSaved(false);
    updateHtml(text, lang);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveNotepad({ text, language: lang });
        setSaved(true);
        setError(null);
      } catch (e: any) {
        setError(String(e));
      }
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [text, lang, loading, updateHtml]);

  // ---- handlers ----
  const syncScroll = () => {
    if (taRef.current && hlRef.current) {
      hlRef.current.scrollTop = taRef.current.scrollTop;
      hlRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
      ta.selectionStart = ta.selectionEnd = ta.selectionStart + 2;
      setText(ta.value);
    }
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      setShowPreview(v => !v);
    }
    if (e.key === 'Escape' && onClose) onClose();
  };

  const handleDetect = () => {
    setLang(guessLanguage(text));
  };

  const handlePretty = () => {
    setText(prettyFormat(text, lang));
  };

  // ---- render ----
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <span className="text-slate-400 text-sm">Loading notepad...</span>
      </div>
    );
  }

  const lineCount = (text.match(/\n/g)?.length ?? 0) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/60"
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="bg-cyber-panel border border-cyber-line/50 rounded-xl shadow-2xl w-[90vw] max-w-5xl h-[82vh] flex flex-col overflow-hidden">

        {/* ==================== Header ==================== */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyber-line/40 bg-cyber-base/70">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-sm uppercase tracking-widest text-cyber-neon">Notepad</h2>
            <span className={'text-xs px-2 py-0.5 rounded-full ' +
              (saved ? 'text-slate-500 bg-slate-500/10' : 'text-yellow-400 bg-yellow-500/10')}>
              {saved ? 'Saved' : 'Unsaved'}
            </span>
            {error && <span className="text-xs text-red-400 truncate max-w-[200px]">{error}</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* Auto-detect button */}
            <button onClick={handleDetect} title="Auto-detect language"
              className="px-2 py-1 text-xs rounded border border-cyber-line text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition">
              Detect
            </button>
            {/* Language selector */}
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="bg-cyber-base border border-cyber-line rounded px-2 py-1 text-xs text-slate-300 focus:border-cyber-neon outline-none">
              {LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            {/* Pretty button */}
            <button onClick={handlePretty} title="Pretty format for readability"
              className="px-2 py-1 text-xs rounded border border-cyber-line text-slate-400 hover:text-green-400 hover:border-green-400/30 transition">
              Pretty
            </button>
            <button onClick={() => setShowPreview(v => !v)}
              className={'px-2 py-1 text-xs rounded border transition ' +
                (showPreview
                  ? 'text-cyber-neon border-cyber-neon/30 bg-cyber-neon/10'
                  : 'text-slate-400 border-cyber-line hover:text-slate-200')}>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button onClick={onClose}
              className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 transition">Esc</button>
          </div>
        </div>

        {/* ==================== Body ==================== */}
        <div className="flex-1 overflow-hidden text-sm font-mono leading-relaxed">
          {showPreview ? (
            <div
              className="h-full overflow-auto p-5 text-slate-200 whitespace-pre-wrap break-all bg-black/20"
              dangerouslySetInnerHTML={{ __html: html || escapeHtml(text) }}
            />
          ) : (
            <div className="relative h-full">
              {/* invisible textarea (receives input) */}
              <textarea
                ref={taRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onScroll={syncScroll}
                onKeyDown={onKeyDown}
                className="absolute inset-0 w-full h-full p-5 resize-none outline-none border-none bg-transparent leading-relaxed"
                style={{ color: 'transparent', caretColor: '#00ffcc' }}
                spellCheck={false}
                placeholder="Start typing..."
              />
              {/* syntax-highlighted overlay */}
              <div
                ref={hlRef}
                className="absolute inset-0 p-5 whitespace-pre-wrap break-all pointer-events-none overflow-hidden text-slate-200 leading-relaxed"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: html || escapeHtml(text) }}
              />
            </div>
          )}
        </div>

        {/* ==================== Status bar ==================== */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-cyber-line/40 bg-cyber-base/50 text-[10px] text-slate-500">
          <span>
            {lang.toUpperCase()} · {lineCount} lines · {text.length} chars
            <span className="ml-2 text-cyan-500">Detect: auto</span>
          </span>
          <span>Ctrl+Enter Preview · Tab Indent · Esc Close</span>
        </div>
      </div>
    </div>
  );
}

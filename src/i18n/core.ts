import messages from './messages.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', locale: 'en-US' },
  { code: 'vi', name: 'Tiếng Việt', locale: 'vi-VN' },
  { code: 'ko', name: '한국어', locale: 'ko-KR' },
] as const;
export type Language = typeof LANGUAGES[number]['code'];
export const LANGUAGE_STORAGE_KEY = 'clx-ui-language';
const catalog: Record<string, readonly string[]> = messages;
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const patterns = Object.entries(catalog).flatMap(([key, entry]) => {
  if (!/\{\w+\}/.test(key)) return [];
  return [...new Set([key, ...entry])].map((source) => {
    const names: string[] = [];
    let offset = 0;
    let pattern = '^';
    for (const match of source.matchAll(/\{(\w+)\}/g)) {
      pattern += escapePattern(source.slice(offset, match.index)) + '([\\s\\S]*?)';
      names.push(match[1]);
      offset = match.index! + match[0].length;
    }
    pattern += escapePattern(source.slice(offset)) + '$';
    return { key, names, regex: new RegExp(pattern), specificity: source.replace(/\{\w+\}/g, '').length };
  });
}).sort((a, b) => b.specificity - a.specificity);
const aliases = new Map<string, string>();
for (const [key, entry] of Object.entries(catalog)) {
  for (const value of entry) if (!aliases.has(value)) aliases.set(value, key);
}

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some(({ code }) => code === value);
}

export function readLanguage(storage?: Pick<Storage, 'getItem'>): Language {
  try {
    const saved = storage?.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
}

export function translate(
  language: Language,
  source: string,
  values: Record<string, string | number> = {},
): string {
  return renderTranslation(language, source, values, 0);
}

/** Localize owned diagnostics inside error wrappers, while keeping their data. */
export function translateFeedback(
  language: Language,
  source: string,
  values: Record<string, string | number> = {},
): string {
  return renderTranslation(language, source, values, 3);
}

function renderTranslation(
  language: Language,
  source: string,
  values: Record<string, string | number>,
  feedbackDepth: number,
  diagnosticOnly = false,
): string {
  const originalKey = source.trim();
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  if (feedbackDepth > 0 && originalKey.startsWith('⚠ ')) {
    return leading + '⚠ ' + renderTranslation(language, originalKey.slice(2), values, feedbackDepth - 1, diagnosticOnly) + trailing;
  }
  let key = catalog[originalKey] ? originalKey : aliases.get(originalKey) ?? originalKey;
  let substitutions = values;
  if (!catalog[key]) {
    // CLX feedback may already contain interpolated paths/errors in state.
    // This only runs where the interface explicitly translates owned feedback.
    for (const pattern of patterns) {
      const match = originalKey.match(pattern.regex);
      if (!match) continue;
      key = pattern.key;
      substitutions = Object.fromEntries(pattern.names.map((name, i) => [name, match[i + 1]]));
      break;
    }
  }
  const entry = catalog[key];
  // An error detail can be an external value. Do not turn a label such as a
  // profile named "Settings" into a translation just because it is in a detail.
  if (diagnosticOnly && (!entry || !/error|fail|invalid|unavailable|required|must|not found|unsupported|rejected|timed out|too long|cancelled|command.*(?:need|generat)/i.test(key))) {
    return source;
  }
  const diagnosticSlot = key.match(/(?:failed|error|cannot format|rejected).*:\s*\{(\w+)\}$/i)?.[1];
  if (feedbackDepth > 0 && diagnosticSlot && typeof substitutions[diagnosticSlot] === 'string') {
    substitutions = {
      ...substitutions,
      [diagnosticSlot]: renderTranslation(language, String(substitutions[diagnosticSlot]), {}, feedbackDepth - 1, true),
    };
  }
  const index = LANGUAGES.findIndex(({ code }) => code === language);
  const text = entry?.[index] ?? key;
  // Replace in a single pass: values containing braces or dollar signs stay data.
  const result = text.replace(/\{(\w+)\}/g, (placeholder, name: string) => (
    Object.prototype.hasOwnProperty.call(substitutions, name) ? String(substitutions[name]) : placeholder
  ));
  return originalKey ? leading + result + trailing : source;
}

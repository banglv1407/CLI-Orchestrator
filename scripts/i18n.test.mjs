import assert from 'node:assert/strict';
import { after, describe, test } from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

// Exercise the production modules. Only the native bridge is substituted.
const directory = path.resolve('.temp/i18n-tests');
await fs.mkdir(directory, { recursive: true });
const bundle = path.join(directory, 'language.mjs');
await build({
  entryPoints: ['src/i18n/index.ts'], outfile: bundle, bundle: true,
  platform: 'node', format: 'esm', external: ['react'],
  plugins: [{
    name: 'native-language-fixture',
    setup(builder) {
      builder.onResolve({ filter: /^@tauri-apps\/api\/core$/ }, () => ({ path: 'native', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: `
        export const isTauri = () => Boolean(globalThis.__clxTestNative?.enabled);
        export const invoke = (...args) => globalThis.__clxTestNative.invoke(...args);
      ` }));
    },
  }],
});
const coreBundle = path.join(directory, 'core.mjs');
await build({ entryPoints: ['src/i18n/core.ts'], outfile: coreBundle, bundle: true, platform: 'node', format: 'esm' });
const { translate, translateFeedback, readLanguage, LANGUAGE_STORAGE_KEY } = await import(pathToFileURL(coreBundle).href);
const previous = { window: globalThis.window, document: globalThis.document, native: globalThis.__clxTestNative };
after(() => { globalThis.window = previous.window; globalThis.document = previous.document; globalThis.__clxTestNative = previous.native; });
let instance = 0;
async function languageFixture(saved, blocked = false) {
  const values = new Map(saved === undefined ? [] : [[LANGUAGE_STORAGE_KEY, saved]]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  globalThis.window = new EventTarget();
  Object.defineProperty(window, 'localStorage', { get() { if (blocked) throw new Error('storage blocked'); return storage; } });
  globalThis.document = { documentElement: { lang: '' } };
  globalThis.__clxTestNative = { enabled: false };
  const module = await import(`${pathToFileURL(bundle).href}?fixture=${instance++}`);
  return { ...module, values, storage, window, document };
}

describe('interface language', { concurrency: false }, () => {
  test('English, Vietnamese and Korean include localized owned copy', () => {
    assert.equal(translate('en', 'Settings'), 'Settings');
    assert.equal(translate('vi', 'Settings'), 'Cấu hình');
    assert.equal(translate('ko', 'Settings'), '설정');
    assert.equal(translate('vi', 'Interface language'), 'Ngôn ngữ giao diện');
    assert.equal(translate('ko', 'Interface language'), '인터페이스 언어');
  });

  test('interpolation preserves user names, braces, dollar signs, and paths', () => {
    const name = 'Save $1 ${HOME} {v1} D:\\a b\\vi.txt';
    const result = translate('ko', 'Are you sure you want to delete the CLI "{v0}"?', { v0: name, v1: 'should not replace data' });
    assert.ok(result.includes(name));
    assert.ok(!result.includes('should not replace data'));
    assert.ok(!result.includes('Are you sure'));
    assert.equal(translate('vi', ' $ bun run build && cargo check '), ' $ bun run build && cargo check ');
    assert.equal(translate('ko', 'C:\\projects\\user-input.md'), 'C:\\projects\\user-input.md');
  });

  test('already rendered interface feedback can change language without losing its values', () => {
    const source = 'Delete failed: D:\\projects\\my-file.txt';
    const vietnamese = translate('vi', source);
    assert.notEqual(vietnamese, source);
    const korean = translate('ko', vietnamese);
    assert.notEqual(korean, vietnamese);
    assert.ok(korean.includes('D:\\projects\\my-file.txt'));
    assert.equal(translate('en', korean), source);
    assert.equal(translate('en', 'Ngôn ngữ giao diện'), 'Interface language');
  });

  test('nested owned errors are localized without changing profile names or external diagnostics', () => {
    const name = 'Settings $1 {error}';
    const source = `⚠ Error: Delete failed: SSH profile '${name}' was not found`;
    const result = translateFeedback('ko', source);
    assert.ok(result.includes(name));
    assert.ok(!result.includes('was not found'));
    assert.ok(!result.includes('Delete failed'));
    assert.ok(!result.includes('Error:'));
    const diagnostic = 'ECONNREFUSED 127.0.0.1:5000 /tmp/private-file';
    assert.ok(translateFeedback('vi', 'Save failed: ' + diagnostic).includes(diagnostic));
    assert.ok(translateFeedback('ko', 'Save failed: Settings').endsWith('Settings'));
  });

  test('missing, malformed, and inaccessible preferences default to English', () => {
    assert.equal(readLanguage(), 'en');
    for (const saved of [null, '', 'fr', 'VI', '{"code":"ko"}']) assert.equal(readLanguage({ getItem: () => saved }), 'en');
    assert.equal(readLanguage({ getItem() { throw new Error('unavailable'); } }), 'en');
    assert.equal(readLanguage({ getItem: () => 'ko' }), 'ko');
  });

  test('selection immediately updates document language, events, and persisted preference', async () => {
    const fixture = await languageFixture('vi');
    fixture.initializeLanguage();
    assert.equal(fixture.document.documentElement.lang, 'vi');
    const events = [];
    fixture.window.addEventListener('clx-language-changed', event => events.push(event.detail));
    fixture.setLanguage('ko');
    assert.equal(fixture.getLanguage(), 'ko');
    assert.equal(fixture.document.documentElement.lang, 'ko');
    assert.equal(fixture.values.get(LANGUAGE_STORAGE_KEY), 'ko');
    assert.equal(fixture.t('Settings'), '설정');
    assert.deepEqual(events, ['ko']);
    fixture.setLanguage('ko');
    fixture.setLanguage('invalid');
    assert.deepEqual(events, ['ko']);
    assert.equal((await languageFixture(fixture.values.get(LANGUAGE_STORAGE_KEY))).getLanguage(), 'ko');
  });

  test('switching remains usable when browser storage is blocked', async () => {
    const fixture = await languageFixture(undefined, true);
    fixture.setLanguage('vi');
    assert.equal(fixture.t('Settings'), 'Cấu hình');
    assert.equal(fixture.document.documentElement.lang, 'vi');
  });

  test('storage changes update other windows and clearing resets to the default', async () => {
    const fixture = await languageFixture('en');
    const dispatch = key => { const event = new Event('storage'); Object.defineProperty(event, 'key', { value: key }); fixture.window.dispatchEvent(event); };
    fixture.storage.setItem(LANGUAGE_STORAGE_KEY, 'ko');
    dispatch('unrelated-key');
    assert.equal(fixture.getLanguage(), 'en');
    dispatch(LANGUAGE_STORAGE_KEY);
    assert.equal(fixture.getLanguage(), 'ko');
    fixture.values.clear();
    dispatch(null);
    assert.equal(fixture.getLanguage(), 'en');
  });

  test('rapid changes reach the native menu in order even if the first update is slow', async () => {
    const fixture = await languageFixture('en');
    const events = [];
    globalThis.__clxTestNative = { enabled: true, async invoke(command, args) {
      assert.equal(command, 'set_ui_language');
      events.push('start:' + args.language);
      await new Promise(resolve => setTimeout(resolve, args.language === 'en' ? 20 : 1));
      events.push('end:' + args.language);
    } };
    fixture.initializeLanguage();
    fixture.setLanguage('vi');
    fixture.setLanguage('ko');
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.deepEqual(events, ['start:en', 'end:en', 'start:vi', 'end:vi', 'start:ko', 'end:ko']);
  });

  test('dates and relative time follow the language while legacy timestamp text survives', async () => {
    const fixture = await languageFixture('en');
    const timestamp = '2026-10-06T13:15:00.000Z';
    for (const [code, locale] of [['en', 'en-US'], ['vi', 'vi-VN'], ['ko', 'ko-KR']]) {
      fixture.setLanguage(code);
      assert.equal(fixture.getIntlLocale(), locale);
      assert.equal(fixture.formatChatTime(timestamp), new Date(timestamp).toLocaleTimeString(locale));
      assert.equal(fixture.formatRelativeTime(Date.now() / 1000), new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second'));
    }
    assert.equal(fixture.formatChatTime('13:15:00'), '13:15:00');
  });
});

# Interface language

CLX supports English (`en`), Vietnamese (`vi`), and Korean (`ko`) across its
interface. Settings > Appearance contains an Interface language selector, with
each language named in its own language. Switching applies immediately without
reloading or interrupting sessions. The selection persists on this machine;
English is the default when no valid preference exists.

Application labels, descriptions, tooltips, placeholders, empty states,
confirmations, status messages, command-palette actions, built-in game UI,
native tray actions, and the exit dialog use the selected language. Dates and
numbers use the corresponding locale. Commands, paths, product names, protocol
identifiers, source code, terminal output, user-authored content, external
messages, and imported pet names retain their original values.

Translation resources are centralized in `src/i18n`. New interface copy must
include all three languages and preserve interpolation placeholders. Language
changes must preserve open views, editor content, terminal sessions, and saved
configuration. Native UI receives the selected language through a Tauri command.

Validation includes catalog completeness, interpolation, invalid preferences,
immediate updates, persistence, a production frontend build, and focused native
checks. Desktop acceptance covers every Settings section, navigation, menus,
dialogs, and built-in workspaces in each language.

Run `npm run check:i18n` to check copy, all three resource columns, placeholders,
and technical bindings. Run `npm run test:i18n` for language and persistence
tests. After `npm run build`, `npm run test:i18n:ui` runs a production-browser
smoke with a separate temporary profile and a simulated native bridge. It
checks all nine Settings sections, workspace rendering, unsaved prompt
preservation, and reload persistence. It defaults to Windows Edge; set
`CLX_I18N_BROWSER` to a compatible Chromium executable for another installation.
Screenshots and its report are written to `.temp/i18n-browser`.

Browser fixtures do not prove the physical tray or native dialog. Desktop
acceptance must separately inspect tray labels and the close-window choice in
each language, including restored language after restart.

# Animated Pets

CLX can display one optional animated pet above the desktop UI. Selecting or
disabling a pet is persisted locally. Clicking the live pet continues to open
the AI surface.

## Built-in Pets

Dragon, Phoenix, Qilin, and Pegasus ship with CLX and remain available without
any local pack.

## Local Pet Packs

Users may import a folder containing a versioned `manifest.json` and PNG sprite
sheets. Imported packs are copied under `~/.ai-cli-manager/pets/<pack-id>` and
are not part of the application bundle.

The importer treats a pack as untrusted input. It rejects unsupported schema
versions, invalid or duplicate identifiers, absolute or escaping paths,
symlinks, unsupported files, oversized assets, and sprite sheets whose geometry
does not match their clip metadata. Re-importing an installed pack requires an
explicit replace confirmation and must preserve the previous pack if validation
or installation fails.

`displaySize` accepts 24-160 CSS pixels and controls live visual scale.
`speedMultiplier` defaults to `1.0` and scales travel speed, clip playback, and
special-move duration.

## Animation Behavior

- Local packs choose the live scale with `displaySize`; the current private
  anime pack uses 32 CSS pixels inside a 128x128 frame.
- Common clips are idle, travel, and blink.
- A pet may expose two signature moves from the engine's supported move kinds.
- Automatic moves are enabled by default and run at a randomized 25-45 second
  interval without repeating the same move twice.
- Hidden windows do not advance or catch up animations.
- Reduced-motion preference disables automatic special moves.
- Special effects never receive pointer input or interact with terminal content.

Settings provides the enabled toggle, selected pet, local-pack import, special
move toggle, and an isolated preview stage. Clicking the live pet remains
reserved for opening AI.

Each registered pet also exposes per-pet tuning in Settings:

- Size override: 20-160 CSS pixels.
- Speed override: 0.5x-2.0x.
- Changes update the preview and live overlay immediately.
- Overrides are stored locally under `clx-mythical-pet-tuning`; Reset removes
  only the selected pet's override and restores its manifest or built-in
  defaults.

## Local-Only Character Art

Private character art is stored outside tracked and bundled assets. CLX code and
test fixtures remain generic; names, portraits, and animation sheets for a
private pack live only in that pack's manifest and files.

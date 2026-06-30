# codex-credits

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

## Usage

```bash
npx codex-credits
```

Use a custom Codex auth file:

```bash
npx codex-credits --auth ~/.codex/auth.json
```

The CLI reads `tokens.access_token` from the Codex auth file and checks reset credits plus usage reset windows. Output is English-only, uses local time, and never prints tokens, cookies, or authorization headers.

Example output:

```text
Codex reset credits: 3

Next expiry
  at    2026-07-12 10:09:26 GMT+8
  in    11d 13h

All credits
  01    2026-06-12 10:09:26  -  2026-07-12 10:09:26
  02    2026-06-18 08:37:46  -  2026-07-18 08:37:46
  03    2026-06-27 07:48:09  -  2026-07-27 07:48:09

Usage windows
  5h    97% left    resets in 4h 36m
  7d    80% left    resets in 6d 13h
```

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/codex-credits?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/codex-credits
[npm-downloads-src]: https://img.shields.io/npm/dm/codex-credits?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/codex-credits
[bundle-src]: https://img.shields.io/bundlephobia/minzip/codex-credits?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=codex-credits
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/codex-credits/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/codex-credits

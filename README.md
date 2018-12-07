[standard]: https://standardjs.com/
[lerna]: https://lernajs.io/
[node]: https://nodejs.org/
[config]: https://github.com/Amazebot/util/tree/master/packages/config
[logger]: https://github.com/Amazebot/util/tree/master/packages/logger

# Amazebot Util

[Node.js][node] utilities that provide common dependencies to bot/integration projects.

[![CircleCI](https://circleci.com/gh/Amazebot/util/tree/master.svg?style=shield)](https://circleci.com/gh/Amazebot/util/tree/master)
[![codecov](https://codecov.io/gh/Amazebot/util/branch/master/graph/badge.svg)](https://codecov.io/gh/Amazebot/util/branch/master)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Buy me a coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-☕-yellow.svg)](https://www.buymeacoffee.com/UezGWCarA)

---

### ⚙️ [Config][config]
Centralised app configuration loaded from ENV, CLI and/or JSON.

[![npm version](https://badge.fury.io/js/%40amazebot%2Fconfig.svg)](https://badge.fury.io/js/%40amazebot%2Fconfig)

### 📓 [Logger][logger]
Basic log handling with overrides for use within other modules.

[![npm version](https://badge.fury.io/js/%40amazebot%2Flogger.svg)](https://badge.fury.io/js/%40amazebot%2Flogger)

---

See the README in each of the [package paths](https://github.com/Amazebot/util/tree/master/packages) for further usage instructions.

[Lerna][lerna] is used to link and publish packages that depend on each other, to streamline local development. These utilities can be used independently, but it still helps to share dev dependencies, test and build configuration.

All packages are written in Typescript and follow [Standard JS][standard] style, with a minimum of 80% test coverage.

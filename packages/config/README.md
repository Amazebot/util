[dotenv]: https://github.com/motdotla/dotenv
[yargs]: https://yargs.js.org/

# ⚙️ Config
Centralised app/module configuration loaded from ENV, CLI and/or JSON.
---

This utility wraps [Yargs][yargs] and [dotenv][dotenv] capabilities with some
simple interfaces for easily managing configuration from various sources.

Can load a single configuration, or use the same options for a series of
instances, loading from different sources using custom prefixes.

Possible config sources include:
  - Command line args
  - Local `.env` file
  - Environment variables
  - Package JSON `'config': {}`
  - `config.json` file

A note on syntax/format. Options are defined and stored with **hyphenated**
names, that match to their command line argument. However, the corresponding key
in JSON would be **camelCase** and the env variable would be **all caps** with
underscore separators.

Please be aware of the semantics:
- **Option**: Defines a possible value type and default.
- **Value**: The current value assigned for an option.
- **Settings**: An object containing all current values.
- **Config**: Loads, gets, sets and extends options.
- **Series**: Collection of configs with the same options.

## Config

### `new Config(options: IOptions, sourcePrefix?: string)`

Config instances accept an initial range of options, which can be extended, for
sharing the config between modules that each add their own options. The options
argument follows the [Yargs][yargs] syntax.

The optional prefix argument on the constructor is applied to the sources for
loading all options.

```ts
import { Config } from '@amazebot/config'
const config = new Config({
  'amazing-enabled': {
    type: 'boolean',
    description: 'Makes everything amazing',
    default: true
  }
}, 'my')
```

In this example, the prefix 'my' would modify the source for the option as
- env variable: `MY_AMAZING_ENABLED`
- package json: `myConfig`
- config file: `my-config.json`

### `.load(keyPrefix?: string)`

Load values for the defined options from all recognised sources:

```ts
import { Config } from '@amazebot/config'
const config = new Config({ 'amazing': { type: 'boolean', default: 'true' } })
config.load()
console.log(config.settings.amazing) // --> true
```

Passing a prefix to the load method modifies the key for all options, allowing
multiple instances to have unique settings, from a common source. e.g. `.env`

```sh
FOO_AMAZING='false'
BAR_AMAZING='true'
```

```ts
import { Config } from '@amazebot/config'
const options = { 'amazing': { type: 'boolean', default: 'true' } }
const foo = new Config(options)
const bar = new Config(options)
foo.load('foo')
foo.load('bar')
console.log(foo.settings.amazing) // --> false
console.log(bar.settings.amazing) // --> true
```

### `.extend(options: IOptions)`

Add more options, possibly after initial options loaded (requiring load again).
Calling load after extend will merge new options with the initial set.

```ts
// index.ts
export * from './app.ts'
export * from './module.ts'
```

```ts
// app.ts
import { Config } from '@amazebot/config'
export const app = {
  config: new Config({ 'amazing': { type: 'boolean', default: 'true' } }),
  start: () => {
    config.load()
    console.log(config.settings)
  }
}
```

```ts
// module.ts
import { app } from '.'
app.config.extend({ 'more-amazing': { type: 'boolean', default: 'false' } })
app.start() // --> { 'amazing': true, 'more-amazing': false }
```

### `.get(key: string)`

Gets the loaded value from settings.

```ts
import { Config } from '@amazebot/config'
const config = new Config({ 'amazing': { type: 'boolean', default: 'true' } })
config.load()
config.get('amazing') // --> true
```

### `.set(key: string, value: any)`

Set the value. Set values override loaded ones.

```sh
AMAZING='true'
```

```ts
import { Config } from '@amazebot/config'
const config = new Config({ 'amazing': { type: 'boolean' } })
config.load()
config.get('amazing') // --> true
config.set('amazing', false)
config.get('amazing') // --> false
```

```ts
import { Config } from '@amazebot/config'
const config = new Config({ 'amazing': { type: 'boolean' } })
config.set('amazing', false)
config.load()
config.get('amazing') // --> false
```

### `.reset()`

Clear any loaded or set values.

```ts
import { Config } from '@amazebot/config'
const config = new Config({ 'amazing': { type: 'boolean', default: 'true' } })
config.load()
config.set('amazing', false)
config.reset()
config.get('amazing') // --> true
```

## ConfigSet

Config Maps allow defining a set of config instances with common options and
defaults, with different values assigned by loading a unique prefixed source.

### `new ConfigMap(options: IOptions, sourcePrefix?: string)`

The constructor uses the same arguments as normal configs. The map contains a
collection of config instance `items`, always with at least one `default` item.

```ts
import { ConfigMap } from '@amazebot/config'
const map = new ConfigMap({ 'amazing': { type: 'boolean', default: 'true' } })
console.log(map.items.default.settings['amazing'].default) // --> true
```

### `.item(key: string)`

Get a config item by it's key, creating if it didn't exist.

```ts
import { ConfigMap } from '@amazebot/config'
const map = new ConfigMap({ 'amazing': { type: 'boolean', default: 'true' } })
map.item('alt')
console.log(map.items.alt.settings['amazing'].default) // --> true
```

### `.load()`

Loads every item's config, using it's key as a prefix for value sources.

```sh
AMAZING='true'
ALT_AMAZING='false'
```

```ts
import { ConfigMap } from '@amazebot/config'
const map = new ConfigMap({ 'amazing': { type: 'boolean' } })
map.item('alt')
map.load()
map.item('default').get('amazing') // --> true
map.item('alt').get('amazing') // --> false
```

### `.extend(options: IOptions)`

Extends every config item's options and for any newly created items.

```ts
import { ConfigMap } from '@amazebot/config'
const map = new ConfigMap({ 'amazing': { type: 'boolean' } })
map.extend({ 'more-amazing': { type: 'boolean', default: true } })
map.item('alt')
map.load()
map.item('alt').get('more-amazing') // --> true
```

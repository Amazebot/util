import 'dotenv/config'
import { existsSync } from 'fs'
import * as yargs from 'yargs'
import { hyphen } from './format'

/** Interface for collection of Yargs options. */
export interface IOptions { [key: string]: yargs.Options }

/** Alias for a setting loaded by Yargs. */
export interface ISettings { [key: string]: any }

/** Load/reload/get/set config from command line args, files and in code. */
export class Config {
  /** Collection of yargs options, can be extended at runtime. */
  options: IOptions

  /** Access all settings from argv, env, package and custom config files. */
  settings: ISettings = {}

  /** Keep all manually assigned settings, to be retained on reload. */
  updates: { [key: string]: any } = {}

  /** Command line usage information. */
  info: string

  /** Create config instance with initial options. */
  constructor (public initOptions: IOptions, public sourcePrefix?: string) {
    this.options = Object.assign({}, initOptions)
    const prefixNote = (sourcePrefix)
      ? ` with the prefix \`${sourcePrefix.toUpperCase()}_\`.`
      : `.`
    const configName = (sourcePrefix)
      ? `${sourcePrefix}Config`
      : `config`
    this.info = `---
All option can be provided as environment variables${prefixNote}
Config can also be declared in \`package.json\` with the key: "${configName}",
or in a file: "${configName}.json".
---`
  }

  /**
   * Combine and load settings from command line, env and JSON if provided.
   * The loaded argv object will have known options copied to the settings.
   */
  load (keyPrefix?: string) {
    const opts: { [key: string]: yargs.Options } = {}
    for (let key in this.options) {
      key = hyphen(key)
      const opt = Object.assign({}, this.options[key])
      if (keyPrefix) key = `${keyPrefix}-${key}`
      opts[key] = opt
    }
    const prefix = (this.sourcePrefix)
      ? this.sourcePrefix.toUpperCase()
      : ''
    const pkgName = (this.sourcePrefix)
      ? `${this.sourcePrefix}Config`
      : `config`
    const fileName = (this.sourcePrefix)
      ? `${this.sourcePrefix}-config.json`
      : `config.json`
    const args = yargs
      .options(opts)
      .usage('\nUsage: $0 [args]')
      .env(prefix)
      .pkgConf(pkgName)
      .config(fileName)
      .alias('config', 'c')
      .example('config', `-c ${fileName}`)
      .help()
      .alias('h', 'help')
      .epilogue(this.info)
      .check(function (argv) {
        if (!argv.config || existsSync(argv.config)) return true
        else throw(new Error('Config file is not readable.'))
      })
      .fail((msg: string, err: Error) => {
        console.error(msg, err)
        console.info('Start with --help for config argument info.')
        if (err) throw err
      })
      .argv
    const loaded: { [key: string]: any } = {}
    for (let key in this.options) {
      loaded[key] = keyPrefix
        ? args[`${keyPrefix}-${key}`]
        : args[key]
    }
    this.settings = Object.assign({}, loaded, this.updates)
    return this.settings
  }

  /** Generic config getter */
  get (key: string) {
    key = hyphen(key)
    return this.settings[key]
  }

  /** Generic config setter */
  set (key: string, value: any) {
    key = hyphen(key)
    this.settings[key] = value
    this.updates[key] = value
  }

  /** Generic config clear */
  unset (key: string) {
    key = hyphen(key)
    delete this.settings[key]
    delete this.updates[key]
    const opt = this.options[key]
    if (opt) this.settings[key] = opt.default
  }

  /** Reload config without taking on post load settings. */
  reset () {
    this.options = Object.assign({}, this.initOptions)
    this.updates = {}
    this.load()
  }

  /** Add more options after load */
  extend (newOptions: IOptions) {
    this.options = Object.assign({}, this.options, newOptions)
  }
}

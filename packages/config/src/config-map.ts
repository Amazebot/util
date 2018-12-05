import { Config, IOptions } from './config'

interface IItems { [key: string]: Config }

/** A series of settings items with shared option definition. */
export class ConfigMap {
  /** Items in collection, share settings load/get/set. */
  items: IItems

  /** Create settings collection with initial options. */
  constructor (public options: IOptions, sourcePrefix?: string) {
    this.items = { 'default': new Config(this.options, sourcePrefix) }
  }

  /** Get an item in collection by key. */
  item = (key: string) => {
    if (Object.keys(this.items).indexOf(key) < 0) {
      this.items[key] = new Config(this.options)
    }
    return this.items[key]
  }

  /** Load the default item. */
  load = () => {
    for (let key in this.items) {
      (key === 'default')
        ? this.items[key].load()
        : this.items[key].load(key)
    }
  }

  /** Add more options after load. */
  extend (newOptions: IOptions) {
    this.options = Object.assign({}, this.options, newOptions) // for new items
    for (let key in this.items) this.item(key).extend(newOptions) // for current
  }
}

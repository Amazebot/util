
/** Utility for converting option keys, from fooBar to foo-bar. */
export function caps (str: string) {
  str = str.replace(/([a-z])([A-Z])/g, (g) => `${g[0]}_${g[1].toLowerCase()}`)
  if (str.toLowerCase() === str) str = str.toUpperCase()
  return str.replace(/-/g, '_')
}

/** Utility for converting option keys, from fooBar to FOO_BAR. */
export function hyphen (str: string) {
  if (str.toUpperCase() === str) str = str.toLowerCase()
  str = str.replace(/_/g, '-')
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
}

/** Utility for converting option keys, from foo-bar to fooBar */
export function camel (str: string) {
  if (str.toUpperCase() === str) str = str.toLowerCase()
  str = str.replace(/_/g, '-')
  return str.replace(/-([a-z])/gi, (g) => g[1].toUpperCase())
}

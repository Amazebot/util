/** Loggers need to provide the same set of methods. */
export interface ILogger {
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warning: (...args: any[]) => void
  error: (...args: any[]) => void
  replace?: (externalLog: ILogger) => void
}

/** Temp basic console logging, should override form adapter's log. */
class InternalLog implements ILogger {
  debug = (...args: any[]) => console.log(...args)
  info = (...args: any[]) => console.log(...args)
  warning = (...args: any[]) => console.warn(...args)
  error = (...args: any[]) => console.error(...args)
  replace = (externalLog: ILogger) => replace(externalLog)
}

/** Pointer for current (replaceable) log instance. */
let _external: ILogger | undefined

/** Pointer for logger temporarily replaced during silence. */
let _silent: ILogger | undefined

/** Store default logger, to restore after replace. */
const _internal: ILogger = new InternalLog()

/** Exported logger will have methods replaced. */
export const logger: ILogger = new InternalLog()

/** Substitute logging handler */
export const replace = (instance: ILogger) => {
  ['debug', 'info', 'warning', 'error'].every((method) => {
    if (!Object.keys(instance).includes(method as string)) {
      throw new Error(`External logger does not implement ${method}`)
    }
    return true
  })
  _external = instance
  logger.debug = instance.debug
  logger.info = instance.info
  logger.warning = instance.warning
  logger.error = instance.error
  return logger
}

/** Replace external log with internal (for testing reset). */
export const restore = () => {
  replace(_internal)
  _silent = undefined
  _external = undefined
}

/** Clone instance of current logger (mostly for testing). */
export const clone = (instance = logger) => {
  const clone = Object.create(instance)
  clone.debug = instance.debug
  clone.info = instance.info
  clone.warning = instance.warning
  clone.error = instance.error
  clone.replace = instance.replace
  return clone
}

/** Null all log outputs */
export function silence (enable = true) {
  if (enable) {
    _silent = (_external) ? clone(_external) : clone(_internal)
    return replace({
      debug: () => null,
      info: () => null,
      warning: () => null,
      error: () => null
    })
  }
  if (_silent) return replace(_silent)
}

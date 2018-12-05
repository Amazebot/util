# 📓 Logger
Basic log handling with overrides for use within other modules.
---

When building dependencies of more complex apps, you don't want to be too
opinionated about how logs are written, nor add more dependencies that might not
play with choices made in the app. However, you also don't want to hard code
`console.log` and end up with multiple output streams.

This package provides standard logging methods for packages requiring it. They
route to console.log by default, but apps requiring those packages can pass in
their own log utility, to overwrite the default methods (as long as the logger
instance is exported).

___

### Import logger in package

```
import { logger } from '@amazebot/logger'
```

Provides standard debug/info/warning/error methods

### Package re-exports logger

```
export const pkgLogger = logger
```

### Write your logs in packages

```
pkgLogger.info(`That's pretty much it.`)
```

Outputs to console by default, but allows override.

### Replace with external logger in app

```
import { logger } from 'amazing-logger'
import * as myPackage from 'my-package'
myPackage.logger.replace(logger)
```

Routes to debug/info/warning/error of new interface.

### Silence/restore logs before/after tests

```
import { silence } from '@amazebot/logger'
describe('test methods that log', () => {
  before(() => silence())
  after(() => silence(false))
})
```

Routes debug/info/warning/error to null output.
import pThrottle from 'p-throttle'

// defines our throttle rate
const throttle = pThrottle({ limit: 1, interval: 750 })

/**
 * The throttled function that will get called by our wrapper.
 * This is the function that gets throttled, so any actual calls need to be
 * called inside this one.
 *
 * @param fn The function that will get run
 */
const throttled = throttle(<TReturn>(fn: () => TReturn): TReturn => {
  return fn()
})

/**
 * Wraps or "curries" a function that will eventually call
 * the "throttled" method and run the passed function with the correct args.
 *
 * @param fn The function that will get run
 */
export const withThrottle =
  <TArgs extends readonly unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
  ) =>
  (...args: TArgs): TReturn => {
    // I hate to typecast here, but I wrestled with TS for too long on this.
    // Open to any bright ideas, otherwise we'll just have to leave it this way.
    return throttled(() => fn(...args)) as TReturn
  }

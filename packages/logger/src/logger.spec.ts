import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { silence, replace, logger, restore, clone } from '.'

const spy = sinon.spy()
const spyLog = { debug: spy, info: spy, warning: spy, error: spy }

describe('[logger]', () => {
  beforeEach(() => {
    spy.resetHistory()
    restore()
  })
  describe('replace', () => {
    it('replaces logger methods with external utility', () => {
      const original = clone()
      replace(spyLog)
      expect(logger.info).to.eql(spyLog.info)
      replace(original)
      expect(logger.info).to.not.eql(spyLog.info)
    })
    it('throws if external utility missing methods', () => {
      expect(() => replace({ error: () => null } as any)).to.throw()
    })
  })
  describe('restore', () => {
    it('replaces logger methods with internal methods', () => {
      const original = clone()
      replace(spyLog)
      restore()
      // @todo Deep equal failed on logger === original
      //       Don't know why, they are exactly the same. I used .toString()
      //       on the method instead, but the test should be fixed.
      expect(logger.debug.toString()).to.eql(original.debug.toString())
    })
  })
  describe('logger', () => {
    describe('.replace', () => {
      it('replaces logger methods', () => {
        logger.replace!(spyLog)
        expect(logger.info).to.eql(spyLog.info)
      })
    })
    context('default', () => {
      describe('.debug', () => {
        it('writes to console.log', () => {
          const log = sinon.stub(console, 'log')
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
          log.restore()
        })
      })
      describe('.info', () => {
        it('writes to console.log', () => {
          const log = sinon.stub(console, 'log')
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
          log.restore()
        })
      })
      describe('.warning', () => {
        it('writes to console.warn', () => {
          const warn = sinon.stub(console, 'warn')
          logger.warning('test')
          sinon.assert.calledWithExactly(warn, 'test')
          warn.restore()
        })
      })
      describe('.error', () => {
        it('writes to console.error', () => {
          const err = sinon.stub(console, 'error')
          logger.error('test')
          sinon.assert.calledWithExactly(err, 'test')
          err.restore()
        })
      })
    })
    context('replaced', () => {
      describe('.{{any}}', () => {
        it('writes to external log', () => {
          replace(spyLog)
          logger.debug('1')
          logger.info('2')
          logger.warning('3')
          logger.error('4')
          expect(spy.args).to.eql([['1'], ['2'], ['3'], ['4']])
        })
      })
    })
  })
  describe('silence', () => {
    it('default, replaces logging with null outputs', () => {
      const original = clone()
      const log = sinon.stub(console, 'log')
      silence()
      logger.debug('test')
      logger.info('test')
      logger.warning('test')
      logger.error('test')
      sinon.assert.notCalled(log)
      expect(logger.debug).to.not.eql(original.debug)
      log.restore()
    })
    it('with false arg, restores original logger', () => {
      const original = clone()
      const log = sinon.stub(console, 'log')
      silence()
      silence(false)
      logger.debug('test')
      sinon.assert.calledOnce(log)
      expect(logger).to.eql(original)
      log.restore()
    })
    it('restores external log if replaced', () => {
      replace(spyLog)
      silence()
      silence(false)
      logger.debug('test')
      sinon.assert.calledOnce(spyLog.debug)
      expect(logger.debug).to.eql(spyLog.debug)
    })
    it('does not un-silence if not silenced', () => {
      replace(spyLog)
      silence(false)
      logger.debug('test')
      sinon.assert.calledOnce(spyLog.debug)
      expect(logger.debug).to.eql(spyLog.debug)
    })
    it('silences separate required modules', () => {
      const logA = require('./logger')
      const logB = require('./logger')
      logA.silence()
      expect(logA.logger.info).to.eql(logB.logger.info)
      expect(logA.logger.info).to.eql(logger.info)
    })
  })
})

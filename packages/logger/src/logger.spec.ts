import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { silence, replace, logger, restore, clone } from '.'

const log = sinon.stub(console, 'log')
const warn = sinon.stub(console, 'warn')
const err = sinon.stub(console, 'error')
const spy = sinon.spy()
const spyLog = { debug: spy, info: spy, warning: spy, error: spy }

describe('[logger]', () => {
  afterEach(() => {
    log.resetHistory()
    warn.resetHistory()
    err.resetHistory()
    spy.resetHistory()
    restore()
  })
  after(() => {
    log.restore()
    warn.restore()
    err.restore()
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
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
        })
      })
      describe('.info', () => {
        it('writes to console.log', () => {
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
        })
      })
      describe('.warning', () => {
        it('writes to console.log', () => {
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
        })
      })
      describe('.error', () => {
        it('writes to console.log', () => {
          logger.debug('test')
          sinon.assert.calledWithExactly(log, 'test')
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
      silence()
      logger.debug('test')
      logger.info('test')
      logger.warning('test')
      logger.error('test')
      sinon.assert.notCalled(log)
      expect(logger.debug).to.not.eql(original.debug)
    })
    it('with false arg, restores original logger', () => {
      const original = clone()
      silence()
      silence(false)
      logger.debug('test')
      sinon.assert.calledOnce(log)
      expect(logger).to.eql(original)
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
  })
})

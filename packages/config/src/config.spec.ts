import 'mocha'
import { expect } from 'chai'
import { Config, IOptions } from '.'
let initOpts: IOptions = { 'test-setting': { type: 'boolean', default: false } }

describe('[config]', () => {
  beforeEach(() => process.env.TEST_SETTING = undefined)
  describe('Config', () => {
    describe('.load', () => {
      it('loads option defaults', () => {
        const config = new Config(initOpts)
        config.load()
        expect(config.settings).to.have.property('test-setting', false)
      })
      it('loads defined options from env', () => {
        const config = new Config(initOpts)
        process.env.TEST_SETTING = 'true'
        config.load()
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('loads defined options from env with source prefix', () => {
        const config = new Config(initOpts, 'foo')
        process.env.FOO_TEST_SETTING = 'true'
        config.load()
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('loads options defined after init', () => {
        const config = new Config(initOpts)
        config.options['test-custom'] = { type: 'boolean', default: true }
        config.load()
        expect(config.settings).to.have.property('test-custom', true)
      })
      it('retains set values after load (instead of defaults)', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('test-setting', true)
        config.load()
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('loads config with key prefix', () => {
        const config = new Config(initOpts)
        process.env.PREFIX_TEST_SETTING = 'true'
        config.load('prefix')
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('loads config with source prefix and key prefix', () => {
        const config = new Config(initOpts, 'foo')
        process.env.FOO_PREFIX_TEST_SETTING = 'true'
        config.load('prefix')
        expect(config.settings).to.have.property('test-setting', true)
      })
    })
    describe('.reset', () => {
      it('returns assigned config to defaults', () => {
        const config = new Config(initOpts)
        config.load()
        config.settings['test-setting'] = true
        config.reset()
        expect(config.settings).to.have.property('test-setting', false)
      })
      it('returns set values to defaults', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('testSetting', true)
        config.reset()
        expect(config.settings).to.have.property('test-setting', false)
      })
      it('re-assigns environment vars overriding defaults', () => {
        const config = new Config(initOpts)
        process.env.TEST_SETTING = 'true'
        config.reset()
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('nothing inherited after reload', () => {
        const config = new Config(initOpts)
        config.load()
        config.settings['test-custom'] = true
        config.reset()
        expect(config.settings).to.not.have.property('test-custom')
      })
    })
    describe('.get', () => {
      it('returns setting value', () => {
        const config = new Config(initOpts)
        config.load()
        expect(config.get('test-setting')).to.equal(false)
      })
    })
    describe('.set', () => {
      it('assigns given setting', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('test-setting', true)
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('retains set values after load', () => {
        const config = new Config(initOpts)
        config.set('test-setting', true)
        config.load()
        expect(config.settings).to.have.property('test-setting', true)
      })
      it('retains config after extending changes default', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('test-setting', false)
        config.extend({ 'test-setting': { type: 'boolean', default: true } })
        config.load()
        expect(config.settings).to.have.property('test-setting', false)
      })
    })
    describe('.unset', () => {
      it('restores defaults for known options', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('test-setting', true)
        config.unset('test-setting')
        expect(config.settings).to.have.property('test-setting', false)
      })
      it('unknown options return to undefined', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('mystery-setting', true)
        config.unset('mystery-setting')
        expect(config.settings).to.not.have.property('mystery-setting')
      })
      it('subsequent loads get defaults', () => {
        const config = new Config(initOpts)
        config.load()
        config.set('test-setting', true)
        config.unset('test-setting')
        config.load()
        expect(config.settings).to.have.property('test-setting', false)
      })
    })
    describe('.extend', () => {
      it('allows defining new options after load', () => {
        const config = new Config(initOpts)
        process.env.TEST_EXTEND = 'true'
        config.load()
        expect(typeof config.settings['test-extend']).to.equal('undefined')
        config.extend({ 'test-extend': { type: 'boolean' } })
        config.load()
        expect(config.settings['test-extend']).to.equal(true)
      })
    })
  })
})

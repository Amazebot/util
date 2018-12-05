import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { ConfigMap } from '.'
const initOpts: any = { 'test-setting': { type: 'boolean', default: false } }

describe('[config]', () => {
  describe('config-map', () => {
    describe('.item', () => {
      it('returns config item by key', () => {
        const map = new ConfigMap(initOpts)
        expect(map.item('default')).to.eql(map.items.default)
      })
      it('creates config item if key not found', () => {
        const map = new ConfigMap(initOpts)
        map.item('extra')
        expect(map.items.extra.constructor.name).to.equal('Config')
      })
    })
    describe('.load', () => {
      it('calls .load on all config items', () => {
        const map = new ConfigMap(initOpts)
        map.item('alt')
        const stubA = sinon.stub(map.items.default, 'load')
        const stubB = sinon.stub(map.items.alt, 'load')
        map.load()
        sinon.assert.calledOnce(stubA)
        sinon.assert.calledOnce(stubB)
      })
    })
    describe('.extend', () => {
      it('extends existing config item', () => {
        const map = new ConfigMap(initOpts)
        const stub = sinon.stub(map.items.default, 'extend')
        const newOpts: any = { 'new': { type: 'boolean', default: false } }
        map.extend(newOpts)
        sinon.assert.calledWithExactly(stub, newOpts)
      })
      it('new config items created with extended options', () => {
        const map = new ConfigMap(initOpts)
        const newOpts: any = { 'new': { type: 'boolean', default: false } }
        map.extend(newOpts)
        const newItem = map.item('new')
        expect(newItem.options).to.eql(Object.assign({}, initOpts, newOpts))
      })
    })
  })
})

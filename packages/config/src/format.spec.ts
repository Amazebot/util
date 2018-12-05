import 'mocha'
import { expect } from 'chai'
import { caps, hyphen, camel } from '.'

describe('[config]', () => {
  describe('format', () => {
    describe('.caps', () => {
      it('converts hyphenated to all caps', () => {
        expect(caps('my-var')).to.equal('MY_VAR')
      })
      it('converts camel case to all caps', () => {
        expect(caps('myVar')).to.equal('MY_VAR')
      })
      it('leaves all caps unchanged', () => {
        expect(caps('MY_VAR')).to.equal('MY_VAR')
      })
    })
    describe('.hyphen', () => {
      it('converts all caps to hyphenated', () => {
        expect(hyphen('MY_VAR')).to.equal('my-var')
      })
      it('converts camel case to hyphenated', () => {
        expect(hyphen('myVar')).to.equal('my-var')
      })
      it('leaves hyphenated unchanged', () => {
        expect(hyphen('my-var')).to.equal('my-var')
      })
    })
    describe('.camel', () => {
      it('converts env format to camel case', () => {
        expect(camel('MY_VAR')).to.equal('myVar')
      })
      it('converts hyphenated to camel case', () => {
        expect(camel('my-var')).to.equal('myVar')
      })
      it('leaves camel case unchanged', () => {
        expect(camel('myVar')).to.equal('myVar')
      })
    })
  })
})

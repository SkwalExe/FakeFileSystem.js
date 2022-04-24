const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

const names = {
  hello: true,
  'hello.txt': true,
  'hello.txt.txt': true,
  'he//o': false,
  'hello/': false,
  'hello/world': false,
  'h*llo': false,
  'hello>': false,
  '.hello': true
}

describe('isValidName()', () => {
  for (const name in names) {
    const expected = names[name]
    it(`${expected} -> ${name}`, () => {
      equal(ffs.isValidName(name), expected)
    })
  }
})

const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

const files = [
  ['/..', '/./..', true],
  ['/', '/', true],
  ['/myFile.txt', '/myFile.txt', true],
  ['/myDir', '/myDir', true],
  ['/myFile.txt', '/notMyFile.txt', false]
]

describe('isSameFile()', () => {
  files.forEach(file => {
    const expected = file[2]
    it(`${expected} -> ${file[0]} and ${file[1]}`, () => {
      equal(ffs.isSameFile(file[0], file[1]), expected)
    })
  })
})

const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

const files = {
  '/..': true,
  '/.': true,
  '/': true,
  '/myDir': true,
  '/myFile.txt': true,
  '/non-existant': false
}

ffs.createDir('/', 'myDir')
ffs.createFile('/', 'myFile.txt')

describe('fileExists()', () => {
  for (const file in files) {
    const expected = files[file]
    it(`${expected} -> ${file}`, () => {
      equal(ffs.fileExists(file), expected)
    })
  }
})

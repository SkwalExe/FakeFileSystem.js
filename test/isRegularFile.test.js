const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

const files = {
  '/..': false,
  '/.': false,
  '/': false,
  '/myDir': false,
  '/myFile.txt': true,
  '/non-existant': false
}

ffs.createDir('/', 'myDir')
ffs.createFile('/', 'myFile.txt')

describe('isDir()', () => {
  for (const file in files) {
    const expected = files[file]
    it(`${expected} -> ${file}`, () => {
      equal(ffs.isRegularFile(file), expected)
    })
  }
})

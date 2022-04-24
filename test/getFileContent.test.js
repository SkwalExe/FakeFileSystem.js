const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

ffs.createFile('/', 'myFile.txt', 'Hello World!')
ffs.createDir('/', 'myDir')

const files = [
  [true, '/myFile.txt', 'Hello World!'],
  [false, '/'],
  [false, '/myDir'],
  [false, '/non-existant'],
  [false, '/myDir/non-existant']
]

describe('getFileContent()', () => {
  files.forEach(file => {
    const expectedResult = file[0]
    const fileName = file[1]
    const expectedContent = file[2]

    it(`${expectedResult ? '\'' + expectedContent + '\'' : 'Error'} -> ${fileName}`, () => {
      equal(ffs.getFileContent(fileName).success, expectedResult)
      if (expectedResult) {
        equal(ffs.getFileContent(fileName).result, expectedContent)
      }
    })
  })
})

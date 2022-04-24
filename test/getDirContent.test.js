const FFS = require('../src/index.js')
const equal = require('assert').equal

const ffs = new FFS()

const dir = ffs.createDir('/', 'myDir').result
ffs.createFile('/myDir/', 'myFile.txt', 'Hello World!')
const root = ffs.getPath('/').result

const files = [
  [false, '/myFile.txt'],
  [true, '/', root.content],
  [true, '/myDir', dir.content],
  [false, '/non-existant'],
  [false, '/myDir/non-existant'],
  [true, '/myDir/../myDir/.', dir.content]
]

describe('getFileContent()', () => {
  files.forEach(file => {
    const expectedResult = file[0]
    const dirName = file[1]
    const expectedContent = file[2]

    it(`${expectedResult ? 'Files' : 'Error'} -> ${dirName}`, () => {
      equal(ffs.getDirContent(dirName).success, expectedResult)
      if (expectedResult) {
        equal(ffs.getDirContent(dirName).result, expectedContent)
      }
    })
  })
})

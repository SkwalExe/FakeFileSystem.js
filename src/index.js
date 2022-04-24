// FakeFileSystem.js
// https://github.com/SkwalExe/FakeFileSystem.js
// LICENSE: MIT
/// /////////////////////

class FFS {
  constructor () {
    /**
     * Different errors that can be returned by the FFS.
     * @type {Object}
     */
    this.Errors = {
      NOT_FOUND: 'No such file or directory',
      NOT_A_REGULAR_FILE: 'Not a regular file',
      NOT_A_DIRECTORY: 'Not a directory',
      FILE_ALREADY_EXISTS: 'File or directory already exists',
      SAME_FILE: 'Source and destination are the same',
      INVALID_NAME: 'Invalid file name, must ba at least one character long and cannot contain \\ / : * ? " < > |',
      ROOT_PROHIBITED: 'You cannot perform this operation on the root directory'
    }
    /**
       * This class is returned by most of the FFS functions.
       * @typedef {Object} Result
       * @property {String} result.error - The error message.
       * @property {Boolean} result.success - True if the operation was successful.
       * @property {any} result.result - The data returned by the operation.
       * @property {String} result.errorCause - the file that caused the error.
       */
    this.Result = class {
      constructor () {
        /**
           * Whether the operation was successful or not
           * @type {boolean}
           */
        this.success = false
        /**
             * a message describing the error, if any
             * @type {?string}
             */
        this.error = null
        /**
             * the data returned by the operation, if any
             * @type {?Object}
             */
        this.result = null
        /**
             * the file or directory that causes the error, if any
             * @type {?string}
             */
        this.errorCause = null
      }
    }
    /** @property {Array} FFS.tree the file system tree, contains all files and directories */
    this.tree = [{
      /**
       * The type of the file - 'file' or 'directory'
       * @type {string}
       */
      type: 'directory',
      /**
       * The name of the file or directory, can't contain '/' except for the root directory
       * @type {string}
       */
      name: '/',
      /**
       * The timestamp of the last modification of the file or directory
       * @type {number}
       */
      modified: Date.now(),
      /**
       * The path of the parent directory
       * @type {string}
       */
      parent: '/',

      /**
       * The children if its a directory or the content of the file if its a regular file
       * @type {Array | string}
       */
      content: []
    }]

    /**
     * The current working directory
     * @type {string}
     * @default "/"
     */
    this.currentDirectory = '/' // the current directory

    /** this functions returns the informations about a path
     * @returns {Result}
     *
     * @example
     * let file = FFS.getPath("/hello/test.txt")
     * if (!file.success)
     *     return console.log(file.error)
     *
     * file = file.result
     * console.log(file.type) // 'file'
     * console.log(file.name) // 'test.txt'
     * console.log(file.modified) // the last modified date of the file
     * console.log(file.parent) // '/hello'
     * console.log(file.content) // the content of the file
     * @param {string} path the path to the file or directory
     */
    this.getPath = function (path) {
      // the result is returned as a FFS.Result class
      const result = new this.Result()

      // remove trailing slashes, and useless chars
      path = this.simplifyPath(path)

      // if the path is '/' return the root directory
      if (path === '/') {
        result.success = true
        result.result = this.tree[0]
        return result
      }

      // remove the first '/' to avoit empty elements when splitting the path
      if (path.startsWith('/')) { path = path.substring(1) }

      // the current directory we are looking in
      let currentDirectory = this.tree[0]

      // split the path into its parts
      const pathArr = path.split('/')

      // loop through the path parts
      for (let i = 0; i < pathArr.length; i++) {
        // the file or directory we are looking for
        const file = pathArr[i]

        // if the current directory is not a directory, return an error
        if (currentDirectory.type === 'file') {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = currentDirectory.name
          return result
        }

        // if we are at the last directory of the path
        if (i === pathArr.length - 1) {
          // if the file is found return it else return an error
          if (currentDirectory.content.find(f => f.name === file)) {
            result.result = currentDirectory.content.find(f => f.name === file)
            result.success = true
          } else {
            result.error = this.Errors.NOT_FOUND
            result.errorCause = file
          }
          return result
        }

        // if the next directory to look in is not found, return an error
        if ((currentDirectory = currentDirectory.content.find(e => e.name === file)) === undefined) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = file
          return result
        }
      }
    }

    /** Check if a file or directory exists
     * @param {string} path the path to the file or directory
     * @returns {boolean} - whether the file exists or not
     *
     * @example
     * FFS.fileExists("/test") // true
     * FFS.fileExists("/myDirectory/") // true
     * FFS.fileExists("/DOES_NOT_EXIST") // false
     */
    this.fileExists = function (path) {
      // try to get the file
      const result = this.getPath(path)
      // return whether the operation was successful or not
      return result.success
    }

    /** Check if a file is a regular file (not a directory)
     * @param {string} path the path to the file
     * @returns {boolean} - whether the file is a regular file or not
     *
     * @example
     * FFS.isRegularFile("/test.txt") // true
     * FFS.isRegularFile("/directory/") // false
     * FFS.isRegularFile("/DOES_NOT_EXIST") // false
     * FFS.isRegularFile("/directory/test.txt") // true
     */
    this.isRegularFile = function (path) {
      // try to get the file
      const result = this.getPath(path)
      // if the operation was successful
      // -> return whether the file is a regular file or not
      // else return false
      if (result.success) { return result.result.type === 'file' }
      return false
    }

    /** Check if a file is a directory (not a regular file)
     * @param {string} path the path to the directory
     * @returns {boolean} - whether the directory exists or not
     *
     * @example
     * FFS.isDir("/test.txt") // false
     * FFS.isDir("/myDirectory/") // true
     * FFS.isDir("/DOES_NOT_EXIST/") // false
     */
    this.isDir = function (path) {
      // try to get the file
      const result = this.getPath(path)
      // if the operation was successful
      // -> return whether the file is a directory or not
      // else return false
      if (result.success) { return result.result.type === 'directory' }
      return false
    }
    /** Get the content of a regular file
       * @param {string} path the path to the file
       * @returns {Result}
       *
       * @example
       * let file = FFS.getFileContent("/test.txt")
       * if (!file.success)
       *    return console.log(file.error)
       * console.log(file.result) // the content of the file
       */
    this.getFileContent = function (path) {
      // we return the result as a FFS.Result class
      const result = new this.Result()
      // if the file is a regular file
      // return its content
      if (this.isRegularFile(path)) {
        result.success = true
        result.result = this.getPath(path).result.content
        return result
      } else if (this.isDir(path)) {
        // if the file is a directory, return an error
        result.error = this.Errors.NOT_A_REGULAR_FILE
        result.errorCause = path

        return result
      } else {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path

        return result
      }
    }

    /** Get the content of a directory
     * @param {string} path the path to the directory
     * @returns {Result}
     *
     * @example
     * let directory = FFS.getDirContent("/myDirectory/")
     * if (!directory.success)
     *   return console.log(directory.error)
     * console.log(directory.result) // The content of the directory as an array
     */
    this.getDirContent = function (path) {
      // we return the result as a FFS.Result class
      const result = new this.Result()
      // if the file is a directory
      // return its content
      if (this.isDir(path)) {
        result.success = true
        result.result = this.getPath(path).result.content
        return result
      } else if (this.isRegularFile(path)) {
        // if the file is a regular file and not a dir, return an error
        result.error = this.Errors.NOT_A_DIRECTORY
        result.errorCause = path
        return result
      } else {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path
        return result
      }
    }
    /** writes content to a file
       *
       * Creates the file if it does not exist
       * @param {string} path the path to the file
       * @param {string} content the content to write to the file
       * @param {boolean} append whether to append to the file or not
       * @returns {Result} The file object
       *
       * @example
       *
       * let result = FFS.writeFile("/test.txt", "Hello World!")
       * console.log(result.result) // the file object
       */
    this.writeFile = function (path, content, append = false) {
      // we return the result as a FFS.Result class
      const result = new this.Result()
      // check if the file exists
      if (this.fileExists(path)) {
        // if it exists
        // check if it is a regular file
        if (this.isRegularFile(path)) {
          const file = this.getPath(path).result

          if (append) {
            // append the content to the file
            file.content += content
          } else {
            // overwrite the content of the file
            file.content = content
          }
          // return the file object
          result.success = true
          result.result = file
          return result
        } else {
          // if it is not a regular file, return an error
          result.error = this.Errors.NOT_A_REGULAR_FILE
          result.errorCause = path
          return result
        }
      } else {
        // create the file
        result.success = true
        result.result = this.createFile(path, content)
        return result
      }
    }
    /** Creates a file
       * @param {string} path the directory to create the file in
       * @param {string} filename the name of the file
       * @param {string} content the content of the file
       * @returns {Result}
       *
       * @example
       *
       * let result = FFS.writeFile("/", "test.txt", "Hello World!")
       * if (!result.success)
       *   return console.log(result.error)
       * console.log(result.result) // the created file
       *
       * let result = FFS.writeFile("/DOES_NOT_EXIST/", "test.txt")
       * if (!result.success)
       *   return console.log(result.error) // no such file or directory
       *                                    // result.errorCause = "/DOES_NOT_EXIST/"
       * ...
       */
    this.createFile = function (path, filename, content = '') {
      // we return the result as a FFS.Result class
      const result = new this.Result()

      // check if file name is valid
      if (!this.isValidName(filename)) {
        result.error = this.Errors.INVALID_NAME
        result.errorCause = filename
        return result
      }
      // if the file already exists
      if (this.fileExists(path + '/' + filename)) {
        result.error = this.Errors.FILE_ALREADY_EXISTS
        result.errorCause = this.simplifyPath(path + '/' + filename)
        return result
      }

      // the data for our new file
      const file = {
        type: 'file',
        name: filename,
        modified: Date.now(),
        parent: path,
        content
      }

      // check if the parent directory exists
      // and check if it is a directory
      if (!this.fileExists(path)) {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path
        return result
      } else if (!this.isDir(path)) {
        result.error = this.Errors.NOT_A_DIRECTORY
        result.errorCause = path
        return result
      }

      // get the parent directory
      const parent = this.getPath(path).result

      // push the new file to the parent directory
      parent.content.push(file)

      result.success = true
      result.result = file
      return result
    }
    /** creates a directory
       * @param {string} path the directory to create the directory in
       * @param {string} dirname the name of the directory
       * @returns {Result}
       *
       * @example
       *
       * let result = FFS.createDirectory("/", "myDirectory")
       * if (!result.success)
       *   return console.log(result.error)
       * console.log(result.result) // the created directory
       */
    this.createDir = function (path, dirname) {
      // we return the result as a FFS.Result class
      const result = new this.Result()

      // check if name is valid
      if (!this.isValidName(dirname)) {
        result.error = this.Errors.INVALID_NAME
        result.errorCause = dirname
        return result
      }

      // check if a file already exists
      if (this.fileExists(path + '/' + dirname)) {
        result.error = this.Errors.FILE_ALREADY_EXISTS
        result.errorCause = this.simplifyPath(path + '/' + dirname)
        return result
      }

      // the data for our new directory
      const dir = {
        type: 'directory',
        name: dirname,
        modified: Date.now(),
        parent: path,
        content: []
      }

      // check if the parent directory exists
      // and check if it is a directory
      if (!this.fileExists(path)) {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path
        return result
      } else if (!this.isDir(path)) {
        result.error = this.Errors.NOT_A_DIRECTORY
        result.errorCause = path
        return result
      }

      // get the parent directory
      const parent = this.getPath(path).result
      // push the new directory to the parent directory
      parent.content.push(dir)

      result.success = true
      result.result = dir
      return result
    }

    /** Simplifies a path
     * @param {string} path the path to simplify
     * @returns {string} the simplified path
     *
     * - Remove leading and trailing whitespace
     * - Removes the trailing slash
     * - parse the '.' and '..'
     * - replace all "//" by "/"
     * - ...
     *
     * @example
     *
     * "/myDirectory/../myDirectory/test.txt" -> "/myDirectory/test.txt"
     *
     * "  /myDirectory/././../myDirectory/./test.txt" -> "/myDirectory/test.txt"
     */
    this.simplifyPath = function (path) {
      // remove trailing and leading whitespaces
      path = path.trim()

      // return current path if it is empty
      if (path === '') { return this.currentDirectory }

      // replace all "//" by "/"
      while (path.indexOf('//') !== -1) { path = path.replace(/\/\//g, '/') }

      // return '/' if the path is '/'
      if (path === '/') { return '/' }

      // remove the trailing slash
      if (path.endsWith('/')) { path = path.substring(0, path.length - 1) }

      // replace leading './' with absolute path
      if (path.startsWith('./')) { path = this.simplifyPath(this.currentDirectory + '/' + path.substring(2)) }

      // replace leading '../' with absolute path
      if (path.startsWith('../')) {
        const parent = this.getPath(this.currentDirectory).result

        path = this.simplifyPath(parent.parent + path.substring(2))
      }

      // add current directory if the path does not start with '/'
      if (!path.startsWith('/')) { return this.simplifyPath(this.currentDirectory + '/' + path) }

      // parse '.' and '..'
      let pathArr = path.split('/')
      // remove ''
      pathArr = pathArr.filter(e => e !== '')
      const result = []
      for (let i = 0; i < pathArr.length; i++) {
        const file = pathArr[i]
        if (file === '.') { continue }
        if (file === '..') {
          if (result.length > 0) { result.pop() }
          continue
        }

        result.push(file)
      }

      return '/' + result.join('/')
    }

    /** Deletes a file or directory
     *
     * @param {string} path
     * @returns {Result} The deleted file or directory
     *
     * @example
     *
     * let result = FFS.deleteFile("/myDirectory/test.txt")
     * if (!result.success)
     *     return console.log(result.error)
     * console.log(result.result) // the deleted file
     */
    this.delete = function (path) {
      // we return the result as a FFS.Result class
      const result = new this.Result()

      // check if path is not root directory
      if (path === '/') {
        result.error = this.Errors.ROOT_PROHIBITED
        result.errorCause = path
        return result
      }

      // check if the file exists
      if (!this.fileExists(path)) {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path
        return result
      }
      // get the file
      const file = this.getPath(path).result

      // get the parent directory
      const parent = this.getPath(file.parent).result

      // remove the file from the parent directory
      parent.content = parent.content.filter(e => e !== file)

      // return the file data
      result.success = true
      result.result = file
      return result
    }

    /** Get parent directory
     * @param {string} path
     * @returns {Result}
     *
     * @example
     *
     * let result = FFS.getParent("/myDirectory/test.txt")
     * if (!result.success)
     *   return console.log(result.error)
     * console.log(result.result) // the parent directory {name: 'myDirectory'...}
     */
    this.getParent = function (path) {
      // we return the result as a FFS.Result class
      const result = new this.Result()

      // simplify the path
      path = this.simplifyPath(path)

      // remove everything after the last '/'
      path = path.substring(0, path.lastIndexOf('/'))

      if (path === '') { path = '/' }

      // if the parent directory does not exist
      if (!this.fileExists(path)) {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = path
        return result
      }

      // get the parent directory
      result.result = this.getPath(path).result

      result.success = true
      return result
    }

    /** Extract the base name of a path
     * @param {string} path
     * @returns {string} the base name
     *
     * @example
     *
     * FFS.getBaseName("/myDirectory/test.txt") -> "test.txt"
     * FFS.getBaseName("/myDirectory/") -> "myDirectory"
     * FFS.getBaseName("/") -> "/"
     */
    this.basename = function (path) {
      path = this.simplifyPath(path)
      // check if the path is not root directory
      if (path === '/') { return '/' }
      return path.substring(path.lastIndexOf('/') + 1)
    }

    /** Get the path of the parent directory of a file
     * @param {string} path
     * @returns {string} the path of the parent directory
     *
     * @example
     *
     * FFS.getParentPath("/myDirectory/test.txt") -> "/myDirectory"
     */
    this.getParentPath = function (path) {
      path = this.simplifyPath(path)
      // check if the path is not root directory
      if (path === '/') { return '/' }

      return path.substring(0, path.lastIndexOf('/'))
    }

    /** Get the full path of a file
     * @param {Object} file
     * @returns {string} the full path
     *
     * @example
     *
     * let file = FFS.getPath("/myDirectory/test.txt").result
     * console.log(FFS.getFullPath(file)) // the full path of the file
     */
    this.getFullPath = function (file) {
      return this.simplifyPath(file.parent + '/' + file.name)
    }

    /** Checks if two path refer to the same file
     * @param {string} path1
     * @param {string} path2
     * @returns {boolean} true if the two paths refer to the same file
     *
     * @example
     *
     * FFS.isSameFile("/myDirectory/test.txt", "/myDirectory/test.txt") -> true
     * FFS.isSameFile("/myDirectory../myDirectory/test.txt", "/myDirectory/test.txt") -> true
     */
    this.isSameFile = function (path1, path2) {
      path1 = this.simplifyPath(path1)
      path2 = this.simplifyPath(path2)

      return path1 === path2
    }

    /** test whether a file name is valid or not
     * @param {string} name
     * @returns {boolean} true if the file name is valid
     *
     * - file name must not contain \ / : * ? " < > | " '
     * - file name must be at least one character long
     * - file name must not be '.' or '..'
     *
     * @example
     *
     * FFS.isValidName("test.txt") -> true
     * FFS.isValidName("test/test.txt") -> false
     * FFS.isValidName("test:test.txt") -> false
     * FFS.isValidName("test<test.txt") -> false
     * FFS.isValidName("test>test.txt") -> false
     * FFS.isValidName("test?test.txt") -> false
     * FFS.isValidName("test*test.txt") -> false
     * FFS.isValidName("test|test.txt") -> false
     * FFS.isValidName("test\"test.txt") -> false
     * FFS.isValidName("test\\test.txt") -> false
     * FFS.isValidName(" ") -> false
     * FFS.isValidName("") -> false
     * FFS.isValidName(".") -> false
     * FFS.isValidName("..") -> false
     *
     * ...
     */
    this.isValidName = function (name) {
      name = name.trim()
      // check if the name is at least one character long
      if (!name.length > 0) { return false }

      // check if the name is '.' or '..'
      if (name === '.' || name === '..') { return false }

      // check if the name contains any of the following characters
      if (/[\\/:*?"<>|']/.test(name)) { return false }

      // if we reach this point, the name is valid
      return true
    }

    /** Copy a file or directory
     * @param {string} source the file to copy
     * @param {string} destination the destination path
     * @returns {Result} the copied file or directory
     *
     * @example
     *
     * let result = FFS.copy("/myDirectory/test.txt", "/myDirectory/test2.txt")
     * console.log(FFS.getDirContent("/myDirectory")) /
     * // [
     * //     {name: 'test.txt', ...},
     * //     {name: 'test2.txt', ...}
     * // ]
     *
     */
    this.copy = function (source, destination) {
      // we return the result as a FFS.Result class
      const result = new this.Result()

      // check if source is not the root directory
      if (this.simplifyPath(source) === '/') {
        result.error = this.Errors.ROOT_PROHIBITED
        result.errorCause = source
        return result
      }

      // check if source file exists
      if (!this.fileExists(source)) {
        result.error = this.Errors.NOT_FOUND
        result.errorCause = source
        return result
      }

      // check if source and destination are the same
      if (this.isSameFile(source, destination)) {
        result.error = this.Errors.SAME_FILE
        result.errorCause = source
        return result
      }

      // get source file
      const file = this.getPath(source).result

      // if the destination file does not exist
      if (!this.fileExists(destination)) {
        // if the parent of the destination file does not exist
        if (!this.getParent(destination).success) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = this.getParentPath(destination)
          return result
        }

        // if the parent of the destination file is not a directory
        if (!this.isDir(this.getParentPath(destination))) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = this.getParentPath(destination)
          return result
        }

        // if the parent of the destination file is a directory
        // create the destination file inside it
        const destinationParent = this.getParent(destination).result

        const newFile = {
          name: this.basename(destination),
          type: file.type,
          content: file.content,
          modified: Date.now(),
          parent: this.getFullPath(destinationParent)
        }

        destinationParent.content.push(newFile)

        result.success = true
        result.result = newFile
        return result
      } else {
        // if the destination file exists
        // if file is not a directory
        if (!this.isDir(destination)) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = destination
          return result
        }

        // if a file with the same name already exists in the destination directory
        if (this.fileExists(destination + '/' + file.name)) {
          result.error = this.Errors.FILE_ALREADY_EXISTS
          result.errorCause = destination + '/' + file.name
          return result
        }

        // copy the file in the destination directory
        destination = this.getPath(destination).result
        const newFile = {
          name: file.name,
          type: file.type,
          content: file.content,
          parent: destination.parent + '/' + destination.name,
          modified: Date.now()
        }

        // add the file to the destination directory
        destination.content.push(newFile)

        result.success = true
        result.result = newFile
        return result
      }
    }

    /** Move a file or directory
     * @param {string} source the file to move
     * @param {string} destination the destination path
     * @returns {Result} the moved file or directory
     *
     * @example
     *
     * FFS.writeFile("/myDirectory", "test.txt")
     *
     * FFS.move("/myDirectory/test.txt", "/myDirectory/test2.txt")
     *
     * console.log(FFS.getDirContent("/myDirectory"))
     * // [
     * //     {name: 'test2.txt', ...}
     * // ]
     */
    this.move = function (source, destination) {
      const result = new this.Result()
      source = this.simplifyPath(source)
      destination = this.simplifyPath(destination)

      const operation = this.copy(source, destination)

      if (!operation.success) {
        result.error = operation.error
        result.errorCause = operation.errorCause
        return result
      }

      // remove the source file
      this.delete(source)

      result.success = true
      result.result = operation.result
      return result
    }
  }
}

if (typeof module !== 'undefined') {
  /**
 * @module FFS
 * @type {FFS}
 * @see {@link https://github.com/SkwalExe/FakeFileSystem.js}
 *
 * @example
 *
 * const FFS = require("ffs")
 *
 * var myFakeFileSystem = new FFS();
 */
  module.exports = FFS
}

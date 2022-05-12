# FakeFileSystem.js 💾

library to simulate a simple file system in javascript 💾

# JsDelivr

```html
<script src="https://cdn.jsdelivr.net/gh/SkwalExe/FakeFileSystem.js@v0.4.2/dist/ffs.min.js"></script>
```

# Usage 📝

The module can be used in Node.js or [in the browser](#jsdelivr).

```bash
npm install --save fakefilesystem
```

```js
const FFS = require('fakefilesystem');

var myFFS = new FFS();
```

# Wiki 📖

### **To learn more about how to use the module, check out the [wiki](https://github.com/SkwalExe/FakeFileSystem.js/wiki). It contains very much a lot of informations**

# final

If you have any problem, don't hesitate to open an issue

# Contributing

1. Start by [**forking** this repository](https://github.com/SkwalExe/FakeFileSystem.js/fork)

2. Then clone your fork to your local machine.
  ```git
  git clone https://github.com/your-username/FakeFileSystem.js.git
  ```

3. Install dev dependencies
  ```bash
  npm install --save-dev
  ```

4. Create a new branch
  ```git
  git checkout -b super-cool-feature
  ```

5. Then make your changes

6. Run tests
  ```bash
  npm test
  ```

7. Update the changelog and version number if needed (using [Semantic Versioning](https://semver.org)) 
  ```bash
  # bug fix
  npm version patch --no-git-tag-version

  # add a new feature 
  npm version minor --no-git-tag-version
  
  # changes that break backwards compatibility
  npm version major --no-git-tag-version
  ```

8. List and correct linting errors
  ```bash
  npm run lint
  ```

9. Update the minified version of the library
  ```bash
  npm run build
  ```


10. Once you're done, commit your changes and push them to the remote repository.
  ```git
  git add --all
  git commit -m "Add super-cool-feature"
  git push origin super-cool-feature
  ```

10. Then, open a pull request on GitHub from your fork.
    1. Go to [this link](https://github.com/SkwalExe/FakeFileSystem.js/compare/)
    2. Click compare across forks
    3. On the right, on `head repository` select your fork
    4. And on `compare` select the branch you just created
    5. Click on `Create Pull Request` and submit your pull request 

<a href="https://github.com/SkwalExe#ukraine"><img src="https://raw.githubusercontent.com/SkwalExe/SkwalExe/main/ukraine.jpg" width="100%" height="15px" /></a>
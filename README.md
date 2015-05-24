#How to install
Make sure you have node.js and npm installed, then go to your command line and run

```console
$ npm install -g https://github.com/samholmes1337/release.git
```

#How to use
You'll need to run the commands in the same directory as your node.js `package.json` file, which is where this gets the data from. For more information about versioning using this method, check out [semantic versioning](http://semver.org).

Run the following in your console

```console
$ release <type>
```

where the `type` is equal to one of three:

Type | Result
---|---
patch | Will increment `-.-.x` by one
minor | Will increment `-.x.0` by one
major | Will increment `x.0.0` by one

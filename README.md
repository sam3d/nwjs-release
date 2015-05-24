# How to install
Make sure you have node.js and npm installed, then navigate to any directory of your choice and run `git clone` to clone this repository. Afterwards run

```console
$ npm link
```

And this will make it so that you can run it as a command line application. If you would like to uninstall it, before you delete the directory make sure to run

```console
$ npm unlink
```

# How to use
You'll need to run the commands in the same directory as your node.js `package.json` file, which is where this gets the data from. For more information about versioning using this method, check out [semantic versioning](http://semver.org).

Run the following in your console

```console
$ release (type)
```

where the `type` is equal to one of three:

Type | Result
---|---
patch | Will increment `-.-.x` by one
minor | Will increment `-.x.0` by one
major | Will increment `x.0.0` by one

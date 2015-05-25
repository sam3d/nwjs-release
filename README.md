# How to install
Make sure you have node.js and npm installed, then navigate to any directory of your choice and run `git clone` to clone this repository. Afterwards run `npm install` to get all of the required packages to run.

```console
$ npm install
```

Now you need to make sure you can run it, in order to link it to npm and then make it so it can be run from anywhere, use `npm link`.

```console
$ npm link
```

If you would like to uninstall it, before you delete the directory make sure to run

```console
$ npm unlink
```

# Set up github API access
At some point you'll be able to just enter your username and password to create a new release, but for now you must create a github API key and set it as an environmental variable. In order to do this go to the [personal access key](https://github.com/settings/tokens) page and create a new new token, naming it whatever you want.

Once you've done this then you need to add it as an environment variable `GITHUB_TOKEN` to read your github API key. You can do this on UNIX systems by navigating to `~/.bash_profile` and adding the line `export GITHUB_TOKEN="apikey"` to whatever is currently there. After you've done that use `source ~/.bash_profile` to reload the config file.

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

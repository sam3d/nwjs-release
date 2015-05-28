# nwjs-release [![npm version](https://badge.fury.io/js/nwjs-release.svg)](http://badge.fury.io/js/nwjs-release)

Automatically build and release your node-webkit (nwjs) builds to github.

[![NPM](https://nodei.co/npm/nwjs-release.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nwjs-release/)

## How to install
You can use npm to install the command globally

```console
$ npm install -g nwjs-release
```

## How to use
You'll need to run the commands in the same directory as your NodeJS `package.json` file, which is where nwjs-release gets the data from as well as creates temporary `build` and `cache` files. For more information about versioning using this method, check out [semantic versioning](http://semver.org).

Flags will be introduced in a later version but currently everything is done via an interactive wizard by running `nwjs-release`.

```console
$ nwjs-release
```

## Options
You'll be presented with a wizard that'll guide you through the process. Currently, the initial parameters set before release (on an example `0.1.0` build) are:

* What version would you like to release?
    * 1.0.0 (Increment major version)
    * 0.2.0 (Increment minor version)
    * 0.1.1 (Increment patch version)
* Is this a prerelease?
* Is this a draft?
* Would you like to add release notes? (Will open blank file in `$EDITOR`)
* Create nwjs builds?
    * If so, you'll get the option to choose what builds you want to create for out of the following `win32,win64,osx32,osx64,linux32,linux64`

## Add icon(s)
You can also include icons for OS X (Windows coming soon) to be built into compiled nwjs applications. Place a `mac.icns` in the root directory of your project folder in order to use it.

#!/usr/bin/env node
// Dependencies
var release = require('./release'); // All module functions

// Get arguments
var type = process.argv[2];

// nwjs build if flag is used
if (process.argv.indexOf("-b") != -1){

    // Make sure build has params
    if (process.argv[process.argv.indexOf("-b")+1]) {

        // Get operating systems to build to
        var builds = process.argv[process.argv.indexOf("-b")+1];

        // Set value of builds to array
        release.builds = builds.split(",");

    }

}

// Evaluate 'type' argument
switch (type) {
    case "patch":
        release.update.patch();
        break;

    case "minor":
        release.update.minor();
        break;

    case "major":
        release.update.major();
        break;

    default:
        release.man();
        break;
}

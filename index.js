#!/usr/bin/env node
// Dependencies
var release = require('./release'); // All module functions

// Get arguments
var type = process.argv[2];

// Evaluate 'type argument'
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

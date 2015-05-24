#!/usr/bin/env node
// Dependencies
var release = require('./release'); // All module functions

// Get arguments
var type = process.argv[2];

// Evaluate 'type argument'
switch (type) {
    case "patch":
        release.patch();
        break;

    case "minor":
        release.minor();
        break;

    case "major":
        release.major();
        break;

    default:
        release.man();
        break;
}

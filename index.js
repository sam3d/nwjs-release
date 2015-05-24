#!/usr/bin/env node
// Dependencies
var release = require('./release'); // All module functions

// Get arguments
var type = process.argv[2];

// Evaluate 'type argument'
switch (type) {
    case "patch":
        break;

    case "minor":
        break;

    case "major":
        break;

    default:
        release.man();
        break;
}

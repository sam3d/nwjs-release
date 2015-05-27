// Dependencies
var fs = require('fs');
var inquirer = require('inquirer');
var ghauth = require('ghauth');

// Main functions
var release = {

    // Initial function start
    init : function(){

        // Start github auth
        release.github();

    },

    // Authenticate with github
    github : function() {

        // Authentication
        ghauth({
            configName: "nwjs-release",
            scopes: ['repo', 'public_repo'],
            note: "Allows nwjs-release to publish and upload releases",
            userAgent: "nwjs-release"
        }, function(err, data){

            // If there is an error, show the user
            if (err){
                console.log(err.data.message);
                process.exit(1);
            }

            // Set the token
            release.token = data.token;

            // Get the initial version
            release.version.read();

        });

    },

    // Set user configuration / params
    params : function(version) {

        // Get different version amounts from title
        var major = parseInt(version.split(".")[0]);
        var minor = parseInt(version.split(".")[1]);
        var patch = parseInt(version.split(".")[2]);

        // Generate new values based on current version
        var newMajor = (major + 1) + ".0.0";
        var newMinor = major + "." + (minor + 1) + ".0";
        var newPatch = major + "." + minor + "." + (patch + 1);


        // Prompt the user for all paramaters
        inquirer.prompt([
            {
                type: "list",
                name: "version",
                message: "Which version do you want to release?",
                default: newPatch,
                choices: [
                    {name: newMajor + " (Increment major version)", value: newMajor},
                    {name: newMinor + " (Increment minor version)", value: newMinor},
                    {name: newPatch + " (Increment patch version)", value: newPatch}
                ]
            },
            {
                type: "confirm",
                name: "prerelease",
                message: "Is this a prerelease?",
                default: false
            },
            {
                type: "confirm",
                name: "changelog",
                message: "Would you like to add a changelog?",
                default: true
            },
            {
                type: "checkbox",
                name: "builds",
                message: "What do you want to build for?",
                default: ["osx32", "osx64"],
                choices: [
                    {name: "OS X 32-bit", value: "osx32"},
                    {name: "OS X 64-bit", value: "osx64"},
                    {name: "Windows 32-bit", value: "win32"},
                    {name: "Windows 64-bit", value: "win64"}
                ]
            }

        ], function(answers){



        });

    },

    // Version functions
    version : {

        // Get version number
        read : function(){

            // Check for package.json file
            fs.readFile("package.json", "utf8", function(err, data){

                // If it does not exist
                if (err){

                    // Notify the user
                    console.log("Could not find 'package.json' in current directory");
                    console.log("Are you sure it exists?");

                    // Exit the program
                    process.exit(1);
                }

                // Check whether version in file
                if (JSON.parse(data).version) {

                    // If so, ask user what they'd like to do
                    var version = JSON.parse(data).version;
                    release.params(version);

                } else {

                    // If no version in the file, alert the user
                    console.log("Could not find a version in the 'package.json' file");

                    // Exit the program
                    process.exit(1);

                }

            });

        },

        // Bump the current version
        bump : function(version){



        }

    }

}

module.exports = release;

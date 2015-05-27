// Dependencies
var fs = require('fs');
var inquirer = require('inquirer');
var ghauth = require('ghauth');
var exec = require('child_process').exec;

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

            // Bump the version
            release.version.bump(answers.version, function(){

                // Make a git commit
                release.git.commit(answers.version, function(){

                    // Make a git tag
                    release.git.tag(answers.version, function(){

                        // Push to remote
                        release.git.push(answers.version);

                    });

                });

            });

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
        bump : function(version, next){

            // Read current 'package.json'
            fs.readFile("package.json", "utf8", function(err, data){

                // Throw an error if there was one
                if (err) {

                    // Print error
                    console.log("Could not find 'package.json' in current directory");
                    console.log("Are you sure it exists?");

                    // End
                    process.exit(1);

                }

                // Convert data to JSON object
                var data = JSON.parse(data);

                // Initial notification
                console.log("");
                console.log("Updating from v" + data.version + " => " + version);

                // Notify the user of the update
                console.log("---> Updated 'package.json': v" + version);

                // Update version in JSON object and convert back to string
                data.version = version;
                var data = JSON.stringify(data, null, "  ");

                // Write JSON back into file
                fs.writeFile("package.json", data);

                // Next callback
                next();

            });

        }

    },

    // All git functions
    git : {

        // Make a commit
        commit : function(version, next){

            // Perform add and commit function
            exec("git add package.json && git commit -m '" + version + "'", function(err, stdout, stderr){

                // If error, throw
                if (err)
                    throw err;

                // Notify the user
                console.log("---> Created new commit: " + version);

                // Callback
                next();

            });

        },

        // Make a tag on current commit
        tag : function(version, next){

            // Perform tag
            exec("git tag v" + version, function(err, stdout, stderr){

                // If error, throw
                if (err)
                    throw err;

                // Notify the user
                console.log("---> Created new tag: v" + version);

                // Callback
                next();

            });

        },

        // Push tag and commit to remote
        push : function(version){

            // Notify user
            console.log("");
            console.log("Pushing commit and tag to master/origin");
            console.log("---> Pushing to remote: v" + version);

            // Perform push of current commit and tag
            exec("git push origin master && git push origin master v" + version, function(err, stdout, stderr){

                // Notify user
                console.log("---> Pushed to remote: v" + version);

            });

        }

    }

}

module.exports = release;

// Dependencies
var fs = require('fs');
var exec = require('child_process').exec;
var request = require('request');
var prompt = require('prompt');
var NwBuilder = require('node-webkit-builder');

// Define module
release = {

    // All update specific functionality
    update : {

        // Set up a 'patch' release
        patch : function(){

            // Notify current release
            console.log("");
            console.log("Performing patch release");

            // Get current version
            release.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + minor + "." + (patch + 1);

                // Update to new version
                release.version.update(newVersion);

            });

        },

        // Set up a 'minor' release
        minor : function(){

            // Notify current release
            console.log("Performing minor release");

            // Get current version
            release.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + (minor + 1) + ".0";

                // Update to new version
                release.version.update(newVersion);

            });

        },

        // Set up a 'major' release
        major : function(){

            // Notify current release
            console.log("Performing major release");

            // Get current version
            release.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = (major + 1) + ".0.0";

                // Update to new version
                release.version.update(newVersion);

            });

        }

    },

    // All version functions
    version : {

        // Read the current version number
        read : function(callback){

            // Notify of search
            console.log("Searching for 'package.json' in current directory");

            // Read the package.json file
            fs.readFile("package.json", "utf8", function(err, data){

                // Throw an error if there was one
                if (err) {

                    // Print error
                    console.log("Could not find 'package.json' in current directory");
                    console.log("Are you sure it exists?");

                    // End
                    process.exit(1);

                }

                // Get the version from the file and return it
                var version = JSON.parse(data).version;
                callback(version);

            });

        },

        // Update the version in 'package.json'
        update : function(newVersion){

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

                // Notify the user of the update
                console.log("");
                console.log("Updating from " + data.version + " => " + newVersion);

                // Update version in JSON object and convert back to string
                data.version = newVersion;
                var data = JSON.stringify(data, null, "  ");

                // Write JSON back into file
                fs.writeFile("package.json", data);

                // Proceed to git commit
                release.git.commit(newVersion);

            });

        }

    },

    // Git functions
    git : {

        // Make a new commit
        commit : function(newVersion){

            // Add and then commit the current package.json
            exec("git add package.json && git commit -m '" + newVersion + "'", function(err, stdout, stderr){

                // Notify the user
                console.log("Commited new version to 'package.json'");

                // Proceed to git tag
                release.git.tag(newVersion);

            });

        },

        // Tag the current commit
        tag : function(newVersion){

            // Tag the current commit
            exec("git tag v" + newVersion, function(err, stdout, stderr){

                // Notify the user
                console.log("Tagged current commit with v" + newVersion);

                // Push the commit and tags to the remote repo
                release.git.push(newVersion);

            });

        },

        // Push the commit and tags to the repo
        push : function(newVersion){

            // Log a blank line and inform the user
            console.log("");
            console.log("Pushing new release to remote 'origin'");

            // Perform push of ordinary and tag
            exec("git push && git push origin v" + newVersion, function(err, stdout, stderr){

                // Log the output to the console
                console.log(stderr);

                // Prompt the user if they would like to enter patch notes
                console.log("");
                console.log("Would you like to enter patch notes?");
                console.log("(At present you must have Atom installed)");

                prompt.start();
                prompt.get({
                    name: "yesno",
                    message: "Enter patch notes",
                    validator: /y[es]*|n[o]?/,
                    warning: "Must respond yes or no",
                    default: "no"
                }, function(err, result){
                    if (/y[es]*/.test(result.yesno)) {

                        // User wants to enter patch notes

                        // Find out whether ATOM is installed
                        exec("which atom", function(err, stdout, stderr){
                            if (stdout.split("\n") < 2) {

                                // Atom is not installed, go straight to release
                                console.log("");
                                console.log("Atom is not installed, will not add patch notes");
                                console.log("Waiting 5 seconds before publishing release");
                                setTimeout(function(){
                                    release.git.release(newVersion, "");
                                }, 5000);

                            } else {

                                // Atom is installed, use patch notes
                                release.git.patchNotes(newVersion);

                            }
                        });


                    } else {

                        // User does not want to enter patch notes
                        // Go straight to release
                        console.log("");
                        console.log("Will not add patch notes");
                        console.log("Waiting 5 seconds before publishing release");
                        setTimeout(function(){
                            release.git.release(newVersion, "");
                        }, 5000);

                    }

                });

            });

        },

        // Allow the user to enter patch notes
        patchNotes : function(newVersion){

            // Create the file
            var data = "### Features\n* feature\n\n### Bugfixes\n* bugfix\n\n### Removed\n* removed\n";
            fs.writeFile(".git/PATCH_NOTES.md", data);

            // Open the file for the user
            exec("atom --wait .git/PATCH_NOTES.md", function(err, stdout, stderr){

                // Once it has been finished get the data
                fs.readFile(".git/PATCH_NOTES.md", "utf8", function(err, data){

                    // Error handling
                    if (err) {
                        throw err;
                    }

                    // Delete the file
                    fs.unlink(".git/PATCH_NOTES.md");

                    // Show user logged patch notes
                    console.log("");
                    console.log("--------------------------");
                    console.log(data);
                    console.log("--------------------------");
                    console.log("");

                    // Send patch notes to release function
                    release.git.release(newVersion, data);

                });

            });


        },

        // Release on github
        release : function(newVersion, patchNotes){

            // Get username and repo name from repository
            exec("git remote -v", function(err, stdout, stderr){

                // Split result
                var remotes = stdout.split(/[\s\t]+/);

                // Get origin
                var origin_url = remotes[remotes.indexOf('origin') + 1];

                // Get owner and repo and github token from env
                var owner = origin_url.split(/[/.]+/)[3];
                var repo = origin_url.split(/[/.]+/)[4];
                var token = process.env.GITHUB_TOKEN;
                var url = "https://api.github.com/repos/" + owner + "/" + repo + "/releases";

                console.log("Creating new release at https://github.com/" + owner + "/" + repo + "/releases/tag/v" + newVersion);

                // Make post request
                request.post({
                    url: url,
                    headers: {"User-Agent": owner, "Authorization": "token " + token},
                    json: {
                        "tag_name": "v" + newVersion,
                        "target_commitish": "master",
                        "name": "v" + newVersion,
                        "body": patchNotes,
                        "draft": false,
                        "prerelease": false
                    }
                }, function(){

                    // If it should be built, build it
                    if (release.builds) {
                        release.build();
                    }

                });

            });

        }

    },

    // Create nwjs builds
    build : function(){

        console.log("");
        console.log("Will now build nwjs application(s)");

        // Instansiate nwjs builder
        var nw = new NwBuilder({
            files: "./*",
            version: "0.12.0",
            macIcns: "./icon.icns",
            platforms: release.builds
        });

        // Build it
        nw.build();

    },

    // Print the manual
    man : function(){

        if (release.builds){
            console.log(release.builds.length);
        }

        // Get current version
        fs.readFile("package.json", "utf8", function(err, data){

            // If there is a 'package.json' file, show version
            if (!err) {

                // Make sure there is a version field
                if (JSON.parse(data).version) {

                    // Show current version
                    console.log("");
                    console.log("Found 'package.json' in current directory");
                    console.log("Current version is " + JSON.parse(data).version);

                }

            }

            // Print static data
            console.log("");
            console.log("Usage: release [type]");
            console.log("    where type 'patch' will increment to -.-.x");
            console.log("    where type 'minor' will increment to -.x.0");
            console.log("    where type 'major' will increment to x.0.0");
            console.log("");
            console.log("Optional flags");
            console.log("    '-b' will build a nwjs app (default: osx32,osx64,win32,win64)");
            console.log("");

        });

    }

}

// Expose to app
module.exports = release;

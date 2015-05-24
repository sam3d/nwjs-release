// Dependencies
var fs = require('fs');
var exec = require('child_process').exec;

// Define module
releases = {

    // All update specific functionality
    update : {

        // Set up a 'patch' release
        patch : function(){

            // Get current version
            releases.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + minor + "." + (patch + 1);

                // Update to new version
                releases.version.update(newVersion);

            });

        },

        // Set up a 'minor' release
        minor : function(){

            // Get current version
            releases.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + (minor + 1) + ".0";

                // Update to new version
                releases.version.update(newVersion);

            });

        },

        // Set up a 'major' release
        major : function(){

            // Get current version
            releases.version.read(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = (major + 1) + ".0.0";

                // Update to new version
                releases.version.update(newVersion);

            });

        }

    },

    // All version functions
    version : {

        // Read the current version number
        read : function(callback){

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
                console.log("Updating from " + data.version + " => " + newVersion);

                // Update version in JSON object and convert back to string
                data.version = newVersion;
                var data = JSON.stringify(data, null, "\t");

                // Write JSON back into file
                fs.writeFile("package.json", data);

                // Make a git commit
                exec("git add package.json && git commit -m '" + newVersion + "'", function(err, stdout, stderr){

                    // Notify the user
                    console.log("Commited new version to package.json");

                    // Tag the current commit
                    exec("git tag v" + newVersion, function(err, stdout, stderr){

                        // Notify the user
                        console.log("Tagged current commit with v" + newVersion);

                    });


                });

            });

        }

    },

    // Print the manual
    man : function(){
        console.log("");
        console.log("Usage: release <type>");
        console.log("    where type 'patch' will increment to -.-.x");
        console.log("    where type 'minor' will increment to -.x.0");
        console.log("    where type 'major' will increment to x.0.0");
        console.log("");
    }

}

// Expose to app
module.exports = releases;

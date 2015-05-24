// Dependencies
var fs = require('fs');

// Define module
releases = {

    // All update specific functionality
    update : {

        // Set up a 'patch' release
        patch : function(){

            // Get current version
            releases.version(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + minor + "." + (patch + 1);

                // Notify
                console.log("Upgrading from " + version + " => " + newVersion);

            });

        },

        // Set up a 'minor' release
        minor : function(){

            // Get current version
            releases.version(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = major + "." + (minor + 1) + ".0";

                // Notify
                console.log("Upgrading from " + version + " => " + newVersion);

            });

        },

        // Set up a 'major' release
        major : function(){

            // Get current version
            releases.version(function(version){

                // Get current version
                var patch = parseInt(version.split(".")[2]);
                var minor = parseInt(version.split(".")[1]);
                var major = parseInt(version.split(".")[0]);

                // Get new version
                var newVersion = (major + 1) + ".0.0";

                // Notify
                console.log("Upgrading from " + version + " => " + newVersion);

            });

        }

    },

    // Get the current version number
    version : function(callback){

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

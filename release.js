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

                // 

            });

        },

        // Set up a 'minor' release
        minor : function(){

            // Get current version
            releases.version(function(version){

                //

            });

        },

        // Set up a 'major' release
        major : function(){

            // Get current version
            releases.version(function(version){

                //

            });

        }

    },

    // Get the current version number
    version : function(callback){

        // Read the package.json file
        fs.readFile("packge.json", "utf8", function(err, data){

            // Throw an error if there was one
            if (err) {

                // Print error
                console.log("Could not find 'package.json' in current directory");
                console.log("Are you sure it exists?");
                console.log("");

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

// Dependencies


// Expose to app
module.exports = {

    // Set up a 'patch' release
    patch : function(){

        console.log("Just a small lil' patch");

    },

    // Set up a 'minor' release
    minor : function(){

        console.log("A new backwards-compatable feature? Cool!");

    },

    // Set up a 'major' release
    major : function(){

        console.log("My goodness this'll break a few things");

    },

    // Print the manual
    man : function(){
        console.log("");
        console.log("Usage: release <type>");
        console.log("    'patch' will increment to -.-.x");
        console.log("    'minor' will increment to -.x.0");
        console.log("    'major' will increment to x.0.0");
        console.log("");
    }

}

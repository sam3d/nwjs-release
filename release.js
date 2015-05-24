module.exports = {

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

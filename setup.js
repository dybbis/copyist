"use strict";

const fs = require('fs');

module.exports = function(configFolder) {
    var keybindings = configFolder + "/keybindings.json";
    var accounts    = configFolder + "/accounts.json";

    try {
        fs.accessSync(configFolder, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(configFolder);
    }

    try {
        fs.accessSync(keybindings, fs.F_OK);
    } catch (e) {
        fs.createReadStream('./default-keybindings.json').pipe(fs.createWriteStream(keybindings));
    }

    try {
        fs.accessSync(accounts, fs.F_OK);
    } catch (e) {
        fs.writeFile(accounts, "{}");
    }
};

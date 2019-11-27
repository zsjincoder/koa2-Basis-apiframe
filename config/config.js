const Util = require('../utils/util');

class Config {
    static localhostAddress = Util.getAddress();
    static port = ":3000";
    static rootDir = '';
    static setRootDir(data){
        this.rootDir = data;
    }
}

module.exports = Config;

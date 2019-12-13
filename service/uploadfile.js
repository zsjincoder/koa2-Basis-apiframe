const Config = require("../config/config");
const Format = require("../utils/format");
const Util = require('../utils/util');
const fs = require("fs");
const path = require('path');

class UploadFileService {
    /***
     * 单个文件的处理
     * @param file
     * @returns {Promise<*>}
     */
    static async uploadOneFile(file) {
        try{
            let loadUrl = Config.rootDir + "\\public\\upload\\" + Format.fomatterDateTime("yyyyMMdd");
            if (!fs.existsSync(loadUrl)) {
                fs.mkdir(loadUrl, err => {
                    console.log(err);
                    throw err
                })
            }
            const render = fs.createReadStream(file.path);
            let fP = `${Format.fomatterDateTime("yyyyMMdd")}/${Util.getUuid2(8)}.${file.name}`;
            let filePath = path.join(__dirname, '../public/upload/') + fP;
            const upStream = fs.createWriteStream(filePath);
            const pro = new Promise((resolve) => {
                let stream = render.pipe(upStream);
                stream.on('finish', function () {
                    resolve(Config.localhostAddress + Config.port + '/upload/' + fP);
                });
            });
            return await pro
        }catch (e) {
            throw e
        }

    }

    /***
     * 多文件上传
     * @param files
     * @returns {Promise<Array>}
     */
    static async uploadMultipleFile(files) {
        try {
            let loadUrl = Config.rootDir + "\\public\\upload\\" + Format.fomatterDateTime("yyyyMMdd");
            if (!fs.existsSync(loadUrl)) {
                fs.mkdir(loadUrl, err => {
                    throw err
                })
            }
            let fileUrls = [];
            for (let file of files) {
                const reader = fs.createReadStream(file.path);
                let fP = `${Format.fomatterDateTime("yyyyMMdd")}/${Util.getUuid2(8)}.${file.name}`;
                let filePath = path.join(__dirname, '../public/upload/') + fP;
                const upStream = fs.createWriteStream(filePath);
                const pro = new Promise((resolve) => {
                    let stream = reader.pipe(upStream);
                    stream.on('finish', function () {
                        resolve(Config.localhostAddress + Config.port + '/upload/' + fP);
                    });
                });
                fileUrls.push(await pro)
            }
            return fileUrls
        }catch (e) {
            throw e
        }
    }
}

module.exports = UploadFileService;

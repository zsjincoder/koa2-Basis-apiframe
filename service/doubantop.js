const https = require('https');
const http = require('http');
const DouBanTop = require('../utils/doubantop');
const iconv = require('iconv-lite');
const zlib = require('zlib');

/***
 * 豆瓣top10
 */
class DouBan {
    /***
     * 获取豆瓣网top10电影排行榜
     * @param type
     * @returns {Promise<string>}
     */
    static async getDouBanTop(type) {
        let url = '';
        switch (type){
            case 'movie': {url = 'https://movie.douban.com/chart'; break;}
            case 'music': {url = 'https://emumo.xiami.com/chart/data?c=103&type=0&page=1&limit=100&_=1577083887127'; break;}
        }
        try {
            let pro = new Promise((resolve)=>{
                https.get(url, res => {
                    let html = [];
                    res.on('data', data => {
                        html.push(data)
                    });
                    res.on('end', () => {
                        //获取页面上的数据
                        if(type === 'movie'){
                            resolve(DouBanTop.getMovieHtmlData(iconv.decode(Buffer.concat(html),'utf-8')))
                        }else if(type === 'music'){
                            resolve(DouBanTop.getMusicHtmlData(iconv.decode(Buffer.concat(html),'utf-8')))
                        }

                    })
                }).on('error', (err) => {
                    console.log(err);
                    resolve({errMsg:'数据获取失败'})
                })
            });
            return await pro;
        } catch (e) {
            throw e;
        }
    }

    /***
     * 获取美剧天堂中美剧排行榜前30名
     * @param url
     * @returns {Promise<void>}
     */
    static async getAllVideo(url = "https://www.meijutt.com/alltop_hit.html"){
        try {
            let pro = new Promise((resolve)=>{
                https.get(url, res => {
                    let chunks = [];
                    res.on('data', data => {
                        chunks.push(data)
                    });
                    res.on('end', () => {
                        //获取页面上的数据
                        resolve(DouBanTop.getVideosInfo(iconv.decode(Buffer.concat(chunks), 'gb2312')))
                    })
                }).on('error', (err) => {
                    // console.log(err);
                    resolve({errMsg:'数据获取失败'})
                })
            });
            return await pro;
        } catch (e) {
            throw e;
        }
    }

    /***
     * 爬取斗破苍穹小说文本
     * @param url
     * @returns {Promise<void>}
     */
    static async getDPCQtext(url = "https://doupocangqiong1.com/1/list_piaotian/"){
        try {
            let pro = new Promise((resolve,reject)=>{
                https.get(url, res => {
                    let chunks = [];
                    res.on('data', data => {
                        chunks.push(data)
                    });
                    res.on('end', () => {
                        //获取页面上的数据
                        let buffer = Buffer.concat(chunks)
                        zlib.gunzip(buffer,(err,decoder)=>{
                            if (err){
                                reject(err);
                                return
                            }
                            resolve(DouBanTop.getDownUrlForDPCQ(decoder.toString()))
                        })

                    })
                }).on('error', (err) => {
                    resolve({errMsg:'数据获取失败'})
                })
            });
            return await pro;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = DouBan;
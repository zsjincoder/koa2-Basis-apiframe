const https = require('https');
const DouBanTop = require('../utils/doubantop');
const iconv = require('iconv-lite');
/***
 * 豆瓣top10
 */
class DouBan {
    /***
     * 获取豆瓣网top10电影排行榜
     * @param url
     * @returns {Promise<string>}
     */
    static async getDouBanTop(url) {
        let html = '';
        try {
            let pro = new Promise((resolve)=>{
                https.get(url, res => {

                    res.on('data', data => {
                        html += data
                    });
                    res.on('end', () => {
                        //获取页面上的数据
                        resolve(DouBanTop.getHtmlData(iconv.decode(html,'gb2312')))
                    })
                }).on('error', (err) => {
                    console.log(err);
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
                    console.log(err);
                })
            });
            return await pro;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = DouBan;
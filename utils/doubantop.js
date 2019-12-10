const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

class DouBanTop {
    /***
     * 获取网页信息
     * @param html
     * @returns {Promise<*>}
     */
    static async getHtmlData(html) {
        if (html) {
            let $ = cheerio.load(html);
            let movieList = $('.item');//电影列表
            const pro = new Promise((resolve) => {
                let data = [];
                movieList.each(function (item) {
                    let movie = $(this);
                    let movieName = movie.find('.nbg').attr('title');
                    let moviePic = movie.find('img').attr('src');
                    let movieSrc = movie.find('.nbg').attr('href');
                    let movieSynopsis = movie.find('.pl').text();
                    let ranking = item + 1;
                    let score = movie.find('.rating_nums').text();
                    data.push({movieName, moviePic, movieSrc, movieSynopsis, ranking, score})
                });
                resolve(data);
            });
            return await pro;
            // console.log(movieInfo);
        } else {
            throw '无数据传入！'
        }
    }

    /***
     * 电影天堂
     * @param html
     * @returns {Promise<any>}
     */
    static async getVideosInfo(html) {
        if (html) {
            let $ = cheerio.load(html);
            let movieList = $('.top-min');//电影列表
            const pro = new Promise((resolve) => {
                let data = [];
                movieList.each(function (item) {
                    let video = $(this);
                    let classifyName = video.find('.tt').find('h5').text();
                    let videoList = video.find('.top-list').find('a');
                    let videoUrlList = [];
                    videoList.each(function (i) {
                        let babel = $(this);
                        let videoName = babel.attr('title');
                        let videoUrl ="https://www.meijutt.com"+ babel.attr('href');
                        let rank = i + 1;
                        videoUrlList.push({videoName, videoUrl, rank})
                    });
                    data.push({classifyName, videoUrlList})
                });
                // let urlData = this.getDownUrlForVideo(data);
                resolve(data);
            });
            return await pro;
            // console.log(movieInfo);
        } else {
            throw '无数据传入！'
        }

    }

    /***
     * 获取下载地址
     * @param data
     * @returns {Promise<*>}
     */
    static async getDownUrlForVideo(data) {
        let base = "https://www.meijutt.com";
        let urlData =[];
        try {
            const pro = new Promise((resolve) => {
                data.map(item=>{
                    item.videoUrlList.map(list=>{
                        https.get(base + list.videoUrl, res => {
                            let chunks = [];
                            res.on('data', data => {
                                chunks.push(data)
                            });
                            res.on('end', () => {
                                //获取页面上的数据
                                let $ = cheerio.load(iconv.decode(Buffer.concat(chunks), 'gb2312'));
                                let urls = $('.tabs-list .current-tab').find(".down_list");
                                console.log(urls.length);
                                resolve('1')
                            })
                        }).on('error', (err) => {
                            console.log(err);
                        })
                    })
                });
            });
            return await pro;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = DouBanTop;
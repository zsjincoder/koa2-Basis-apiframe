const cheerio = require('cheerio');
const https = require('https');
const request = require('request');
const iconv = require('iconv-lite');
const fs = require('fs');
const async = require('async');
const zlib = require('zlib');
const Config = require("../config/config");
const Format = require("../utils/format");
const Util = require('../utils/util');
const path = require('path');

class DouBanTop {
    /***
     * 获取视频网页信息
     * @param html
     * @returns {Promise<*>}
     */
    static async getMovieHtmlData(html) {
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
     * 获取音乐网页信息
     * @param html
     * @returns {Promise<*>}
     */
    static async getMusicHtmlData(html) {
        if (html) {
            let $ = cheerio.load(html);
            let list = $('.song');//列表
            const pro = new Promise((resolve) => {
                let data = [];
                list.each(function (item) {
                    let music = $(this);
                    let musicName = music.find('.info>p>strong>a').text();
                    let musicPic = 'https:' + music.find('img').attr('src');
                    let musicSrc = 'https://emumo.xiami.com' + music.find('.info').find('.artist').attr('href');
                    let musicAuthor = music.find('.info').find('.artist').text();
                    let ranking = item + 1;
                    data.push({musicName, musicPic, musicSrc, musicAuthor, ranking})
                });
                resolve(data);
            });
            return await pro;
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
                        let videoUrl = "https://www.meijutt.com" + babel.attr('href');
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
        let urlData = [];
        try {
            const pro = new Promise((resolve) => {
                data.map(item => {
                    item.videoUrlList.map(list => {
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

    /***
     * 获取所有小说的章节
     * @param html
     * @returns {Promise<*>}
     */
    static async getDownUrlForDPCQ(html) {
        let base = 'https://doupocangqiong1.com';
        let bookStart = new Date();
        let bookTreeUrl = [];
        try {
            let $ = cheerio.load(html);
            let list = $('.three').find('a');
            let pro = new Promise(((resolve, reject) => {
                list.each(function (item) {
                    if (item === 50) return false;
                    let a = $(this);
                    bookTreeUrl.push({
                        index: item,
                        url: base + a.attr('href'),
                        title: a.text()
                    })
                });
                let that = this; //作用域
                async.mapLimit(bookTreeUrl, 3, function (item, callback) {
                    that.getBookData(item, callback)
                }, function (err, result) {
                    let end = (new Date() - bookStart) / 1000;
                    console.log(`爬取本书共耗时${end}秒！`)
                    result.sort((r, t) => {
                        return (r.index - t.index)
                    })
                    result = result.map(list => {
                        return list.title + '\n\r' + list.content;
                    }).join("\n\r");
                    let downUrl = that.write("斗破苍穹.txt", result);
                    let endd = (new Date() - bookStart) / 1000;
                    console.log(`最终耗时${endd}秒！`)
                    resolve(downUrl)
                });
            }));
            return await pro
        } catch (e) {
            throw e
        }
    }

    /***
     * 获取文章章节信息
     * @param item
     * @param callback
     */
    static getBookData(item, callback) {
        let start = new Date();
        let form = {
            siteid: 0,
            bid: 1,
            cid: 873530 + item.index
        };
        request.post('https://doupocangqiong1.com/novelsearch/chapter/transcode.html', {form}, function (err, res, body) {
            let end = (new Date() - start) / 1000;
            if (err) {
                callback(null, {
                    index: item.index,
                    title: item.title,
                    content: '异常'
                });
                console.log(`获取第${item.index + 1}章${item.title}失败,共耗时${end}秒`)
            } else {
                try {
                    let content = JSON.parse(body).info;
                    callback(null, {
                        index: item.index,
                        title: item.title,
                        content: content.replace(/<br>/g, '')
                    });
                    console.log(`获取第${item.index + 1}章成功,共耗时${end}秒`)
                } catch (e) {
                    callback(null, {
                        index: item.index,
                        title: item.title,
                        content: '异常'
                    });
                    console.error(e);
                }
            }
        });
    }

    /***
     * 写入文件
     * @param bookname
     * @param data
     */
    static write(bookname, data) {
        let loadUrl = Config.rootDir + "\\public\\reptile\\" + Format.fomatterDateTime("yyyyMMdd");
        if (!fs.existsSync(loadUrl)) {
            fs.mkdir(loadUrl, err => {
                console.log(err);
            })
        }
        let start = new Date();
        console.log("开始写入文件");
        fs.writeFileSync('./public/reptile/' + Format.fomatterDateTime("yyyyMMdd") + "/" + bookname, data, "utf8");
        let end = (new Date() - start) / 1000;
        console.log(`写入文件成功,耗时${end}秒`);
        return Config.localhostAddress + Config.port + '/reptile/' + Format.fomatterDateTime("yyyyMMdd") + '/' + bookname;
    }
}

module.exports = DouBanTop;
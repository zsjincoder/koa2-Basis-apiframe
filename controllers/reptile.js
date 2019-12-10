const Response = require("../utils/response");
const DouBan = require('../service/doubantop');
/**
 * @apiDefine ReptileGroupName 爬虫（Reptile）
 */

class Reptile {

    /**
     * @api {get} /reptile/getMovieRanking 查询电影点评前十排行(getMovieRanking)
     * @apiGroup ReptileGroupName
     * @apiName getMovieRank
     * @apiParam {String} url 要爬取的网站
     * @apiVersion 1.0.0
     */
    static async getMovieRank(ctx) {
        let movieUrl = ctx.request.query.url;
        if (!movieUrl) {
            ctx.body = Response.errorResponse(412, "url不存在！");
            return
        }
        try {
            ctx.body = Response.successResponse(await DouBan.getDouBanTop(movieUrl))
        } catch (e) {
            throw e;
        }
    }

    /**
     * @api {get} /reptile/getDownUrl 查询各类美剧前30名的电影下载url
     * @apiGroup ReptileGroupName
     * @apiName getDownUrl
     * @apiVersion 1.0.0
     */
    static async getDownUrl(ctx) {
        try {
            ctx.body = Response.successResponse(await DouBan.getAllVideo())
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Reptile;
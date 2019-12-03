const Response = require("../utils/response");

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
        console.log(movieUrl);
        ctx.body = movieUrl

    }
}

module.exports = Reptile;
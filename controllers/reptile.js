const Response = require("../utils/response");
const DouBan = require('../service/doubantop');
/**
 * @apiDefine ReptileGroupName 爬虫（Reptile）
 */

class Reptile {

    /**
     * @api {get} /reptile/getRanking 查询各个类型排行
     * @apiGroup ReptileGroupName
     * @apiName getRanking
     * @apiParam {String} type (movie,music)要爬取的排行的类型
     * @apiVersion 1.0.0
     */
    static async getRanking(ctx) {
        let type = ctx.request.query.type;
        if (!type) {
            ctx.body = Response.errorResponse(412, "type类型参数为空！");
            return
        }
        try {
            ctx.body = Response.successResponse(await DouBan.getDouBanTop(type),null,false)
        } catch (e) {
            console.error(e);
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

    /**
     * @api {get} /reptile/getDPCQText 爬取斗破苍穹小说并下载
     * @apiGroup ReptileGroupName
     * @apiName getDPCQText
     * @apiVersion 1.0.0
     */
    static async getDPCQText(ctx) {
        try {
            ctx.body = Response.successResponse(await DouBan.getDPCQtext(),null,false)
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Reptile;
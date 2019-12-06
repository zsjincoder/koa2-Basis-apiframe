const UserModel = require("../modules/user");
const Response = require("../utils/response");
const PageData = require('../libs/pageData');
const UploadFileService = require("../service/uploadfile");

class userController {
    static async create(ctx) {
        //接收客户端
        let req = ctx.request.body;
        if (!req.name) {
            ctx.body = Response.errorResponse(412, "name不存在！");
            return
        }
        if (!req.sex) {
            ctx.body = Response.errorResponse(412, "sex不存在！");
            return
        }
        if (!req.email) {
            ctx.body = Response.errorResponse(412, "email不存在！");
            return
        }

        try {
            //创建模型
            const ret = await UserModel.createUser(req);
            const data = await UserModel.getUserDetail(ret.id);
            ctx.body = Response.successResponse(data, {})
        } catch (e) {
            console.error(e);
            ctx.body = Response.errorResponse(500, e);
        }
    };

    static async findUserForId(

    ) {
        //接收客户端
        let req = ctx.request.body;
        if (!req.id || req.id === undefined) {
            ctx.body = Response.errorResponse(412, "id不存在！");
            return
        }
        try {
            const data = await UserModel.getUserDetail(req.id);
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                msg: '操作成功！',
                data
            }
        } catch (e) {
            throw e;
        }
    }

    static async findUserAllUser(ctx) {
        //接收客户端
        let req = ctx.request.body;
        try {
            let pageD = new PageData(req);
            const data = await UserModel.getUserAllUser(pageD);
            pageD.setTotal(data.count);
            ctx.body = Response.successResponse(data.rows, pageD);
        } catch (e) {
            throw e;
        }
    }

    static async uploadFile(ctx) {
        try {
            const file = ctx.request.files.file;
            ctx.body = Response.successResponse(await UploadFileService.uploadOneFile(file));
        } catch (e) {
           throw e;
        }
    }

    static async uploadFiles(ctx) {
        try {
            const files = ctx.request.files.files;
            ctx.body = Response.successResponse(await UploadFileService.uploadMultipleFile(files));
        } catch (e) {
           throw e;
        }
    }
}

module.exports = userController;

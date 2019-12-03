const UserModel = require("../modules/user");
const Response = require("../utils/response");
const PageData = require('../libs/pageData');
const UploadFileService = require("../service/uploadfile");


/**
 * @apiDefine UserGroupName 用户管理（User）
 */

class userController {
    /**
     * @api {post} /user/create 用户新增(create)
     * @apiDescription 用户新增
     * @apiGroup UserGroupName
     * @apiName create
     * @apiVersion 1.0.0
     * @apiParam {String} name  姓名（必传）.
     * @apiParam {String = "1","2"} sex    Mandatory  性别（必传）.
     * @apiParam {String} email    Mandatory  电子邮箱（必传）.
     */
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

    /**
     * @api {post} /user/findUserForId  根据id查询用户(findUserForId)
     * @apiDescription 根据id查询用户
     * @apiGroup UserGroupName
     * @apiVersion 1.0.0
     * @apiName findUserForId
     * @apiParam {String} id  用户id（必传）.
     */
    static async findUserForId(ctx) {
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
            console.error(e);
            ctx.body = Response.errorResponse(412);
        }
    }

    /**
     * @api {post} /user/findUserAllUser 查询所有用户(findUserAllUser)
     * @apiGroup UserGroupName
     * @apiVersion 1.0.0
     * @apiName findUserAllUser
     * @apiParam {Number} page 当前页（必传）.
     * @apiParam {Number} pageSize 分页条数（必传）.
     */
    static async findUserAllUser(ctx) {
        //接收客户端
        let req = ctx.request.body;
        try {
            let pageD = new PageData(req);
            const data = await UserModel.getUserAllUser(pageD);
            pageD.setTotal(data.count);
            ctx.body = Response.successResponse(data.rows, pageD);
        } catch (e) {
            ctx.body = Response.errorResponse(412, e);
        }
    }

    /**
     * @api {post} /user/uploadFile 单文件上传(uploadFile)
     * @apiGroup UserGroupName
     * @apiVersion 1.0.0
     * @apiName uploadFile
     * @apiParam {Object} file （必传）.
     */
    static async uploadFile(ctx) {
        try {
            const file = ctx.request.files.file;
            ctx.body = Response.successResponse(await UploadFileService.uploadOneFile(file));
        } catch (e) {
            console.log(e);
            ctx.body = Response.errorResponse(500)
        }
    }

    /**
     * @api {post} /user/uploadFiles 多文件上传(uploadFiles)
     * @apiGroup UserGroupName
     * @apiVersion 1.0.0
     * @apiName uploadFiles
     * @apiParam {Object} files （必传）.
     */
    static async uploadFiles(ctx) {
        try {
            const files = ctx.request.files.files;
            ctx.body = Response.successResponse(await UploadFileService.uploadMultipleFile(files));
        } catch (e) {
            console.log(e);
            ctx.body = Response.errorResponse(500)
        }
    }
}

module.exports = userController;

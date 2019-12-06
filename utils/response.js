class Response {
    static successResponse(data, pageData = {page:1,pageSize: 10,total: 0}) {
        return {
            code: 0,
            status: 200,
            statusMessage: 'success',
            page: Number(pageData.page),
            pageSize: Number(pageData.pageSize),
            total: Number(pageData.total),
            data,
            msg: '操作成功'
        }
    }

    static errorResponse(status, msg = '操作失败！') {
        return {
            code: -1,
            status,
            msg
        }
    }
}

module.exports = Response;

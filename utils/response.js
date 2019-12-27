class Response {
    static successResponse(data, pageData = {page: 1, pageSize: 10, total: 0}, noPage = true) {
        let resData = {
            code: 0,
            status: 200,
            statusMessage: 'success',
            data,
            msg: '操作成功'
        };
        if (noPage) {
           resData.page = Number(pageData.page);
           resData.pageSize = Number(pageData.pageSize);
           resData.total = Number(pageData.total);
        }

        return resData
    }

    static errorResponse(status, errMsg = '操作失败！') {
        return {
            code: -1,
            status,
            errMsg
        }
    }
}

module.exports = Response;

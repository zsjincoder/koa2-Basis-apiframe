class pageData {
    static page = 1;
    static pageSize = 10;
    static total = 0;

    constructor(data){
        if(!data.hasOwnProperty('page') || !data.hasOwnProperty('pageSize')) throw "分页信息缺失！";
        this.page = Number(data.page);
        this.pageSize =Number(data.pageSize);
    }
    setTotal(total){
        this.total = total;
    }
}

module.exports = pageData;

const db = require('../config/db');
const Sequelize = db.sequelize;

const User = Sequelize.import('../schema/user');

// User.sync(); //自动创建表

class UserModel {
    /***
     * 创建User模型
     * @param data
     * @returns {Promise<Model>}
     */
    static async createUser(data) {
        return await User.create({
            name: data.name,
            sex: data.sex,
            email: data.email
        })
    }

    /***
     * 根据id查询用户
     * @param id
     * @returns {Promise<Model>}
     */
    static async getUserDetail(id) {
        return await User.findOne({
            where: {
                id
            }
        })
    }

    /***
     * 查询用户列表
     * @param pageData
     * @returns {Promise<{rows: Model[]; count: number}>}
     */
    static async getUserAllUser(pageData) {
        return await User.findAndCountAll({
            limit: pageData.pageSize,
            offset: (pageData.page - 1) * pageData.pageSize,
        })
    }
}

module.exports = UserModel;

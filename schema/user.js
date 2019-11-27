const moment = require("moment");

module.exports = function (sequrlize, DataTypes) {
    return sequrlize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'name'
        },
        sex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'sex'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'email',
            validate:{
                isEmail:true
            }
        },
        // 创建时间
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }

        },
        // 更新时间
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }

        }
    }, {
        freezeTableName: true
    })
};

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: DataTypes.STRING
    }, {
        tableName: 'user', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });

    return User;
};
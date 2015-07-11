module.exports = function(sequelize, DataTypes) {
    var transaction_test = sequelize.define("transaction_test", {
        id: DataTypes.INTEGER(11),
        name: DataTypes.STRING(200)
    }, {
        tableName: "transaction_test",
        timestamps: false
    });
    return transaction_test;
};

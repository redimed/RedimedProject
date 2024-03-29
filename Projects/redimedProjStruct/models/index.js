var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    useTransaction = require('sequelize-transactions');
    lodash = require('lodash'),
    config = require('config'),
    sequelize = new Sequelize('sakila', 'root', 'root', {
        host: 'localhost',
        port: 3306
    }),
    useTransaction(sequelize);
    db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
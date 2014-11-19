var user_m = require('../v1_models/User');
var doctor_m = require('../v1_models/Doctor');

module.exports = {
    getSearch: function (req, res) {
        
        var k_sql = res.locals.k_sql;

        var count_user, count_doctor, data_user, data_doctor;
        user_m.searchMode();
        var sql1 = user_m.sql_search_count();
        var sql2 = doctor_m.sql_search_count();
        var sql3 = doctor_m.sql_search_data(3, 2, 'doctor_id, first_name');
        var sql4 = user_m.sql_search_data(3, 1, 'id, user_type, user_name');

        k_sql.exec_row(sql1).then(function (data) {
            count_user = data.count;
            return k_sql.exec(sql2);
        }).then(function (data) {
            count_doctor = data.count;
            return k_sql.exec(sql3);
        }).then(function (data) {
            data_doctor = data;
            return k_sql.exec(sql4);
        }).then(function (data) {
            res.json({user: {data: data, count: count_user}, doctor: {data: data_doctor, count: count_doctor}});
        }).catch(function (err) {
            res.json(err);
        })
    },
    getSql: function (req, res) {

        var data_insert = {
            field1: 'value1',
            field2: 'value2',
            is_enable: '0'
        };

        var data_insert_batch = [
            data_insert, data_insert, data_insert
        ];

        var data_update_batch = [
            {id: 1, field1: 'abc123', field2: 'adsfdsf'},
            {id: 2, field1: 'abc', field2: '2112321312'},
        ];

        var r = {
            get: user_m.sql_get(12, ['test', 'test2']),
            get_all: user_m.sql_get_all('field1, filed2 , field3'),
            get_by: user_m.sql_get_by('user_type', 'doctor'),
            get_in: user_m.sql_get_in(['213', 'abv']),
            insert: user_m.sql_insert(data_insert),
            insert_batch: user_m.sql_insert_batch(data_insert_batch),
            update: user_m.sql_update(1, data_insert),
            update_batch: user_m.sql_update_batch(data_update_batch),
            delete: user_m.sql_delete(1),
            delete_in: user_m.sql_delete_in([1, 2, 3]),
        };

        res.json(r);
    }
}
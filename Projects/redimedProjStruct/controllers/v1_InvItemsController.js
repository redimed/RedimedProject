module.exports = {
    getList: function (req, res) {
        var fields = req.query.fields;
        if (!fields)
            fields = 'item_id, item_name, item_code';


        var k_sql = res.locals.k_sql;

        var err_handle = function (err) {
            res.json(err);
        }

        k_sql.table('inv_items').get().fields(fields)
                .order('item_type')
                .order('item_id')
                .exec(function (data) {
                    res.json(data);
                }, err_handle);


    },
}
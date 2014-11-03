var squel = require("squel");
squel.useFlavour('mysql');

var model_sql = {
    sql_list_user_menu: function (user_id) {
        var querybuilder = squel.select()
                .field("mu.menu_id")
                .field("mu.user_id")
                .field("functions.function_id")
                .field("menus.description")
                .field("menus.parent_id")
                .field("functions.decription", "function_name")
                .field("functions.definition")
                .from('redi_user_menus', 'mu')
                .join('redi_menus', 'menus', 'mu.menu_id = menus.menu_id')
                .join('redi_functions', 'functions', 'functions.function_id = menus.function_id')
                .where('user_id = ?', user_id)

        return querybuilder.toString();
    }

}

module.exports = {
    postListMenu: function (req, res) {
        var user_id = req.body.user_id;

        var sql = model_sql.sql_list_user_menu(user_id);

        var k_sql = res.locals.k_sql;
        
        k_sql.exec(sql, function (data) {
            res.json(data);
        }, function (err) {
            res.json(err);
        });

    },
}
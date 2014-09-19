/**
 * Created by meditech on 19/09/2014.
 */
module.exports = {
    loadMenu: function(req,res)
    {
        req.getConnection(function(err,connection){
            var query = connection.query("SELECT m.Menu_Id,m.Description,IFNULL(f.Definition,' ') " +
                "AS Definition,IFNULL(m.Parent_Id,-1) AS" +
                " Parent_Id,f.Type,m.Seq,m.Is_Mutiple_Instance" +
                " FROM redi_menus m LEFT OUTER JOIN redi_functions f ON m.function_id = f.function_id WHERE" +
                " m.isEnable = 1 ORDER BY m.Menu_Id",function(err,rows){
                if(err)
                {
                    res.json({status:'fail',
                        error:err});
                }
                else
                {
                    res.json(rows);
                }
            });
        });
    }
};
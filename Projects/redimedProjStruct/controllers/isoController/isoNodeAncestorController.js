/**
 * tannv.dts@gmail.com
 * 19-12-2014
 */
var isoUtil=require('./isoUtilsController');
module.exports =
{
    setFolderAncestor:function(req,res,next){
        var newFolder=req.body.newFolder;
        var sql=
            " INSERT INTO iso_node_ancestor                             "+
            " (NODE_ID,ANCESTOR_ID,CREATED_BY)                          "+
            " SELECT ?,`ancestor`.`ANCESTOR_ID`,?                       "+
            " FROM iso_node_ancestor ancestor                           "+
            " WHERE ancestor.`NODE_ID`=? AND `ancestor`.`ISENABLE`=1    ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newFolder.NODE_ID,newFolder.CREATED_BY,newFolder.FATHER_NODE_ID],function(err,result)
            {
                
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {
                    var row={
                        NODE_ID:newFolder.NODE_ID,
                        ANCESTOR_ID:newFolder.FATHER_NODE_ID,
                        CREATED_BY:newFolder.CREATED_BY
                    }
                    var sql="insert into iso_node_ancestor set ?";

                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,row,function(err,result)
                        {
                            
                            if(err)
                            {
                                isoUtil.exlog(err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                next();
                                
                            }
                        });
                    });
                }
            });
        });
    },


    setDocumentAncestor:function(req,res,next){
        var newDocument=req.body.newDocument;
        var sql=
            " INSERT INTO iso_node_ancestor                             "+
            " (NODE_ID,ANCESTOR_ID,CREATED_BY)                          "+
            " SELECT ?,`ancestor`.`ANCESTOR_ID`,?                       "+
            " FROM iso_node_ancestor ancestor                           "+
            " WHERE ancestor.`NODE_ID`=? AND `ancestor`.`ISENABLE`=1    ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[newDocument.NODE_ID,newDocument.CREATED_BY,newDocument.FATHER_NODE_ID],function(err,result)
            {
                
                if(err)
                {
                    isoUtil.exlog(err);
                    res.json({status:'fail'});
                }
                else
                {
                    var row={
                        NODE_ID:newDocument.NODE_ID,
                        ANCESTOR_ID:newDocument.FATHER_NODE_ID,
                        CREATED_BY:newDocument.CREATED_BY
                    }
                    var sql="insert into iso_node_ancestor set ?";

                    req.getConnection(function(err,connection)
                    {
                        var query = connection.query(sql,row,function(err,result)
                        {
                            
                            if(err)
                            {
                                isoUtil.exlog(err);
                                res.json({status:'fail'});
                            }
                            else
                            {
                                //Luu quyen han cua user tren document
                                //chuyen den isoTreeUsersController.saveDocumentAuthor
                                next();
                            }
                        });
                    });
                }
            });
        });
    }
}
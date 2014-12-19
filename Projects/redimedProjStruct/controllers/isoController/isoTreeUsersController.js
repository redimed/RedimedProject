var moment=require('moment');
var isoUtil=require('./isoUtilsController');

module.exports =
{
    /**
     * Neu user tao node thi user co tat ca cac quyen han (read,create,update,delete,grant permission)
     * tren node moi duoc tao
     * tannv.dts@gmail.com
     */
    saveFolderAuthor:function(req,res) 
    {
        var newFolder=req.body.newFolder;
        var newRow={
            NODE_ID:newFolder.NODE_ID,
            ACCESSIBLE_USER_ID:newFolder.CREATED_BY,
            IS_READ:1,
            IS_CREATE:1,
            IS_UPDATE:1,
            IS_DELETE:1,
            IS_GRANT_PERMISSION:1,
            CREATED_BY:newFolder.CREATED_BY
        }
        var sql="insert into iso_tree_users set ? ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,newRow,function(err,result)
            {

                if(err)
                {
                    isoUtil.exlog('error',err);
                    res.json({status:'fail'});
                }
                else
                {
                    newFolder.ACCESSIBLE_USER_ID=newRow.ACCESSIBLE_USER_ID;
                    newFolder.IS_READ=newRow.IS_READ;
                    newFolder.IS_CREATE=newRow.IS_CREATE;
                    newFolder.IS_UPDATE=newRow.IS_UPDATE;
                    newFolder.IS_DELETE=newRow.IS_DELETE;
                    newFolder.IS_GRANT_PERMISSION=newRow.IS_GRANT_PERMISSION;
                    res.json({status:'success',data:newFolder});
                }
            });
        });
    },

    saveDocumentAuthor:function(req,res) 
    {
        var newDocument=req.body.newDocument;
        var newRow={
            NODE_ID:newDocument.NODE_ID,
            ACCESSIBLE_USER_ID:newDocument.CREATED_BY,
            IS_READ:1,
            IS_CREATE:1,
            IS_UPDATE:1,
            IS_DELETE:1,
            IS_GRANT_PERMISSION:1,
            CREATED_BY:newDocument.CREATED_BY
        }
        var sql="insert into iso_tree_users set ? ";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,newRow,function(err,result)
            {
                if(err)
                {
                    isoUtil.exlog('error',err);
                    res.json({status:'fail'});
                }
                else
                {
                    newDocument.ACCESSIBLE_USER_ID=newRow.ACCESSIBLE_USER_ID;
                    newDocument.IS_READ=newRow.IS_READ;
                    newDocument.IS_CREATE=newRow.IS_CREATE;
                    newDocument.IS_UPDATE=newRow.IS_UPDATE;
                    newDocument.IS_DELETE=newRow.IS_DELETE;
                    newDocument.IS_GRANT_PERMISSION=newRow.IS_GRANT_PERMISSION;
                    res.json({status:'success',data:newDocument});
                }
            });
        });
    }
}
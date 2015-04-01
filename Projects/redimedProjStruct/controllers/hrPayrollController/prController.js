var kissUtil=require('../kissUtilsController');


module.exports =
{
	test:function(req,res)
	{
		kissUtil.exlog("hehehehehehehehhehehehehehehe");
		res.json({status:'success'});
	}
}

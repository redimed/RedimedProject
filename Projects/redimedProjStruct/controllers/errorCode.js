/**
 * tannv.dts@gmail.com
 * 02-06-2015
 */
module.exports =
{
    get:function(controllerCode,functionCode,errorCode)
    {
    	var listCodes={
    		'RED_CONSULT':{//ConsultationController
    			'FN001':{//startSession
    				'TN001':{desc:'Loi truyen data den'},
                    'TN002':{desc:'Khong co dong nao duoc update status'},
    				'TN003':{desc:'Loi truy van cap nhat status'},
    			},

                'FN002':{
                    'TN002':{desc:'Loi truy van lay thong tin company'},
                    'TN003':{desc:'Loi truy van lay thong tin cac user trong cung mot company'}
                }
    		}
    	};
    	var value=controllerCode+"_"+functionCode+"_"+errorCode;
    	if(!(listCodes[controllerCode] 
    		&& listCodes[controllerCode][functionCode] 
    		&& listCodes[controllerCode][functionCode][errorCode]))
    	{
    		value=value+"(ERROR NOT DEFINE)";
    	}
    	return value;
    }
}
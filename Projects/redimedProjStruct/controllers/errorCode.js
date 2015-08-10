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
    		},

            'RED_RLOB_CORE':{
                'FN001':{
                    'TN001':{desc:'Data transfer to server fail'},
                    'TN002':{desc:'Current RlType invalid'},
                    'TN003':{desc:'Period time of appointment not enough'},
                    'TN004':{desc:'Cannot update appointment calendar'},
                    'TN005':{desc:'Query update appointment calendar fail'},
                    'TN006':{desc:'Current appointment calendar have not enough time and no adjacent apointments calendar'},
                    'TN007':{desc:'Appointment calendar not exist'},
                    'TN008':{desc:'Get list appointment calendar fail'},
                    'TN009':{desc:'Cannot open transaction'},
                },
                'FN002':{
                    'TN001':{desc:'Duplicate [patient,appointment calendar]'},
                    'TN002':{desc:'No appointment calendar have changed status'},
                    'TN003':{desc:'Error when update appointment calendar status'},
                    'TN004':{desc:'Error when insert booking info'},
                    'TN005':{desc:'No appointment calendar have updated'},
                    'TN006':{desc:'Error when update appointment calendar'},
                    'TN007':{desc:'No appointment calendar correspond'},
                    'TN008':{desc:'Error when get appointment calendar'},
                    'TN009':{desc:'Cannot insert appt_patients'},
                    'TN0010':{desc:'Error when select appt_patients'},
                    'TN0011':{desc:'Cannot insert claim'},
                    'TN0012':{desc:'Cannot insert patient'},
                }
            }
    	};
    	var code=controllerCode+"_"+functionCode+"_"+errorCode;
        var desc="(ERROR NOT DEFINE)";
    	if(listCodes[controllerCode] 
    		&& listCodes[controllerCode][functionCode] 
    		&& listCodes[controllerCode][functionCode][errorCode])
    	{
    		desc="("+listCodes[controllerCode][functionCode][errorCode].desc+")";
    	}

        var errorCode={
            code:code,
            desc:desc
        };
    	return errorCode;
    }
}
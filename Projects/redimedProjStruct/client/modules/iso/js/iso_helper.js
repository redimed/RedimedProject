/**
 * Created by meditech on 12/2/2014.
 */
var isoTest=false;
var isoConst={
	nodeType:{
		folder:'FOLDER',
		document:'DOC'
	},

	msgPopupType:{
		success:'success',
		error:'error'
	},

	dbError:{
		ER_DUP_ENTRY:'ER_DUP_ENTRY'
	},

	submitStatus:{
		pending:'PENDING',
		approved:'APPROVED',
		reject:'REJECTED',
        cancel:'CANCEL'
	},

	isoPermission:{
        administrator:0,
        create:1,
        update:2,
        read:3,
        notPermission:4
    },

    isoAdminFunction:{
        restoreFolder:true,
        restoreDocument:true
    },

    userFunction:{
    	createFolder:'createFolder',
    	deleteFolder:'deleteFolder',
    	cloneToPC:'cloneToPC',
    	grantFolderPermission:'cloneFolderPermission',
    	createDocument:'createDocument',
    	checkOut:'checkOut',
    	checkIn:'checkIn',
    	submitDocument:'submitDocument',
        cancelSubmitDocument:'cancelSubmitDocument',
    	deleteDocument:'deleteDocument',
    	grantDocumentPermission:'grantDocumentPermission',
    	downloadNewestVersion:'downloadNewestVersion'
    },


    permissionFunction:{
    	'0':{
    		createFolder:true,
    		deleteFolder:true,
    		cloneToPC:true,
    		grantFolderPermission:true,
    		createDocument:true,
    		checkOut:true,
    		checkIn:true,
    		submitDocument:true,
            cancelSubmitDocument:true,
    		deleteDocument:true,
    		grantDocumentPermission:true,
    		downloadNewestVersion:true,
            getFullVersionDoccument:true,
            getFullCheckinDoccument:true
    	},
    	'1':{
    		createFolder:true,
    		deleteFolder:true,
    		cloneToPC:true,
    		createDocument:true,
    		checkOut:true,
    		checkIn:true,
    		submitDocument:true,
            cancelSubmitDocument:true,
    		deleteDocument:true,
    		downloadNewestVersion:true,
            getFullVersionDoccument:true,
            getFullCheckinDoccument:true
    	},
    	'2':{
    		cloneToPC:true,
    		checkOut:true,
    		checkIn:true,
    		submitDocument:true,
            cancelSubmitDocument:true,
    		downloadNewestVersion:true,
            getFullVersionDoccument:true,
            getFullCheckinDoccument:true
    	},
    	'3':{
    		cloneToPC:true,
    		downloadNewestVersion:true,
            getFullVersionDoccument:true,
            getFullCheckinDoccument:true
    	}
    },

    checkInStatus:{
        lock:'LOCK',
        unlock:'UNLOCK'
    }
};




var isoLang={
	isoHeader:'ISO SYSTEM',
	createFolderSuccess:'Create folder success!',
	createFolderError:'Create folder error!',
	createDocumentSuccess:'Create document success!',
	createDocumentError:'Create document error!',
	pleaseSelectFile:'Please select file!'
};

 var isoMsg={
 	popup:function(header,type,content)
 	{
 		$('#iso-global-msg-popup .iso-global-msg-popup-header').text(header);
 		if(type==isoConst.msgPopupType.success)
 		{
 			$('#iso-global-msg-popup .iso-global-msg-popup-success').show();
 			$('#iso-global-msg-popup .iso-global-msg-popup-error').hide();
 			$('#iso-global-msg-popup .iso-global-msg-popup-success .iso-global-msg-popup-content').text(content);
 		}
 		if(type==isoConst.msgPopupType.error)
 		{
 			$('#iso-global-msg-popup .iso-global-msg-popup-error').show();
 			$('#iso-global-msg-popup .iso-global-msg-popup-success').hide();
 			$('#iso-global-msg-popup .iso-global-msg-popup-error .iso-global-msg-popup-content').text(content);
 		}
 		$("#iso-global-msg-popup").modal({show:true,backdrop:'static'});
 	}
 }
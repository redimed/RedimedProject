/**
 * Created by meditech on 12/2/2014.
 */

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
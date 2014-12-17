/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.controller',[])
    .controller("isoController", function($scope,$state,$cookieStore,FileUploader,toastr,isoService) {

    	/***
    	//Khoi tao cac bien can thiet
    	//tannv.dts@gmail.com
    	*/
    	//lay thong tin nguoi login
    	$scope.userInfo=$cookieStore.get('userInfo');
    	//dinh nghia cac kieu node
    	$scope.nodeType=isoConst.nodeType;
    	/**
    	 * Ham suat cac thong bao dang the, tren goc tren ben phai
    	 * tannv.dts@gmail.com
    	 */
    	var msg={
    		success:function(msg)
    		{
    			toastr.success(msg, 'ISO Message');
    		},
    		error:function(msg)
    		{
    			toastr.error(msg, 'ISO Message');
    		}
    	}
    	/**
    	 * Ham hien thi thong bao duoi dang dialog popup
    	 * tannv.dts@gmail.com
    	 */
    	$scope.msgPopupInfoBlank={
    		styleClass:'iso-msg-popup-style-class',
    		header:'',
    		type:'',
    		content:''
    	}
    	$scope.msgPopupInfo=angular.copy($scope.msgPopupInfoBlank);
    	var msgPopup=function(header,type,content)
        {
            $scope.msgPopupInfo.header=header;
            $scope.msgPopupInfo.type=type;
            $scope.msgPopupInfo.content=content;
            $("."+$scope.msgPopupInfo.styleClass).modal({show:true,backdrop:'static'});
        };


	    /***
	    //hien thi toan bo cay thu muc hien hanh
	    //tannv.dts@gmail.com
	    */
	    $scope.tempData={};
	    $scope.tempData[-1]={};
	    $scope.treeData={};
	    isoService.treeDir.getTreeDir()
	    	.then(function(data){
    			if(data.status=='success')
    			{

					for(var i=0;i<data.data.length;i++)
					{
						$scope.tempData[data.data[i].NODE_ID]=data.data[i];
					}

					//get relative path
					//----------------------------------------------
					for(var i=(data.data.length-1);i>=0;i--)
					{
						if(data.data[i].FATHER_NODE_ID==-1)
						{
							$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath=''
						}
						else
						{
							if(!$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath)
							{
								$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath=
									'\\'+$scope.tempData[data.data[i].FATHER_NODE_ID].NODE_NAME;
							}
						}
						
						$scope.tempData[data.data[i].NODE_ID].relativePath=
							$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath+
							'\\'+$scope.tempData[data.data[i].NODE_ID].NODE_NAME;
					}
					//----------------------------------------------

					for(var i=0;i<data.data.length;i++)
					{
						if(!$scope.tempData[data.data[i].FATHER_NODE_ID].nodes)
						{
							$scope.tempData[data.data[i].FATHER_NODE_ID].nodes={};
						}
						$scope.tempData[data.data[i].FATHER_NODE_ID].nodes[data.data[i].NODE_ID]=angular.copy(data.data[i]);
					}

					$scope.treeData=$scope.tempData[-1].nodes;


    			}
	    	},function(err){

	    	});

	    //-------------------------------------------------------------------------------------
		//cac action duoc su dung trong tree
	    $scope.treeActions={
	    	createFolder:{name:'createFolder',url:'iso_create_folder_template.html'},
	    	createDocument:{name:'createDocument',url:'iso_create_document_template.html'}
	    }
	    //action hien tai dang dc thao tac
	    $scope.currentTreeAction={};
	    //node hien tai duoc chon tren cay thu muc
	    $scope.selectedTreeNode={};
	    //hien thi popup liet ke tat cac cac action co the thao tac tuong ung voi node hien tai
	    $scope.showTreeActionsMenuPopup=function(node)
	    {
	    	$scope.selectedTreeNode=node;
	    	$("#iso-tree-actions-menu-popup").modal({show:true,backdrop:'static'});
	    }

	    //new folder info template
	    $scope.newFolderBlank={
			    	fatherNodeId:'',
			    	nodeType:$scope.nodeType.folder,
			    	nodeName:'',
			    	description:'',
			    	createdBy:$scope.userInfo.id,
			    	relativePath:''
	    }
	    //new document template
	    $scope.newDocumentBlank={
	    	fatherNodeId:'',
	    	nodeType:$scope.nodeType.document,
	    	nodeName:'',
	    	docCode:'',
	    	description:'',
	    	createdBy:$scope.userInfo.id,
			relativePath:''
	    }
	    //hien thi popup la noi dung cua action da duoc chon
	    $scope.showTreeActionContentPopup=function(treeAction)
	    {
	    	switch(treeAction)
	    	{
	    		case $scope.treeActions.createFolder.name:
	    			$scope.currentTreeAction=$scope.treeActions.createFolder;
	    			$scope.newFolder=angular.copy($scope.newFolderBlank);
	    			break;
	    		case $scope.treeActions.createDocument.name:

	    			$scope.currentTreeAction=$scope.treeActions.createDocument;
	    			$scope.newDocument=angular.copy($scope.newDocumentBlank);
	    			break;
	    	}
	    	$("#iso-tree-actions-menu-popup").modal('hide');
	    	$("#iso-tree-action-content-popup").modal({show:true,backdrop:'static'});
	    }


	    /***
	    //Ham tao thu muc
	    //tann.dts@gmail.com
	    */
	   $scope.newFolderBackErrorTemplate={
	   		name:''
	   }
	   $scope.beforeCreateFolder=function()
	   {
	   		$scope.newFolder.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
    		$scope.newFolder.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newFolder.nodeName;
    		$scope.newFolderBackError=angular.copy($scope.newFolderBackErrorTemplate);

    		isoService.treeDir.checkDupEntry($scope.newFolder.fatherNodeId,$scope.newFolder.nodeName)
    		.then(function(data){
    			if(data.status=='success')
    			{
    				if(data.data.isDup)
    				{
    					if(data.data.counts.NAME)
    						$scope.newFolderBackError.name="Name has been used!";
    				}
    				else
    				{
    					$scope.createFolder();
    				}
    			}
    		});
	   }
	    $scope.createFolder=function()
	    {
    		isoService.treeDir.createFolder($scope.newFolder)
	    		.then(function(data){
	    			if(data.status=='success')
	    			{
	    				msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,isoLang.createFolderSuccess);
						if(!$scope.selectedTreeNode.nodes)
						{
							$scope.selectedTreeNode.nodes={};
						}
						$scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(data.data);
	    			}
	    			else
	    			{
	    				msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createFolderError);
	    			}
	    			$("#iso-tree-action-content-popup").modal('hide');
	    		},function(err){
	    				msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createFolderError);
	    		});
	    }

	    /***
	    //Ham tao file
	    //tannv.dts@gmail.com
	    */
   	   	$scope.newDocumentBackErrorTemplate={
	   		name:'',
	   		docCode:''
	    }
	   $scope.beforeCreateDocument=function()
	   {

	   		$scope.newDocument.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
	    	$scope.newDocument.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newDocument.nodeName;
			$scope.newDocumentBackError=angular.copy($scope.newDocumentBackErrorTemplate);
	    	isoService.treeDir.checkDupEntry($scope.newDocument.fatherNodeId,$scope.newDocument.nodeName,$scope.newDocument.docCode)
    		.then(function(data){
    			if(data.status=='success')
    			{
    				if(data.data.isDup)
    				{
    					if(data.data.counts.NAME)
    						$scope.newDocumentBackError.name="Name has been used!";
    					if(data.data.counts.CODE)
    						$scope.newDocumentBackError.docCode="Document Code has been used!";
    				}
    				else
    				{
    					$scope.createDocument();
    				}
    			}
    		});
	   }
	    $scope.createDocument=function()
	    {
	    	
	    	if(uploader.queue[0])
	    	{
	    		uploader.queue[0].formData[0]={};
    			uploader.queue[0].formData[0]=$scope.newDocument;
    			uploader.uploadAll();
    			
	    	}
	    	else
	    	{
	    		msgPopup(isoLang.isoHeader,isoConst.msgPopupType.fail,isoLang.pleaseSelectFile);
	    	}
	  
	    }

	    //---------------------------------------------------------------
        //HANDLE UPLOAD FILES
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/iso/iso-tree-dir/create-document-with-file'
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
        	uploader.queue.splice(0,uploader.queue.length-1);
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
        	$("#iso-tree-action-content-popup").modal('hide');
        	if(response.status)
        	{
        		if(response.status=='success')
        		{
 					msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,isoLang.createDocumentSuccess);
    				if(!$scope.selectedTreeNode.nodes)
					{
						$scope.selectedTreeNode.nodes={};
					}
					$scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(response.data);
        		}
        		else
        		{
        			msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createDocumentError);
        		}
        	}
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

        $scope.test=function()
        {
        	msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,'hahahahahhaha');
        }

    })


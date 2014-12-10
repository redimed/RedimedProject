/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.controller',[])
    .controller("isoController", function($scope,$state,$cookieStore,toastr,isoService) {

    	/***
    	//Khoi tao cac bien can thiet
    	//tannv.dts@gmail.com
    	*/
    	//lay thong tin nguoi login
    	$scope.userInfo=$cookieStore.get('userInfo');
    	//dinh nghia cac kieu node
    	$scope.nodeType=isoConst.nodeType;
    	//tao ham xuat cac thong bao
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


	    /***
	    //hien thi toan bo cay thu muc hien hanh
	    //tannv.dts@gmail.com
	    */
	    $scope.tempData={};
	    $scope.tempData[-1]={};
	    $scope.treeData={};
	    isoService.getTreeDir()
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
									'\\'+$scope.tempData[data.data[i].FATHER_NODE_ID].DIRECTORY_NAME;
							}
						}
						
						$scope.tempData[data.data[i].NODE_ID].relativePath=
							$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath+
							'\\'+
							($scope.tempData[data.data[i].NODE_ID].NODE_TYPE==$scope.nodeType.folder?
							$scope.tempData[data.data[i].NODE_ID].DIRECTORY_NAME
							:$scope.tempData[data.data[i].NODE_ID].DOC_NAME);
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
			    	folderName:'',
			    	description:'',
			    	createdBy:$scope.userInfo.id,
			    	relativePath:''
	    }
	    $scope.newDocumentBlank={
	    	fatherNodeId:'',
	    	nodeType:$scope.nodeType.document,
	    	docName:'',
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
	    $scope.createFolder=function()
	    {
    		$scope.newFolder.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
    		$scope.newFolder.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newFolder.folderName;
    		isoService.createFolder($scope.newFolder)
    		.then(function(data){
    			if(data.status=='success')
    			{
					msg.success(isoLang.createFolderSuccess);
					if(!$scope.selectedTreeNode.nodes)
					{
						$scope.selectedTreeNode.nodes={};
					}
					$scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(data.data);
    			}
    			else
    			{
					msg.error(isoLang.createFolderError);
    			}
    			$("#iso-tree-action-content-popup").modal('hide');
    		},function(err){
    				msg.error(isoLang.createFolderError);
    		});

	    }

	    /***
	    //Ham tao file
	    //tannv.dts@gmail.com
	    */
	    $scope.createDocument=function()
	    {
	    	$scope.newDocument.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
	    	$scope.newDocument.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newDocument.docName;
	    	isoService.createDocument($scope.newDocument)
	    	.then(function(data){
    			if(data.status=='success')
    			{
    				msg.success(isoLang.createDocumentSuccess);
    				if(!$scope.selectedTreeNode.nodes)
					{
						$scope.selectedTreeNode.nodes={};
					}
					$scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(data.data);
    			}
    			else
    			{
    				msg.error(isoLang.createDocumentError);
    			}
    			$("#iso-tree-action-content-popup").modal('hide');
	    	},function(err){
				msg.error(isoLang.createDocumentError);
	    	});
	    }
    })


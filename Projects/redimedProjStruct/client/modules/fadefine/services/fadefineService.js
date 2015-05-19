angular.module('app.loggedIn.fadefine.service',[])

.factory("FaDefineService", function(Restangular){
    var instanceService = {};

    var v2_api = Restangular.all("api/erm/v2");

    instanceService.insertFa = function(postData){
        var faApi = v2_api.all('fa/insert');
        return faApi.post(postData);
    }

    instanceService.deleteFa = function(headerId){
        var deleteFaApi = v2_api.all('fa/delete');
        return deleteFaApi.post({id: headerId});
    }

    instanceService.getHeaderAndSection = function(headerId){
        var getHeaderAndSectionApi = v2_api.all('fa/get_header_and_sections');
        return getHeaderAndSectionApi.post({id: headerId});
    }

    instanceService.getLines = function(sectionId, headerId){
        var getLinesApi = v2_api.all('fa/get_lines');
        return getLinesApi.post({sectionId: sectionId, headerId: headerId});
    }

    instanceService.getDetailsAndComments = function(lineId){
        var getDetailsAndCommentsApi = v2_api.all('fa/get_details_and_comments');
        return getDetailsAndCommentsApi.post({lineId: lineId});
    }

    instanceService.editFa = function(postData){
        var editFaApi = v2_api.all('fa/edit');
        return editFaApi.post(postData);
    }

    instanceService.changeFaStt = function(status, headerId){
        var changeFaSttApi = v2_api.all('fa/change_header_stt');
        return changeFaSttApi.post({
            headerId: headerId,
            status: status
        })
    }

    instanceService.getImageFiles = function(){
        var getImagesApi = v2_api.all('fa/get_images');
        return getImagesApi.post();
    }

    // instanceService.faChooseSearch = function(){
    //     var faChooseSearchApi = v2_api.all('fa/fa_choose_search');
    //     return faChooseSearchApi.post();
    // }

    return instanceService;
});

angular.module('app.loggedIn.fadefine.service',[])

.factory("FaDefineService", function(Restangular){
    var instanceService = {};

    var v2_api = Restangular.all("api/erm/v2");

    // instanceService.insertHeader = function(header){
    //     var headerApi = v2_api.all('fa/insert_header');
    //     return headerApi.post(header);
    // }

    // instanceService.insertSections = function(sections){
    //     var sectionsApi = v2_api.all('fa/insert_sections');
    //     return sectionsApi.post(sections);
    // }

    // instanceService.insertLines = function(lines){
    //     var linesApi = v2_api.all('fa/insert_lines');
    //     return linesApi.post(lines);
    // }

    // instanceService.insertLineDetails = function(lineDetails){
    //     var lineDetailsApi = v2_api.all('fa/insert_details');
    //     return linesDetailsApi.post(lineDetails);
    // }

    // instanceService.insertLineComments = function(lineComments){
    //     var lineCommentsApi = v2_api.all('fa/insert_comments');
    //     return lineCommentsApi.post(lineComments);
    // }

    instanceService.insertFa = function(postData){
        var faApi = v2_api.all('fa/insert');
        return faApi.post(postData);
    }

    instanceService.deleteFa = function(headerId){
        var deleteFaApi = v2_api.all('fa/delete');
        return deleteFaApi.post({id: headerId});
    }

    return instanceService;
});



// angular.module('app.loggedIn.allergy.service',[])

// .factory("AllergyService", function(Restangular, ConfigService, $state){
// 	var instanceService = {};

// 	var v2_api = Restangular.all("api/erm/v2");

// 	instanceService.insert = function(postData) {
//         var detailApi = v2_api.all('allergy/insert');
// 		return detailApi.post(postData);
//     }

//     instanceService.detail = function(postData) {
//         var detailApi = v2_api.all('allergy/detail');
// 		return detailApi.post({ID:postData});
//     }

//     instanceService.update = function(postData) {
//         var detailApi = v2_api.all('allergy/update');
// 		return detailApi.post(postData);
//     }

//     instanceService.insertPatientAllergy = function(postData) {
//         var detailApi = v2_api.all('allergy/insert_patient_allergy');
//         return detailApi.post(postData);
//     }

//     return instanceService;
// });
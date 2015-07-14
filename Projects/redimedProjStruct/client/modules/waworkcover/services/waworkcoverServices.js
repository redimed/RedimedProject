angular.module('app.loggedIn.waworkcover.service', [])
    .factory('WaWorkCoverService', function (Restangular) {
        var mdtService = {}
        var mdtApi = Restangular.all('api/meditek/v1/')

        //For WA
        mdtService.firstadd = function (postData) {
            var funcApi = mdtApi.all('wa/workcover/first/add');
            return funcApi.post({
                add_data: postData
            });
        };
        mdtService.firstsearch = function (option) {
            var funcApi = mdtApi.all('wa/workcover/first/search');
            return funcApi.post(option);
        };
    
        mdtService.firstdetail = function (wc_id) {
            var funcApi = mdtApi.all('wa/workcover/first/detail');
            return funcApi.post({'ID':wc_id});
        };

        mdtService.firstedit = function (id, postData) {
            var funcApi = mdtApi.all('wa/workcover/first/edit');
            return funcApi.post({
                edit_data: postData,
                edit_id: id
            });
        };

        mdtService.firstGetInjury = function(patient_id, cal_id){
            var funcApi = mdtApi.all('wa/workcover/first/getinjury');
            return funcApi.post({
                patient_id:patient_id,
                cal_id: cal_id
            })
        }

        mdtService.firstprint = function (id) {
            var funcApi = mdtApi.one('wa/workcover/first/print/' + id);
            return funcApi.get();
        };
        mdtService.progressadd = function (postData) {
            var funcApi = mdtApi.all('wa/workcover/progress/add');
            return funcApi.post({
                add_data: postData
            });
        };
        mdtService.progresssearch = function (option) {
            var funcApi = mdtApi.all('wa/workcover/progress/search');
            return funcApi.post(option);
        };

        mdtService.progressedit = function (id, postData) {
            var funcApi = mdtApi.all('wa/workcover/progress/edit');
            return funcApi.post({
                edit_data: postData,
                edit_id: id
            });
        };
    
        mdtService.progressdetail = function (wc_id) {
            var funcApi = mdtApi.all('wa/workcover/progress/detail');
            return funcApi.post({'ID':wc_id});
        };
    
        mdtService.progressprint = function (id) {
            var funcApi = mdtApi.one('wa/workcover/progress/print/' + id);
            return funcApi.get();
        };
        mdtService.finaladd = function (postData) {
            var funcApi = mdtApi.all('wa/workcover/final/add');
            return funcApi.post({
                add_data: postData
            });
        };
        mdtService.finalsearch = function (option) {
            var funcApi = mdtApi.all('wa/workcover/final/search');
            return funcApi.post(option);
        };

        mdtService.finaledit = function (id, postData) {
            var funcApi = mdtApi.all('wa/workcover/final/edit');
            return funcApi.post({
                edit_data: postData,
                edit_id: id
            });
        };
         mdtService.finaldetail = function (wc_id) {
            var funcApi = mdtApi.all('wa/workcover/final/detail');
            return funcApi.post({'ID':wc_id});
        };
        mdtService.finalprint = function (id) {
            var funcApi = mdtApi.one('wa/workcover/final/print/' + id);
            return funcApi.get();
        };
    
        mdtService.generaladd = function(postData){
            var funcApi = mdtApi.all('wa/workcover/general/add');
            return funcApi.post(postData);
        }
        
        mdtService.generaledit = function (id, postData) {
            var funcApi = mdtApi.all('wa/workcover/general/edit');
            return funcApi.post({
                edit_data: postData,
                edit_id: id
            });
        };
        mdtService.generaldetail= function (wc_id) {
            var funcApi = mdtApi.all('wa/workcover/general/detail');
            return funcApi.post({'ID':wc_id});
        };

        return mdtService;
    });
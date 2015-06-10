angular.module('starter.main.services',[])
    .factory("MainService", function(Restangular){
        var mainService = {};
        var mainApi = Restangular.all("api");

        mainService.getCompany = function(options){
            var getCompanyApi = mainApi.all("phCompany/getCompany");
            return getCompanyApi.post({user_id:options});
        }
        mainService.updateCompanyInfo = function(options){
            var updateCompanyInfoApi = mainApi.all("phCompany/updateCompanyInfo");
            return updateCompanyInfoApi.post(options);
        }

        mainService.delelteShopCompany = function(shop_id){
            var delelteShopCompanyApi = mainApi.all("phCompany/delelteShopCompany");
            return delelteShopCompanyApi.post({shop_id:shop_id});
        }

        mainService.deletePostShop = function(shop_id){
            var deletePostShopApi = mainApi.all("phCompany/deletePostShop");
            return deletePostShopApi.post({shop_id:shop_id});
        }

        mainService.updateShopCompany=function(options){
            var updateShopCompanyApi = mainApi.all("phCompany/updateShopCompany");
            return updateShopCompanyApi.post(options);
        }
        mainService.addNewUserInCompany=function(options){
            var addNewUserInCompanyApi = mainApi.all("phCompany/addNewUserInCompany");
            return addNewUserInCompanyApi.post(options);
        }
         mainService.getUserByCompany=function(options){
            var getUserByCompanyApi = mainApi.all("phCompany/getUserByCompany");
            return getUserByCompanyApi.post({company_id:options});
        }
        mainService.checkIsMain = function(user_id){
            var checkIsMainApi = mainApi.all("phCompany/checkIsMain");
            return checkIsMainApi.post({user_id:user_id});
        }
        
        mainService.getPharmacist = function(options){
            var getPharmacistApi = mainApi.all("phPharmacist/getPharmacist");
            return getPharmacistApi.post({user_id:options});
        }

        mainService.updatePharmasictInfo = function(options){
            var updatePharmasictInfoApi = mainApi.all("phPharmacist/updatePharmasictInfo");
            return updatePharmasictInfoApi.post(options);
        }

        mainService.addNewQualification = function(qualification,pharmacist_id){
            var addNewQualificationApi = mainApi.all("phPharmacist/addNewQualification");
            return addNewQualificationApi.post({qualification:qualification,pharmacist_id:pharmacist_id})
        }
        mainService.getAllPharmacisQualification = function(pharmacist_id){
            var getAllPharmacisQualificationApi = mainApi.all("phPharmacist/getAllPharmacisQualification");
            return getAllPharmacisQualificationApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.deletePharmacistQualification = function(pharmacist_id){
            var deletePharmacistQualificationApi = mainApi.all("phPharmacist/deletePharmacistQualification");
            return deletePharmacistQualificationApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.updateQulification = function(qualification,qualification_id){
            var updateQulificationApi = mainApi.all("phPharmacist/updateQulification");
            return updateQulificationApi.post({qualification:qualification,qualification_id:qualification_id});
        }

        mainService.addNewExp = function(exp,pharmacist_id){
            var addNewExpApi = mainApi.all("phPharmacist/addNewExp");
            return addNewExpApi.post({exp:exp,pharmacist_id:pharmacist_id});
        }

        mainService.getExp = function(pharmacist_id){
            var getExpApi = mainApi.one("phPharmacist/getExp");
            return getExpApi.get({pharmacist_id:pharmacist_id});
        }

        mainService.deleteExp = function(exp_id){
            var deleteExpApi = mainApi.all("phPharmacist/deleteExp");
            return deleteExpApi.post({exp_id:exp_id});
        }

        mainService.updateExp = function(exp){
            var updateExpApi = mainApi.all("phPharmacist/updateExp");
            return updateExpApi.post({exp:exp});
        }
        
        mainService.insertCompanyShop = function(options,company_id){
            var insertCompanyShopApi = mainApi.all("phShops/insertCompanyShop");
            return insertCompanyShopApi.post({ShopInfo:options,company_id:company_id});
        }

        mainService.getCompanyShopById = function(company_id){
            var getCompanyShopByIdApi = mainApi.one("phShops/getCompanyShopById");
            return getCompanyShopByIdApi.get({company_id:company_id});
        }

        mainService.insertNewPost = function(data_post, shop_id){
            var insertNewPostApi = mainApi.all("phCompany/insertNewPost");
            return insertNewPostApi.post({post:data_post, shop:shop_id});
        }

        mainService.getAllShopPost = function(){
            var getAllShopPostApi = mainApi.all("phCompany/getAllShopPost");
            return getAllShopPostApi.post();
        }

        mainService.insertPostCadidates = function(post_id, shop_id, user_id){
            var insertPostCadidatesApi = mainApi.all("phCompany/insertPostCadidates");
            return insertPostCadidatesApi.post({post_id:post_id, shop_id:shop_id, user_id:user_id});
        }

        //  mainService.getPostCadidates = function(user_id){
        //     var getPostCadidatesApi = mainApi.all("phUser/getPostCadidates");
        //     return getPostCadidatesApi.post({user_id:user_id});
        // }

        mainService.uploadAvatarPic = function(){
            var uploadAvatarApi = mainApi.all("phUser/uploadAvatar");
            return uploadAvatarApi.post({});
        }

        mainService.getAvatar = function(user_id){
            var getAvatarApi = mainApi.one("phUser/getAvatar");
            return getAvatarApi.get({user_id:user_id});
        }

        mainService.getPostForShopId = function(shop_id){
            var getPostForShopIdApi = mainApi.all("phCompany/getPostForShopId");
            return getPostForShopIdApi.post({shop_id:shop_id});
        }

        mainService.countMember = function(post_id){
            var countMemberApi = mainApi.all("phCompany/countMember");
            return countMemberApi.post({post_id:post_id});
        }

        mainService.getPostByUserId = function(user_id){
            var getPostByUserIdApi = mainApi.all("phPharmacist/getPostByUserId");
            return getPostByUserIdApi.post({user_id:user_id});
        }

        mainService.searchPost = function(data_post, selected){
            var searchPostApi = mainApi.all("phPharmacist/searchPost");
            return searchPostApi.post({data_post:data_post, selected:selected});
        }

        mainService.deleteUserInCompany = function(user_id){
            var deleteUserInCompanyApi = mainApi.all("phCompany/deleteUserInCompany");
            return deleteUserInCompanyApi.post({user_id:user_id});
        }

        mainService.deleteUserInCompany = function(user_id){
            var deleteUserInCompanyApi = mainApi.all("phCompany/deleteUserInCompany");
            return deleteUserInCompanyApi.post({user_id:user_id});
        }

        mainService.getDistance = function(user){
            var getDistanceApi = mainApi.all("phPharmacist/getDistance");
            return getDistanceApi.post({user:user});
        }

        mainService.getJobTitle = function(title){
            var getJobTitleApi = mainApi.all("phPharmacist/getJobTitle");
            return getJobTitleApi.post({title:title});
        }

        mainService.getJobDescription = function(description){
            var getJobDescriptionApi = mainApi.all("phPharmacist/getJobDescription");
            return getJobDescriptionApi.post({description:description});
        }

        mainService.getSearch = function(title, description){
            var getSearchApi = mainApi.all("phPharmacist/getSearch");
            return getSearchApi.post({title:title, description:description});
        }

        mainService.getCompanyId = function(user_id){
            var getCompanyIdApi = mainApi.all("phCompany/getCompanyId");
            return getCompanyIdApi.post({user_id:user_id});
        }

        mainService.getPostCompany = function(company_id){
            var getPostCompanyApi = mainApi.all("phCompany/getPostCompany");
            return getPostCompanyApi.post({company_id:company_id});
        }

        mainService.detailPosts = {};

        mainService.editShop = {};

        return mainService;
    })
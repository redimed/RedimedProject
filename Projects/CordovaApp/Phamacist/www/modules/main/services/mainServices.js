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

        // mainService.delelteShopCompany = function(shop_id){
        //     var delelteShopCompanyApi = mainApi.all("phCompany/delelteShopCompany");
        //     return delelteShopCompanyApi.post({shop_id:shop_id});
        // }

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

        mainService.getAllShopPost = function(currentRecord){
            var getAllShopPostApi = mainApi.all("phCompany/getAllShopPost");
            return getAllShopPostApi.post({currentRecord:currentRecord});
        }

        mainService.insertPostCadidates = function(post_id, shop_id, user_id, currentDate){
            var insertPostCadidatesApi = mainApi.all("phCompany/insertPostCadidates");
            return insertPostCadidatesApi.post({post_id:post_id, shop_id:shop_id, user_id:user_id, currentDate:currentDate});
        }

        mainService.uploadAvatarPic = function(){
            var uploadAvatarApi = mainApi.all("phUser/uploadAvatar");
            return uploadAvatarApi.post();
        }

        mainService.getAvatar = function(user_id){
            var getAvatarApi = mainApi.one("phUser/getAvatar");
            return getAvatarApi.get({user_id:user_id});
        }

        mainService.getPostForShopId = function(shop_id){
            var getPostForShopIdApi = mainApi.all("phCompany/getPostForShopId");
            return getPostForShopIdApi.post({shop_id:shop_id});
        }

        mainService.countMember = function(post_id, shop_id){
            var countMemberApi = mainApi.all("phCompany/countMember");
            return countMemberApi.post({post_id:post_id, shop_id:shop_id});
        }

        mainService.getPostByUserId = function(user_id){
            var getPostByUserIdApi = mainApi.all("phPharmacist/getPostByUserId");
            return getPostByUserIdApi.post({user_id:user_id});
        }

        mainService.getAllShopPostDistance = function(){
            var getAllShopPostDistanceApi = mainApi.all("phPharmacist/getAllShopPostDistance");
            return getAllShopPostDistanceApi.post();
        }

        mainService.deleteUserInCompany = function(user_id){
            var deleteUserInCompanyApi = mainApi.all("phCompany/deleteUserInCompany");
            return deleteUserInCompanyApi.post({user_id:user_id});
        }

        mainService.deleteUserInCompany = function(user_id){
            var deleteUserInCompanyApi = mainApi.all("phCompany/deleteUserInCompany");
            return deleteUserInCompanyApi.post({user_id:user_id});
        }

        mainService.getDistanceData = function(user){
            var getDistanceDataApi = mainApi.all("phPharmacist/getDistance");
            return getDistanceDataApi.post({user:user});
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

        mainService.getPostCompany = function(company_id, currentRecord){
            var getPostCompanyApi = mainApi.all("phCompany/getPostCompany");
            return getPostCompanyApi.post({company_id:company_id, currentRecord:currentRecord});
        }

        mainService.getPharmacistId = function(post_id, shop_id){
            var getPharmacistIdApi = mainApi.all("phCompany/getPharmacistId");
            return getPharmacistIdApi.post({post_id:post_id, shop_id:shop_id});
        }

        mainService.getPharmacistInfo = function(pharmacist_id){
            var getPharmacistInfoApi = mainApi.all("phCompany/getPharmacistInfo");
            return getPharmacistInfoApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.getDetailInfoPhar = function(pharmacist_id){
            var getDetailInfoPharApi = mainApi.all("phCompany/getDetailInfoPhar");
            return getDetailInfoPharApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.acceptPharmacist = function(post_id, shop_id, pharmacist_id, currentDate){
            var acceptPharmacistApi = mainApi.all("phCompany/acceptPharmacist");
            return acceptPharmacistApi.post({post_id:post_id, shop_id: shop_id, pharmacist_id:pharmacist_id, currentDate:currentDate});
        }

        mainService.checkIsSelect = function(post_id, shop_id, pharmacist_id){
            var checkIsSelectApi = mainApi.all("phCompany/checkIsSelect");
            return checkIsSelectApi.post({post_id:post_id, shop_id: shop_id, pharmacist_id:pharmacist_id});
        }

        mainService.getExpPhar = function(pharmacist_id){
            var getExpPharApi = mainApi.all("phCompany/getExpPhar");
            return getExpPharApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.getQuaPhar = function(pharmacist_id){
            var getQuaPharApi = mainApi.all("phCompany/getQuaPhar");
            return getQuaPharApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.selTokenIdPhar = function(pharmacist_id){
            var selTokenIdPharApi = mainApi.all("phCompany/selTokenIdPhar");
            return selTokenIdPharApi.post({pharmacist_id:pharmacist_id});
        }

        mainService.selTokenIdCo = function(post_id, shop_id){
            var selTokenIdCoApi = mainApi.all("phCompany/selTokenIdCo");
            return selTokenIdCoApi.post({post_id:post_id, shop_id:shop_id});
        }

        mainService.postIsSelect = function(user_id){
            var postIsSelectApi = mainApi.all("phPharmacist/postIsSelect");
            return postIsSelectApi.post({user_id:user_id});
        }

        mainService.delPostById = function(data){
            var delPostByIdApi = mainApi.all("phCompany/delPostById");
            return delPostByIdApi.post({data:data});
        }

        mainService.detailPosts = {};

        mainService.editShop = {};

        mainService.infoPharmacist = {};

        mainService.allShop = {};

        return mainService;
    })
/** 
* Created by meditech on 23/09/2014. 
*/ 
   angular.module('app.loggedIn.PmProperties',[ 
       'app.loggedIn.PmProperties.controller', 
       'app.loggedIn.PmProperties.NewEdit.controller', 
       'app.loggedIn.PmProperties.services' 
   ]) 
       .config(function($stateProvider){ 
           $stateProvider 
              .state('loggedIn.PmProperties',{ 
                   url:'/PmProperties', 
                  templateUrl: 'modules/PmProperties/views/PmProperties.html', 
                   controller: 'PmPropertiesController' 
              }) 

              .state('loggedIn.NewEditPmProperties',{ 
                   url:'/NewPmProperties', 
                  templateUrl: 'modules/PmProperties/views/NewEditPmProperties.html', 
                   controller: 'NewEditPmPropertiesController' 
              }) 

               .state('loggedIn.EditPmProperties',{
                   url:'/Edit/:id',
                   templateUrl: 'modules/PmProperties/views/NewEditPmProperties.html',
                   controller: 'NewEditPmPropertiesController'
               })       });
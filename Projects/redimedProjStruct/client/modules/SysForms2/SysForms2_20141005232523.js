/** 
* Created by meditech on 23/09/2014. 
*/ 
   angular.module('app.loggedIn.SysForms2',[ 
       'app.loggedIn.SysForms2.controller', 
       'app.loggedIn.SysForms2.NewEdit.controller', 
       'app.loggedIn.SysForms2.services' 
   ]) 
       .config(function($stateProvider){ 
           $stateProvider 
              .state('loggedIn.SysForms2',{ 
                   url:'/SysForms2', 
                  templateUrl: 'modules/SysForms2/views/SysForms2.html', 
                   controller: 'SysForms2Controller' 
              }) 

              .state('loggedIn.NewEditSysForms2',{ 
                   url:'/NewSysForms2', 
                  templateUrl: 'modules/SysForms2/views/NewEditSysForms2.html', 
                   controller: 'NewEditSysForms2Controller' 
              }) 

               .state('loggedIn.EditSysForms2',{
                   url:'/EditSysForms2/:id',
                   templateUrl: 'modules/SysForms2/views/NewEditSysForms2.html',
                   controller: 'NewEditSysForms2Controller'
               })       });
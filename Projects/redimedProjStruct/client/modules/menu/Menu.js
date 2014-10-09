/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu',['app.loggedIn.menu.controller','app.loggedIn.menu.services'])
.config(function($stateProvider){
    $stateProvider
        .state('loggedIn.menu',{
            url: '/menus',
            templateUrl: 'modules/menu/views/menu.html',
            controller: 'MenuController'
        })
})
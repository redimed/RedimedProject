(function() {
  'use strict';

  angular.module('irontec.simpleChat', ['luegg.directives']);

  angular.module('irontec.simpleChat').directive('irontecSimpleChat', SimpleChat);

  

  function SimpleChat() {

    var chatTemplate =
    // '<div class="row chat-window col-xs-5 col-md-3" ng-class="vm.theme" style="margin-left:10px;">' +
    //   '<div class="col-xs-12 col-md-12">' +
    //     '<div class="panel">' +
    //       '<div class="panel-heading chat-top-bar">' +
    //         '<div class="col-md-8 col-xs-8">' +
    //           '<h3 class="panel-title"><span class="glyphicon glyphicon-comment"></span> {{vm.title}}</h3>' +
    //         '</div>' +
    //         '<div class="col-md-4 col-xs-4" style="text-align: right;">' +
    //           '<span class="glyphicon" ng-class="vm.chatButtonClass" ng-click="vm.toggle()"></span>' +
    //         '</div>' +
    //       '</div>' +
    //       '<div class="panel-body msg-container-base" ng-style="vm.panelStyle" scroll-glue>' +
    //         '<div class="row msg-container" ng-repeat="message in vm.messages">' +
    //           '<div class="col-md-12 col-xs-12">' +
    //             '<div class="chat-msg" ng-class="vm.username === message.username ?' + " 'chat-msg-sent' : 'chat-msg-receive'" + '" chat-msg-sent">' +
    //               '<p>{{message.content}}</p>' +
    //               '<strong class="chat-msg-author">{{message.username}}</strong>' +
    //             '</div>' +
    //           '</div>' +
    //         '</div>' +
    //       '</div>' +
    //       '<div class="panel-footer">' +
    //         '<form style="display:inherit" ng-submit="vm.submitFunction()">' +
    //           '<div class="input-group" >' +
    //             '<input type="text" class="form-control input-sm chat-input" placeholder="{{vm.inputPlaceholderText}}" ng-model="vm.writingMessage" />' +
    //             '<span class="input-group-btn">' +
    //               '<input type="submit" class="btn btn-sm chat-submit-button" value="{{vm.submitButtonText}}" />' +
    //             '</span>' +
    //           '</div>' +
    //         '</form>' +
    //       '</div>' +
    //     '</div>' +
    //   '</div>' +
    // '</div>';



    
    '<div class="row chat-window" style="margin-left:10px;" ng-style="vm.windowStyle"> ' +
        '<div class="panel panel-primary">' +
            '<div class="panel-heading" id="accordion">' +
                '<span class="glyphicon glyphicon-comment"></span> &nbsp; {{vm.title}}' +
                '<div class="btn-group pull-right">' +
                    '<a type="button" class="btn btn-default blue-steel btn-xs" ng-click="vm.toggle()"  data-parent="#accordion" href="javascript:;">' +
                        '<span ng-class="vm.chatButtonClass"></span>' +
                    '</a>' +
                    '<a type="button" class="btn btn-default red btn-xs" ng-click="vm.close()"  href="javascript:;">' +
                        '<span class="glyphicon glyphicon-remove"></span>' +
                    '</a>' +
                '</div>' +
            '</div>' +
            '<div class="panel-body" ng-style="vm.panelStyle">' +
                '<ul class="chat">' +
                    '<li ng-repeat="message in vm.messages" class="clearfix" ng-class="vm.username === message.username ?' + " 'right' : 'left'"+ '">'+
                        '<span class="chat-img" ng-class="vm.username === message.username ?' + " 'pull-right' : 'pull-left'" + '">' +
                            '<img class="img-circle" ng-if="vm.username !== message.username" ng-src="{{vm.chatImage}}" width="40" height="40" />' +
                            '<img class="img-circle" ng-if="vm.username === message.username" ng-src="{{vm.userImage}}" width="40" height="40" />' +
                        '</span>' +
                        '<div class="chat-body clearfix">' +
                            '<div ng-if="vm.username !== message.username" class="header">' +
                                '<strong class="primary-font">{{message.username}}</strong>' +
                                '<small class="pull-right text-muted"></small>' +
                            '</div>' +
                            '<div ng-if="vm.username === message.username" class="header">' +
                                '<small class=" text-muted"></small>' +
                                '<strong class="pull-right primary-font">{{message.username}}</strong>' +
                            '</div>' +

                            '<p>{{message.content}}</p>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
            '<div class="panel-footer">' +
              '<form ng-submit="vm.submitFunction()">'+
                  '<div class="input-group">' +
                      '<input id="btn-input" type="text" class="form-control input-sm" ng-model="vm.writingMessage" placeholder="Type your message here..." />' +
                      '<span class="input-group-btn">' +
                          '<input type="submit" class="btn btn-warning btn-sm" value="{{vm.submitButtonText}}" />' +
                      '</span>' +
                  '</div>' +
              '</form>'+
            '</div>' +
        '</div>' +
    '</div>';
    

    var directive = {
      restrict: 'EA',
      template: chatTemplate,
      replace: true,
      scope: {
        messages: '=',
        username: '=',
        userImage: '=',
        chatImage: '=',
        submitButtonText: '@',
        title: '=',
        submitFunction: '&',
        isShow: '='
      },
      link: link,
      controller: ChatCtrl,
      controllerAs: 'vm'
    };

    function link(scope) {

      if(!scope.submitButtonText || scope.submitButtonText === '') {
        scope.submitButtonText = 'Send';
      }

      if(!scope.title) {
        scope.title = 'Chat';
      }

      // scope.$watch('isShow', function(newValue, oldValue) {
      //     console.log(newValue);
      //     if (newValue == true) 
      //         scope.isShow = true;
      //     else
      //         scope.isShow = false;
      // }, true);

    }

    return directive;
  }

  ChatCtrl.$inject = ['$scope'];

  function ChatCtrl($scope) {
    console.log($scope.isShow);

    var vm = this;
    var isHidden = false;

    vm.messages = $scope.messages;
    vm.username = $scope.username;
    vm.submitButtonText = $scope.submitButtonText;
    vm.userImage = $scope.userImage;
    vm.chatImage = $scope.chatImage;
    vm.isShow = $scope.isShow;
    vm.title = $scope.title;
    vm.writingMessage = '';
    vm.submitFunction = function() {
      $scope.submitFunction()(vm.writingMessage, vm.username);
      vm.writingMessage = '';
    };

    if($scope.isShow == true)
        vm.windowStyle = {'display': 'block'};
    else
        vm.windowStyle = {'display': 'none'};

    vm.panelStyle = {'display': 'block'};
    vm.chatButtonClass= 'glyphicon glyphicon-chevron-down';
   

    vm.toggle = toggle;

    vm.close = close;

    function close(){
        vm.windowStyle = {'display': 'none'};
        $scope.isShow = false;
    }

    function toggle() {
      if(isHidden) {
        vm.chatButtonClass = 'glyphicon glyphicon-chevron-down';
        vm.panelStyle = {'display': 'block'};
        isHidden = false;
      } else {
        vm.chatButtonClass = 'glyphicon glyphicon-chevron-up';
        vm.panelStyle = {'display': 'none'};
        isHidden = true;
      }

    }

  }


})();

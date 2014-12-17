angular.module("app.loggedIn.iso.directive", [])
	.directive('isoDemoDirective', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                message:'@',
                type:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_fade_in_out_template.html',
            controller: function ($scope)
            {
                
            }
        };
    })

    .directive('isoNoticeFinishRenderDirectoryTree', function() {
        return function(scope, element, attrs) {
            //angular.element(element).css('color','blue');
            if (scope.$last)
            {
                //scope.collapseAll();
                $('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
                //tannv.dts modify
                $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').unbind('click');
                //----------------
                $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').on('click', function (e) {
                    var children = $(this).parent('li.parent_li').find(' > ul > li');
                    if (children.is(':visible')) {
                        children.hide('fast');
                        $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus').removeClass('fa-minus');
                    }
                    else {
                        children.show('fast');
                        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus').removeClass('fa-plus');
                    }
                    e.stopPropagation();
                });
                //window.alert("im the last!");
            }
        };
    })


    .directive('isoMsgPopup', function() {
        return {
            restrict: 'E',
            transclude:true,
            scope: {
                styleClass:   '=',
                header:     '=',
                type:     '=',
                content:        '='
            },
            templateUrl: 'modules/iso/directives/isoMsgPopup.html',
            controller:function($scope){
                $scope.msgPopupType=isoConst.msgPopupType;
            }
        };
    })
angular.module("app.loggedIn.TimeSheet.ApproveTask.Controller", [])
    .controller("ApproveTask", function($scope, $modal) {
        $scope.list = {};
        $scope.list.result = [{
            emloyee: "Bastick Adam",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Waiting for approval"
        }, {
            emloyee: "Bastick Adam",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Waiting for approval"
        }, {
            emloyee: "Bastick Adam",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Waiting for approval"
        }, {
            emloyee: "Bastick Adam",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Waiting for approval"
        }, {
            emloyee: "Bastick Adam",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Waiting for approval"
        }, {
            emloyee: "Burrows Lucy",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Approved"
        }, {
            emloyee: "Burrows Lucy",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Approved"
        }, {
            emloyee: "Burrows Lucy",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Approved"
        }, {
            emloyee: "Burrows Lucy",
            period: new Date(),
            timespent: "01:30",
            approver: "Margevka Marianna",
            status: "Approved"
        }, {
            emloyee: "Chalker Alanna",
            period: new Date(),
            timespent: "01:30",
            approver: "Darch Timothy",
            status: "Approved"
        }, {
            emloyee: "Chalker Alanna",
            period: new Date(),
            timespent: "01:30",
            approver: "Darch Timothy",
            status: "Approved"
        }, {
            emloyee: "Chalker Alanna",
            period: new Date(),
            timespent: "01:30",
            approver: "Darch Timothy",
            status: "Approved"
        }, {
            emloyee: "Chalker Alanna",
            period: new Date(),
            timespent: "01:30",
            approver: "Darch Timothy",
            status: "Approved"
        }];
        $scope.date = new Date();

        //DIALOG VIEWTASK
        var dialogViewTask = function() {
            var modalInstance = $modal.open({
                templateUrl: "ViewTask",
                controller: function() {

                },
                size: "lg"
            });
        };
        //END DIALOG VIEWTASK

        $scope.viewTask = function() {
            dialogViewTask();
        };
    });

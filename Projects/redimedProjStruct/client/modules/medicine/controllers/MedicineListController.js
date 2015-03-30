angular.module('app.loggedIn.medicine.list.controller',[

])

.controller('MedicineListController', function($scope){
	$scope.medicine_panel={};

	var selectedID = null;

	$scope.medicine = {
		select:0,
		scope: $scope.patient_panel,
		options: {
			api:'api/erm/v2/medicine/search',
			method: 'post',
			scope: $scope.medicine_panel,
			columns:[
                {field: 'medicine_id', is_hide: true},
                {field: 'medicine_name', label: 'Medicine Name'},
                {field: 'medicine_price', label: 'Price per unit'},
            ],

            use_filters: true,
            filters:{
            	medicine_name: {type: 'text'},
            },
            use_actions: true,
            actions: [              
                {
                    class: 'fa fa-info', title: 'Edit',
                    callback: function(item){
                        console.log('this is selected item',item)
                            $scope.medicine.id = item.medicine_id;
                            $scope.medicineEditForm.open();
                    }
                },
            ],
		}
	}

	$scope.medicineAddForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.medicine_panel.reload();
                $scope.medicineAddForm.close();
        }
    }

    $scope.medicineEditForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.medicine_panel.reload();
                $scope.medicineEditForm.close();
        }
    }
});
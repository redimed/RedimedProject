angular.module('app.loggedIn.doctor')
    .controller('DoctorListController',function($scope){
        $scope.doctor_panel = {};
        $scope.doctor = {};
    
        $scope.doctors = {
            select:0,
            class:function(doctor){
                return {
                    selected: (doctor.doco == $scope.doctors.select)
                };
            },
            scope: $scope.doctor_panel,
            options:{
                api:'api/erm/v2/doctor/search',
                method:'post',
                scope: $scope.doctor_panel,
                columns: [
                    {field: 'doctor_id', is_hide: true},
                    {field: 'NAME', label: 'Full name'},    
                    {field: 'Email', label: 'Email'},
                    {field: 'Phone', label: 'Phone'},     
                    {field: 'Specialties', label: 'Specialties', not_submit:true, 
                     type: 'custom', 
                     fn: function(item){
                        if(!item.specialties || item.specialties.length == 0) 
                            return '';
                         
                        var specialties = [];
                        angular.forEach(item.specialties, function(value, key){
                            specialties.push(value.Specialties_name);
                        })
                         
                        return  specialties.join(', ');
                     }
                    },     
                ],
                use_filters: true,
                filters: {
                    NAME: {type: 'text'},
                    Email: {type: 'text'},
                    Phone: {type: 'text'},
                },
                use_actions: true, 
                actions: [              
                    {
                        class: 'fa fa-pencil', title: 'Edit',
                        callback: function(doctor){
                            $scope.doctorEditForm.open(doctor.doctor_id);
                        }
                    }
                ],
                
            }
        };
    
        $scope.doctorAddForm = {
            is_show: false,
            open: function () {
                $scope.params_doctor = {
                    permission: {
                        create: true,
                        edit: false
                    }
                }
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.doctor_panel.reload();
            }
        };
    
        $scope.doctorEditForm = {
            is_show: false,
            open: function (doc_id) {
                $scope.params_doctor = {
                    permission: {
                        create: false,
                        edit: true
                    },
                    id: doc_id
                }
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.doctor_panel.reload();
            }
        };
    
    });
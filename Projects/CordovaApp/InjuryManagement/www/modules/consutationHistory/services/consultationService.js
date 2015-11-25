angular.module('starter.consultation.services',[])

    .factory('ConsultationServices', function(Restangular){
        var ConsultationServices = {};
        
        var ConsultationApi = Restangular.all("api");
        // api get consulation list
        ConsultationServices.consultationList = function(patientid){
            var consultation = ConsultationApi.all('consultation/listconsultofpatientmobile');
            return consultation.post({patient_id:patientid});
        }
        //api get detail consulation by patientID and cal_id
        ConsultationServices.consultationByID = function(patientid,caid){
        	var consultation = ConsultationApi.all('consultation/detailhistoryanddrawing');
        	return consultation.post({patient_id:patientid,cal_id:caid})
        }
        return ConsultationServices;
    })


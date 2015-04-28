angular.module('app.loggedIn.invoice.services', [])

.factory('InvoiceService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all("api/erm/v2");

	mdtService.headerDetail = function(id){
		var funcApi = mdtApi.all('invoice/detail');
		return funcApi.post({header_id: id});
	}

	mdtService.save = function(id, postData){
		var funcApi = mdtApi.all('invoice/save');
		return funcApi.post({ header_id: id, status:postData.STATUS, lines: postData.lines, service_id: postData.SERVICE_ID,postData:postData});
	}

	mdtService.update = function(id, postData){
		var funcApi = mdtApi.all('invoice/update');
		return funcApi.post({ header_id: id, data: postData});
	}

	mdtService.add = function(postData){
		var funcApi = mdtApi.all('invoice/add');
		return funcApi.post({data: postData});
	}



	 // instanceService.invoiceDetail = function(header_id) {
  //       var funcApi = khankAPI.all('invoice/detail');
  //       return funcApi.post({header_id: header_id});
  //   }

    // instanceService.invoiceSave = function(header_id) {
    //     var funcApi = khankAPI.all('invoice/save');
    //     return funcApi.post({header_id: header_id});
    // }


	
	
	
	mdtService.search = function(option){
		var funcApi = mdtApi.all('search');
		return funcApi.post(option);
	}
	return mdtService;
})
angular.module('app.loggedIn.invoice', [
	'app.loggedIn.invoice.directives',
	'app.loggedIn.invoice.services',
	'app.loggedIn.invoice.controller',
]).config(function ($stateProvider) {
	$stateProvider
	// STRUCTURE
	.state("loggedIn.invoice", {
	    abstract: true,
	    templateUrl: "modules/invoice/views/structure.html",
	    controller: "InvoiceController"
	})
	 .state("loggedIn.invoice.list", {
        url: "/invoice/list",
        views: {
            "main-content": {
                templateUrl: "modules/invoice/views/list.html",
                controller: "InvoiceListController"
            }
        }
    })



});
angular.module('app.loggedIn.company.include',[
	'app.loggedIn.company.directives.list',
	'app.loggedIn.company.controllers.list',
	'app.loggedIn.company.models',
	'app.loggedIn.company.controllers.add',
	'app.loggedIn.company.directives.add',
	'app.loggedIn.company.controllers.edit',
	'app.loggedIn.company.directives.edit',
	'app.loggedIn.company.controllers.listParent',
	'app.loggedIn.company.directives.listParent',
	'app.loggedIn.company.controllers.listInsurer',
	'app.loggedIn.company.directives.listInsurer',
	'app.loggedIn.company.dialog.addParent',
	'app.loggedIn.company.dialog.addInusrer',
	'app.loggedIn.company.dialog.remove',
	'app.loggedIn.company.directives.listNotFollow',
	'app.loggedIn.company.controllers.listNotFollow',
	'app.loggedIn.company.dialog.listNoFollow'
])
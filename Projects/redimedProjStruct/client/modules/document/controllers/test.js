angular.module('app.loggedIn.document.test.controllers',[])
.controller("test",function($scope, $http, $cookieStore, $state, $stateParams){


	//OOP
	/* 
		****-------create class--------****
		function MyClass(prop1,prop2){
			this.prop1 = prop1;
			this.prop2 = prop2;
			this.Action = function(){
				//TODO : do something
			}
		}

		****--------function inherit-------****
		function inheritPrototype(Class_Parent, Class_Child){
			var CopyOfParent = Object.create(Class_Parent);
			Class_Child.prototype = CopyOfParent;
		};

		inheritPrototype(Parent,Child);
	*/

	// 1. cach 1 

	function Machine (colors,name,type){
		this.colors = colors;
		this.name   = name;
		this.type   = type;
		this.ShowType = function(){
			console.log("this is a "+this.type);
		};
	}

	function Computer (chips,blah){
		this.chips = chips;
		this.blah  = blah;
		this.ShowChips = function(){
			console.log("This is "+this.chips);
		}
	}

	var Machines = new Machine("red","Intel","Computer");
	var Computers= new Computer("core i5","good");
	function inheritPrototype(parent,child){
		var copyOfparent = Object.create(parent);
		//copyOfparent.constructor = child;
		child.prototype = copyOfparent;
	};
	inheritPrototype(Machines,Computers);// phuong nay dung de ke thua: Computer ke thua nhung thuoc tinh cua Machine
	console.log(Computers);
	Computers.prototype.ShowType();

	

});
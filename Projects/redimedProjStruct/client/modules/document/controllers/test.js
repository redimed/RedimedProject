angular.module('app.loggedIn.document.test.controllers',[])
.controller("test",function($scope, $http, $cookieStore, $state, $stateParams){

	// 1. cach 1 

	// function Fruit (thecolors,thesweetness,thefruitName,thenativeToLand){
	// 	this.colors 	  = thecolors;
	// 	this.sweetness 	  = thesweetness;
	// 	this.fruitName    = thefruitName;
	// 	this.nativeToLand = thenativeToLand;
	// 	this.showName = function(){
	// 		console.log("This is a " + this.fruitName);
	// 	};
	// 	this.nativeTo = function(){
	// 		this.nativeToLand.forEach(function(country){
	// 			console.log("Grown in:" + country);
	// 		});		
	// 	}
	// }
	// var aMango = new Fruit("red",9,"Apple",["IRRAQ","VIETNAMESE"]);
	// //delete aMango.colors;
	// aMango.showName();
	// aMango.nativeTo();
	// console.log(aMango.hasOwnProperty("aaaa"));
	// console.log("toString" in aMango);
	// for(var eachItem in aMango){
	// 	console.log(eachItem);
	// }

	// end 1.

	// 2. cach 2

	function User(theName,theEmail){
		this.name         = theName;
		this.email        = theEmail;
		this.arrayscores  = [];
		this.currentscore = 0;
	};
	User.prototype = {
		constructor:User,

		SaveScore:function(theScore){
			this.arrayscores.push(theScore);
		},
		ShowAll:function(){
			var score = this.arrayscores.length >0 ? this.arrayscores.join(", "):"No Scores Yet";
			return this.name + ", Scores: " + score;
		},
		ChangeName:function(newName){
			this.name = newName;
			return "New Name Saved: " + this.name;
		}
	};

	var A = new User("arshavin","a23@g.c");
	console.log(A);
	A.SaveScore(23);
	A.SaveScore(10);
	console.log(A);
	var b = A.ShowAll();
	console.log(b);

	// end 2.
});
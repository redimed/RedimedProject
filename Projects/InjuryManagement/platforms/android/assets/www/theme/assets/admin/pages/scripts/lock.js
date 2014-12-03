var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {

             $.backstretch([
		        "../../theme/assets/admin/pages/media/bg/1.png",
    		    "../../theme/assets/admin/pages/media/bg/2.png",
    		    "../../theme/assets/admin/pages/media/bg/3.png",
    		    "../../theme/assets/admin/pages/media/bg/4.png"
		        ], {
		          fade: 1000,
		          duration: 5000
		      });
        }

    };

}();

/**
 * Created by meditech on 24/09/2014.
 */

angular.module("app.loggedIn.document",[
    "app.loggedIn.document.cat2.controllers",
    "app.loggedIn.document.cat3.controllers",
    "app.loggedIn.document.FA.controllers",
    "app.loggedIn.document.MA.controllers",
    "app.loggedIn.document.IDS.controllers",
    "app.loggedIn.document.gorgonFA.controllers",
    "app.loggedIn.document.gorgonMA.controllers",
    "app.loggedIn.document.gorgonMH.controllers",
    "app.loggedIn.document.gorgonUQ.controllers",
    "app.loggedIn.document.services"
])
    .config(function($stateProvider){
        $stateProvider

            .state("loggedIn.category2",{
                url:"/category2",

                templateUrl: "modules/document/views/category2.html",
                controller: 'Cat2Controller'

            })

            .state("loggedIn.category3",{
                url:"/category3",

                templateUrl: "modules/document/views/category3.html",
                controller: 'Cat3Controller'

            })

            .state("loggedIn.FA",{
                url:"/FA",

                templateUrl: "modules/document/views/functionAssessment.html",
                controller: 'FAController'

            })

            .state("loggedIn.MA",{
                url:"/MA",

                templateUrl: "modules/document/views/medicalAssessment.html",
                controller: 'MAController'

            })

            .state("loggedIn.IDS",{
                url:"/IDS",

                templateUrl: "modules/document/views/instantScreen.html",
                controller: 'IDSController'

            })

            .state("loggedIn.gorgonFA",{
                url:"/gorgonFA",

                templateUrl: "modules/document/views/gorgonFA.html",
                controller: 'gorgonFAController'

            })

            .state("loggedIn.gorgonMA",{
                url:"/gorgonMA",

                templateUrl: "modules/document/views/gorgonMA.html",
                controller: 'gorgonMAController'

            })

            .state("loggedIn.gorgonMH",{
                url:"/gorgonMH",

                templateUrl: "modules/document/views/gorgonMH.html",
                controller: 'gorgonMHController'

            })

            .state("loggedIn.gorgonUQ",{
                url:"/gorgonUQ",

                templateUrl: "modules/document/views/gorgonUQ.html",
                controller: 'gorgonUQController'

            })

    });
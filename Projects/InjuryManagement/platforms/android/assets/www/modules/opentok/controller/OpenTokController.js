angular.module('starter.opentok.controller',[])
    .controller('OpenTokController', function($scope, OpenTokServices, localStorageService){

        //var xmlhttp=new XMLHttpRequest();
        //xmlhttp.open("GET", "https://opentokrtc.com/cordova.json", false);
        //xmlhttp.send();
        //var data = JSON.parse( xmlhttp.response );
        //$scope.lstDriver = [
        //    {
        //        "id": "1",
        //        "sessID": "1_MX40NTExMDE3Mn5-MTQxODgwNDAxMDkwMH5IdWFFTWxYaThFMFE3N0NGT3J2d0F2MlN-fg"
        //    },
        //
        //    {
        //        "id": "2",
        //        "sessID": "1_MX40NTExMDE3Mn5-MTQxODg5MjM4NzA0N35yTWNZMUJhTlJNclhRRjVXckNsZlFmZTZ-fg"
        //    },
        //
        //    {
        //        "id": "3",
        //        "sessID": "2_MX40NTExMDE3Mn5-MTQxODg5MjQwNjY3Mn4zamNPd0Z4Rno2cThjRWh1OXJpeUdWdk9-fg"
        //    }
        //]
        //var apiKey = 45110172;
        //var token = 'T1==cGFydG5lcl9pZD00NTExMDE3MiZzaWc9NmU0YThmMDhiZmI1ZTU0OTZiNmExMDAzZDM0MzJkOTYyN2EyMjk0MTpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5URXhNREUzTW41LU1UUXhPRGd3TkRBeE1Ea3dNSDVJZFdGRlRXeFlhVGhGTUZFM04wTkdUM0oyZDBGMk1sTi1mZyZjcmVhdGVfdGltZT0xNDE4ODA2NDA1Jm5vbmNlPTAuNzk3MzQ4NTE2MzE0MTE4NA==';
        //
        ////var video_1_width;
        //var video_1_height;
        //var video_2_width;
        //var video_2_height;
        //var my_video_properties;
        //
        //video_1_height="300px";
        //video_2_width="320px";
        //video_2_height="350px";
        //
        //my_video_properties = {height:video_1_height, name:'Test Conversation', style:''};
        //var publisher = TB.initPublisher(apiKey,'div_buyer_video', my_video_properties);
        //var session = TB.initSession( apiKey, $scope.lstDriver[0].sessID );
        //session.on({
        //    'streamCreated': function( event ){
        //        var div = document.createElement('div');
        //        div.setAttribute('id', 'stream' + event.stream.streamId);
        //        var publisherProperties = {width:video_2_width, height:video_2_height, name:'Test Conversation'};
        //        var streamsContainer = document.getElementById('div_brand_video');
        //        streamsContainer.appendChild(div);
        //        session.subscribe( event.stream, div.id, {subscribeToAudio: false}, publisherProperties).setAudioVolume(100);
        //    }
        //});
        $scope.phoneCall = function () {

            OpenTokServices.phoneCall(localStorageService.get('userInfo').id).then(function (){

                //session.connect(token, function() {
                //    session.publish( publisher );
                //})

            })
        }
    })
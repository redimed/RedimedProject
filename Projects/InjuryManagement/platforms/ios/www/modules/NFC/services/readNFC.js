var callbackF=function(data){};
var app = {
    /*
     Application constructor
     */
    initialize: function(func) {
        callbackF = func;
        this.bindEvents();

    },
    /*
     bind any events that are required on startup to listeners:
     */
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {

        nfc.addTagDiscoveredListener(
            app.onNonNdef
        );

        nfc.addNdefFormatableListener(
            app.onNonNdef
        );
        nfc.addNdefListener(
            app.onNfc
        );
        nfc.addMimeTypeListener(
            "text/plain",
            app.onNfc
        );
        app.display("Tap a tag to read data.");
    },
    display: function(message) {
        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);
        messageDiv.appendChild(label);
    },
    clear: function() {

        messageDiv.innerHTML = "";
    },
    onNfc: function(nfcEvent) {

        app.clear();

        app.showTag(nfcEvent.tag);
    },
    onNonNdef: function(nfcEvent) {

        app.clear();

    },
    showTag: function(tag) {


        var thisMessage = tag.ndefMessage;
        if (thisMessage !== null) {

            var type =  nfc.bytesToString(thisMessage[0].type);

            app.showMessage(thisMessage);
        }
    },
    showMessage: function(message) {

        for (var i=0; i < message.length; i++) {
            var record = message[i];
            app.showRecord(record);
        }
    },
    showRecord: function(record) {

        if (nfc.bytesToString(record.type) === "Sp") {
            var ndefMessage = ndef.decodeMessage(record.payload);
            app.showMessage(ndefMessage);
        } else {
           // app.display(nfc.bytesToString(record.payload)) ;
            callbackF(nfc.bytesToString(record.payload));

        }
    }
};     // end of app


var infoNFC ;
var writeNFC = {

    messageToWrite: [],

    // Application Constructor
    initialize: function(info) {
       if(info!= null){
           infoNFC = info;
           this.bindEvents();
           //alert("1");
       }

    },

    bindEvents: function() {
        //alert("2");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        writeNFC.clear();
        nfc.addTagDiscoveredListener(
            writeNFC.onNfc, // tag successfully scanned
            function (status) { // listener successfully initialized
                writeNFC.makeMessage();
                writeNFC.display("Tap an NFC tag to write data");
            },
            function (error) { // listener fails to initialize
                writeNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        )
    },
    onNfc: function(nfcEvent) {
        //alert("4");
        writeNFC.writeTag(writeNFC.messageToWrite);
    },
    display: function(message) {
        //alert("5");
        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);
        messageDiv.appendChild(label);
    },
    clear: function() {
        messageDiv.innerHTML = "";
    },
    makeMessage: function() {
        //alert("6");
        var info = {
            Patient_id:infoNFC.data.Patient_id,
            First_name:infoNFC.data.First_name,
            Sur_name:infoNFC.data.Sur_name,
            DOB:infoNFC.data.DOB,
            Mobile:infoNFC.data.Mobile,
            Medicare_no:infoNFC.data.Medicare_no,
            PassportorDriverslicence:"hahahahah",
            Address1:infoNFC.data.Address1
        };
        var tnf = ndef.TNF_WELL_KNOWN, // NDEF Type Name Format
            recordType = "T", // NDEF Record Type
            payload =nfc.stringToBytes(JSON.stringify(info)), // content of the record
            record, // NDEF record object
            message = []; // NDEF Message to pass to writeTag()
        record = ndef.record(tnf,recordType,[],payload);
        message.push(record);
        writeNFC.messageToWrite = message;
    },
    writeTag: function(message) {
        //alert("8");
        // write the record to the tag:
        nfc.write(
            message, // write the record itself to the tag
            function () {
                writeNFC.display("Wrote data to tag.");
            },
            // this function runs if the write command fails:
            function (reason) {
                alert("There was a problem " + reason);
            });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //alert("9");
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};


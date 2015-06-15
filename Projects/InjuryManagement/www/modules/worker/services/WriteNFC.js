var infoNFC ;
var mode = '';
var callbackF=function(data){};
var writeNFC = {

    messageToWrite: [],
    initialize: function(info,mo) {

       if(info!= null){
           mode = mo;
           if(mode=='write'){

               infoNFC = info;
               this.onDeviceReadyWrite();
           }
           if(mode=='read'){
               callbackF = info;
               this.onDeviceReadyRead();
           }
       }
        else{
           alert("info null")
       }
    },
    onDeviceReadyWrite:function(){
        document.addEventListener("deviceready", this.onWrite, false);
        //document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReadyRead: function() {
        document.addEventListener('deviceready', this.onRead, false);
        //document.addEventListener('resume', this.onResume, false);
    },
    onWrite: function() {
        writeNFC.clear();
        nfc.addTagDiscoveredListener(
            writeNFC.onNfc, // tag successfully scanned
            function (status) { // listener successfully initialized
                writeNFC.makeMessage();
                writeNFC.display("Tap an NFC tag to write data");
                alert("Tap an NFC tag to write data")
            },
            function (error) { // listener fails to initialize
                writeNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        )
    },
    onNfc: function(nfcEvent) {
            writeNFC.writeTag(writeNFC.messageToWrite);
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
    makeMessage: function() {
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
        //alert(JSON.stringify(info));
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
        nfc.write(
            message, // write the record itself to the tag
            function () {
                alert("Wrote data to tag.");
                mode = 'read';
            },
            // this function runs if the write command fails:
            function (reason) {
                alert("There was a problem " + reason);
            });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
       alert('Received Event: ' + id);
    },

    //read
    onRead: function() {
        nfc.addMimeTypeListener(
            "text/plain",
            writeNFC.onNfcRead
        );
        writeNFC.display("Tap a tag to read data.");
    },
    onNfcRead: function(nfcEvent) {
        writeNFC.clear();
        if(mode == 'read'){
            writeNFC.showTag(nfcEvent.tag);
        }
        if(mode=='write'){
            writeNFC.writeTag(writeNFC.messageToWrite);
        }
    },

    showTag: function(tag) {

        var thisMessage = tag.ndefMessage;
        if (thisMessage !== null) {

            var type =  nfc.bytesToString(thisMessage[0].type);

            writeNFC.showMessage(thisMessage);
        }
    },
    showMessage: function(message) {

        for (var i=0; i < message.length; i++) {
            var record = message[i];
            writeNFC.showRecord(record);
        }
    },
    showRecord: function(record) {

        if (nfc.bytesToString(record.type) === "Sp") {
            var ndefMessage = ndef.decodeMessage(record.payload);
            writeNFC.showMessage(ndefMessage);
        } else {
            // app.display(nfc.bytesToString(record.payload)) ;
            callbackF(nfc.bytesToString(record.payload));
        }
    }
    //,
    //onResume: function(event) {
    //
    //    alert("remove");
    //    if (mode == 'write') {
    //        infoNFC = info;
    //        this.onNfcWrite();
    //    }
    //    if (mode == 'read') {
    //        callbackF = info;
    //        this.onNfcRead();
    //    }
    //}


};


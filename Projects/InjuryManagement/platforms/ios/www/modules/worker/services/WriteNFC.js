
var writeNFC = {

    messageToWrite: [], // message to write on next NFC event

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
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
    /*
     called when a NFC tag is read:
     */
    onNfc: function(nfcEvent) {

        writeNFC.writeTag(writeNFC.messageToWrite);
    },
    display: function(message) {

        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);
        messageDiv.appendChild(label);
        // add a line break
        // add the text
    },
    clear: function() {

        messageDiv.innerHTML = "";
    },
    makeMessage: function() {

        // Put together the pieces for the NDEF message:
        var info = {
            PatientID:"giap1111",
            Firstname:"vo",
            Lastname:"Giap",
            DOB:"22-10-2014",
            Phone:"09241412414",
            MedicareNo:"hheheh",
            PassportorDriverslicence:"aaaa",
            Address:"sss"

        };
        var tnf = ndef.TNF_WELL_KNOWN, // NDEF Type Name Format
            recordType = "T", // NDEF Record Type
            payload = "{" +
                "\"PatientID\":\""+info.PatientID+"\"," +
                "\"Firstname\":\""+info.Firstname+"\"," +
                "\"Lastname\":\""+info.Lastname+"\"," +
                "\"DOB\":\""+info.DOB+"\"," +
                "\"Phone\":\""+info.Phone+"\"," +
                "\"MedicareNo\":\""+info.MedicareNo+"\"," +
                "\"PassportorDriverslicence\":\""+info.PassportorDriverslicence+"\"," +
                "\"Address\":\""+info.Address+"\"}", // content of the record
            record, // NDEF record object
            message = []; // NDEF Message to pass to writeTag()
        // create the actual NDEF record:
        record = ndef.record(tnf,recordType,[],payload);
        // put the record in the message array:s
        message.push(record);
        writeNFC.messageToWrite = message;
        writeNFC.display("made a message = " + JSON.stringify(writeNFC.messageToWrite) +"------"+ndef.RTD_TEXT);
    },
    writeTag: function(message) {

        // write the record to the tag:
        nfc.write(
            message, // write the record itself to the tag
            function () { // when complete, run this callback function:

                writeNFC.display("Wrote data to tag."); // write to the message div
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
        console.log('Received Event: ' + id);
    }
};


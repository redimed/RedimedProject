var readNFC = {
    /*
     Application constructor
     */
    initialize: function() {
        this.bindEvents();
        console.log("Starting NDEF Events app");
    },
    /*
     bind any events that are required on startup to listeners:
     */
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /*
     this runs when the device is ready for user interaction:
     */
    onDeviceReady: function() {

        nfc.addTagDiscoveredListener(
            readNFC.onNonNdef,           // tag successfully scanned
            function (status) {      // listener successfully initialized
                readNFC.display("Listening for NFC tags.");
            },
            function (error) {       // listener fails to initialize
                readNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        );

        nfc.addNdefFormatableListener(
            readNFC.onNonNdef,           // tag successfully scanned
            function (status) {      // listener successfully initialized
                readNFC.display("Listening for NDEF Formatable tags.");
            },
            function (error) {       // listener fails to initialize
                readNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        );

        nfc.addNdefListener(
            readNFC.onNfc,               // tag successfully scanned
            function (status) {      // listener successfully initialized
                readNFC.display("Listening for NDEF messages.");
            },
            function (error) {       // listener fails to initialize
                readNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        );

        nfc.addMimeTypeListener(
            "text/plain",
            readNFC.onNfc,               // tag successfully scanned
            function (status) {      // listener successfully initialized
                readNFC.display("Listening for plain text MIME Types.");
            },
            function (error) {       // listener fails to initialize
                readNFC.display("NFC reader failed to initialize "
                    + JSON.stringify(error));
            }
        );

        readNFC.display("Tap a tag to read data.");
    },

    /*
     appends @message to the message div:
     */
    display: function(message) {
        var label = document.createTextNode(message),
            lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);         // add a line break
        messageDiv.appendChild(label);             // add the text
    },
    /*
     clears the message div:
     */
    clear: function() {
        messageDiv.innerHTML = "";
    },

    /*
     Process NDEF tag data from the nfcEvent
     */
    onNfc: function(nfcEvent) {
        readNFC.clear();              // clear the message div
        // display the event type:
        readNFC.display(" Event Type: " + nfcEvent.type);
        readNFC.showTag(nfcEvent.tag);   // display the tag details
    },

    /*
     Process non-NDEF tag data from the nfcEvent
     This includes
     * Non NDEF NFC Tags
     * NDEF Formatable Tags
     * Mifare Classic Tags on Nexus 4, Samsung S4
     (because Broadcom doesn't support Mifare Classic)
     */
    onNonNdef: function(nfcEvent) {
        readNFC.clear();              // clear the message div
        // display the event type:
        readNFC.display("Event Type: " + nfcEvent.type);
        var tag = nfcEvent.tag;
        readNFC.display("Tag ID: " + nfc.bytesToHexString(tag.id));
        readNFC.display("Tech Types: ");
        for (var i = 0; i < tag.techTypes.length; i++) {
            readNFC.display("  * " + tag.techTypes[i]);
        }
    },

    /*
     writes @tag to the message div:
     */

    showTag: function(tag) {
        // display the tag properties:
        readNFC.display("Tag ID: " + nfc.bytesToHexString(tag.id));
        readNFC.display("Tag Type: " +  tag.type);
        readNFC.display("Max Size: " +  tag.maxSize + " bytes");
        readNFC.display("Is Writable: " +  tag.isWritable);
        readNFC.display("Can Make Read Only: " +  tag.canMakeReadOnly);

        // if there is an NDEF message on the tag, display it:
        var thisMessage = tag.ndefMessage;
        if (thisMessage !== null) {
            // get and display the NDEF record count:
            readNFC.display("Tag has NDEF message with " + thisMessage.length
                + " record" + (thisMessage.length === 1 ? ".":"s."));

            // switch is part of the extended example
            var type =  nfc.bytesToString(thisMessage[0].type);
            switch (type) {
                case nfc.bytesToString(ndef.RTD_TEXT):
                    readNFC.display("Looks like a text record to me.");
                    break;
                case nfc.bytesToString(ndef.RTD_URI):
                    readNFC.display("That's a URI right there");
                    break;
                case nfc.bytesToString(ndef.RTD_SMART_POSTER):
                    readNFC.display("Golly!  That's a smart poster.");
                    break;
                // add any custom types here,
                // such as MIME types or external types:
                case 'android.com:pkg':
                    readNFC.display("You've got yourself an AAR there.");
                    break;
                // JSON
                case 'text/json':
                    readNFC.display("hi welcom to JSON");
                    break;
                default:
                    readNFC.display("I don't know what " +
                        type +
                        " is, must be a custom type");
                    break;
            }
            // end of extended example

            readNFC.display("Message Contents: ");
            readNFC.showMessage(thisMessage);
        }
    },
    /*
     iterates over the records in an NDEF message to display them:
     */
    showMessage: function(message) {
        for (var i=0; i < message.length; i++) {
            // get the next record in the message array:
            var record = message[i];
            readNFC.showRecord(record);          // show it
        }
    },
    /*
     writes @record to the message div:
     */
    showRecord: function(record) {
        // display the TNF, Type, and ID:
        readNFC.display(" ");
        readNFC.display("TNF: " + record.tnf);
        readNFC.display("Type: " +  nfc.bytesToString(record.type));
        readNFC.display("ID: " + nfc.bytesToString(record.id));

        // if the payload is a Smart Poster, it's an NDEF message.
        // read it and display it (recursion is your friend here):
        if (nfc.bytesToString(record.type) === "Sp") {
            var ndefMessage = ndef.decodeMessage(record.payload);
            readNFC.showMessage(ndefMessage);

            // if the payload's not a Smart Poster, display it:
        } else {
            readNFC.display("Payload: " + nfc.bytesToString(record.payload));
        }
    }
};     // end of app

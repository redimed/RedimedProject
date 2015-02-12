package app.com.bluetoothmedical;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.TextView;

import android.os.Build;
import android.os.Bundle;
import android.os.AsyncTask;
import android.os.Parcelable;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Created by phuongnguyen on 3/02/15.
 */

public abstract class MedicalBluetoothDevice {
	private static final String LOG_TAG = "BluetoothWrapper";

	public static final int MSG_DISCOVERY_STARTED		= 0;
	public static final int MSG_DISCOVERY_FINISHED		= 1;
	public static final int MSG_DEVICE_FOUND			= 2;
	public static final int MSG_CONNECTION_ESTABLISHED	= 3;
	public static final int MSG_CONNECTION_FAILED		= 4;
	public static final int MSG_CONNECTION_STOPPED		= 5;
	public static final int MSG_CONNECTION_LOST			= 6;
	public static final int MSG_READ					= 8;
	public static final int MSG_BLUETOOTH_LOST			= 9;
	public static final int MSG_UUIDS_FOUND				= 10;
	public static final int MSG_DEVICE_BONDED			= 11;
	public static final int MSG_DEVICE_CONNECTED        = 12;

	public static final String DATA_DEVICE_ADDRESS 		= "DeviceAddress";
	public static final String DATA_DEVICE_NAME			= "DeviceName";
	public static final String DATA_BYTES				= "Bytes";
	public static final String DATA_BYTES_READ			= "BytesRead";
	public static final String DATA_UUIDS				= "Uuids";
	public static final String DATA_ERROR				= "Error";

    /**
     * Is used to send messages back to the user of this class.
     * Message types are specified above with the prefix MSG
     */


    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public static final int DATA_SEND = 0;
    public static final int DATA_RECEIVED = 1;
    public static final int SOCKET_CONNECTED = 2;

    private static int printLen = 50;

    public static boolean isPulseData = false;
    public boolean isHasData = false;
    public String value = "";
    private ConnectionThread mBluetoothConnection;
    private BluetoothSocket socket;
    private BluetoothDevice device;
    private String deviceName;
    private boolean isConnect;
    private long lastTime = 0;
    private byte[] closeConnStatement;

    public ArrayList stmts;
    private int currentStmt = 0;
    long previous = System.currentTimeMillis();

    public MedicalBluetoothDevice(){

    }

    public void setCloseConnStatement(byte[] closeConnStatement1){
        this.closeConnStatement = closeConnStatement1;
    }

    public void setDevice(BluetoothDevice device){
        this.device = device;
    }

    public void setSocket(BluetoothSocket socket){
        this.socket = socket;
    }

    public void setDeviceName(String deviceName){
        this.deviceName = deviceName;
    }

    public void setLastTime(long time){
        this.lastTime = time;
    }

    public String getStringValue(){
        return value;
    }

    public boolean isHasData() {
        return isHasData;
    }

    public void manageConnectedSocket() {

        try{
            //deviceName = "Spirometer";
            if(socket != null){
                socket.close();
            }

            //showMessage("Connecting to " + deviceName + "... " + device);

            Log.d(""," findAndConnect i = " + " " + device.getName());

            socket = device.createRfcommSocketToServiceRecord(MY_UUID);
            socket.connect();

            Log.d(""," findAndConnect i = " + " " + device.getName() + " connect successfully ! " );
            if(socket.isConnected())
            {
                //showMessage("Connection Made to " + deviceName);
                Log.d("","==================== Manage Connection");
                mBluetoothConnection = new ConnectionThread(socket, mHandler);
                mBluetoothConnection.start();

            }

        }catch (Exception e)
        {
            e.printStackTrace();
        }

    }

    public boolean isConnection(){
        try{

            if(socket.isConnected())
            {
                return true;
            }
        }catch (Exception e)
        {
            e.printStackTrace();
        }
        return false;
    }

    public void closeConn(){
        if(socket != null)
        {
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

   public void sendData(ArrayList statements){//byte[] data
       this.stmts = statements;
       isHasData = false;
        if(mBluetoothConnection.isAlive() && this.stmts.size() > 0) {
            this.currentStmt = 0;
            byte[] data = (byte[])stmts.get(currentStmt);
            // start to calculate lasting time
            previous = System.currentTimeMillis();
            mBluetoothConnection.write(data);
            ////// de bat bat translate pulse data
            data(toHex(data), "", null);
            Log.d("", "======== Send Message (lit of statement ):  " + data);
        }else{
            Log.d("", "======== Send Message: lost connection");
        }
    }

    public void sendData(byte[] stmt){
        //byte[] bpHandShake = new byte[]{(byte)0x42,(byte)0x8f,(byte)0xff,(byte)0xfe,(byte)0xfd,(byte)0xfc};
        //Log.d("",toHex(bpHandShake) + " ======== test Send Message (statement): ");
        //Log.d("","======== Send Message (statement): " + toHex(stmt) + toBinary(stmt) + stmt);
        isHasData = false;



        if(mBluetoothConnection.isAlive()) {
            // start to calculate lasting time
            previous = System.currentTimeMillis();
            mBluetoothConnection.write(stmt);
            ////// de bat bat translate pulse data
            data(toHex(stmt), "", null);
            //Log.d("", "======== Send Message: " + toHex(stmt));



        }else{
            Log.d("", "======== Send Message: lost connection");
        }
    }

    public class ConnectionThread extends Thread {

        Handler handler;
        OutputStream outStream;
        InputStream inStream ;

        ConnectionThread(BluetoothSocket socket, Handler handler1) {
            super();
            handler = handler1;
            try {
                inStream = socket.getInputStream();//btSocket.getInputStream();
                outStream = socket.getOutputStream();//btSocket.getOutputStream();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        public void run() {
            byte[] buffer = new byte[4096];
            int bytes;
            while (true) {
                try {
                    bytes = inStream.read(buffer);
                    handler.obtainMessage(DATA_RECEIVED,bytes,-1,buffer).sendToTarget();
                } catch (IOException e) { break;  }
            }
        }
        public void write(byte[] bytes) {
            try {
                outStream.write(bytes);
            } catch (IOException e) { e.printStackTrace(); }
        }
    }



    public Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case DATA_RECEIVED: {
                    byte[] readBuf = (byte[])msg.obj;
                    String hexData = toHex(readBuf);
                    String binData = toBinary(readBuf);
                    Log.d(""," receive = " + hexData + readBuf);


                    data(hexData, binData, readBuf);

                    // continue to send a next statement if having
                    currentStmt++;
                    if(stmts != null){
                        if (stmts.size() > currentStmt) {
                            byte[] data = (byte[]) stmts.get(currentStmt);
                            sendData(data);
                        }
                    }
                    break;
                }
            }
        }
    };

    public abstract void data(String hex,String bin,byte[] rawData);


    public static String toHex(byte[] bytes) {
        //BigInteger bi = new BigInteger(1, bytes);
        //return String.format("%0" + (bytes.length << 1) + "X", bi);

        String result = "";
        //Log.d(""," toHex = " + result);
        for(int i=0;i<bytes.length && i < printLen ;i++){

            result += String.format("%02X ", bytes[i]) + " ";
            //Log.d(""," toHex = " + result);
        }
        return result;

    }


    public static String toBinary(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length && i < printLen ;i++){
            String b = "00000000" + Integer.toBinaryString((bytes[i]+256)%256);
            b = b.substring(b.length() - 8);
            result += b + "  ";
        }
        return result;
    }

    public static String shortToStringBinary(short s) {

        return Integer.toBinaryString(0xFFFF & s);
    }

    public static String toBinary2(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length && i < printLen ;i++){
            result += Integer.toBinaryString((bytes[i]+256)%256) + "  ";
        }
        return result;
    }

    public static String toBinary3(byte bb) {

        String b = "00000000" + Integer.toBinaryString((bb + 256)%256);
        b = b.substring(b.length() - 8);

        return b;
    }

    public static String toDecimal(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length && i < printLen ;i++){
            int d = bytes[i] & 0xff;
            result +=  d + "  ";
        }
        return result;
    }

    public static String toHumanData(byte[] bytes) {
        /*
        To set the seventh bit to 1:

        b = (byte) (b | (1 << 6));
        To set the sixth bit to zero:

        b = (byte) (b & ~(1 << 5));
        (The bit positions are effectively 0-based, so that's why the "seventh bit" maps to 1 << 6 instead of 1 << 7.)
         */
        String result = "";
        for(int i=0;i<bytes.length && i < printLen ;i++){
            byte b;
            b = (byte) (bytes[i]  & ~(1 << 7));
            int d = b & 0xff;
            result +=  d + "  ";
        }
        return result;
    }



    public static byte hexStringToByte(String s) {
        int len = s.length();
        byte data = (byte)0x00;
        if(len == 2){
            data = (byte) ((Character.digit(s.charAt(0), 16) << 4)
                    + Character.digit(s.charAt(1), 16));
        }

        if(len == 1){
            data = (byte) ( Character.digit(s.charAt(0), 16) );
        }
        return data;
    }

    public static byte getBit(byte[] data, int pos) {
        int posByte = pos/8;
        int posBit = pos%8;
        byte valByte = data[posByte];
        byte valInt = (byte)(valByte>>(8-(posBit+1)) & 0x0001);
        return valInt;
    }

    static final int[] lookup = {0x0, 0x1, 0x3, 0x7, 0xF, 0x1F, 0x3F, 0x7F, 0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF };

    /*
     * bytes: byte array, with the bits indexed from 0 (MSB) to (bytes.length * 8 - 1) (LSB)
     * offset: index of the MSB of the bit sequence.
     * len: length of bit sequence, must from range [0,16].
     * Not checked for overflow
     */
    static int getBitSeqAsInt(byte[] bytes, int offset, int len){
        //int offset = (bytes.length * 8) - ooffset - len;
        int byteIndex = offset / 8;
        int bitIndex = offset % 8;
        int val;

        if ((bitIndex + len) > 16) {
            val = ((bytes[byteIndex] << 16 | bytes[byteIndex + 1] << 8 | bytes[byteIndex + 2]) >> (24 - bitIndex - len)) & lookup[len];
        } else if ((offset + len) > 8) {
            val = ((bytes[byteIndex] << 8 | bytes[byteIndex + 1]) >> (16 - bitIndex - len)) & lookup[len];
        } else {
            val = (bytes[byteIndex] >> (8 - offset - len)) & lookup[len];
        }

        return val;
    }

    static String getBitSequence(byte[] bytes, int ooffset, int len){

        //Log.d("","getBitSequenceAsInt = " + toBinary(bytes) );

        int offset = (bytes.length * 8) - ooffset - len;
        int byteIndex = offset / 8;
        int bitIndex = offset % 8;
        int count = 0;
        StringBuilder result = new StringBuilder();

        //Log.d("","getBitSequenceAsInt = " + toBinary(bytes) + " offset = " + offset + "  byteIndex = " + byteIndex + "  bitIndex = " + bitIndex);

        outer:
        for(int i = byteIndex; i < bytes.length; ++i) {
            for(int j = (1 << (7 - bitIndex)); j > 0; j >>= 1) {
                if(count == len) {
                    break outer;
                }
                if((bytes[i] & j) == 0) {
                    result.append('0');
                    //Log.d("","getBitSequenceAsInt = 0  i = " + i + "  j = " + j + "  bytes[byteIndex] = " + bytes[byteIndex]);
                } else {
                    result.append('1');
                    //Log.d("","getBitSequenceAsInt = 1  i = " + i + "  j = " + j + "  bytes[byteIndex] = " + bytes[byteIndex]);
                }
                ++count;
            }
            bitIndex = 0;
        }
        return  result.toString();
    }

    static int getBitSequenceAsInt(byte[] bytes, int ooffset, int len){


        int offset = (bytes.length * 8) - ooffset - len;
        int byteIndex = offset / 8;
        int bitIndex = offset % 8;
        int count = 0;
        byte result = 0x00;
        //StringBuilder result = new StringBuilder();

        outer:
        for(int i = byteIndex; i < bytes.length; ++i) {
            for(int j = (1 << (7 - bitIndex)); j > 0; j >>= 1) {
                if(count == len) {
                    break outer;
                }
                if((bytes[i] & j) == 0) {
                    result = (byte) ((result<<1) | (byte)0x00);
                    //result.append('0');
                } else {
                    result = (byte) ((result<<1) | (byte)0x01);
                }
                ++count;
            }
            bitIndex = 0;
        }
        return  result & 0xff;
    }

}

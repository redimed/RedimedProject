package app.com.bluetoothmedical;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;


import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;
import java.util.Calendar;
import java.util.Date;


public class MainActivity extends ActionBarActivity {

    private TextView txtStatus;
    private Button btnSwitch,btnList,btnScan,btnDiscover,btnDisconnect,btnSend,btnStopSend,btnScaleConfirmation,btnScaleSynchronizeTime,btnScaleReadTime,btnScaleData;
    private Button btnSpPatientInfo,btnSpResult1,btnSpResult2;
    private ListView lvDevice;
    private BluetoothAdapter btAdapter;
    private BluetoothSocket btSocket,mBluetoothSocket;
    private OutputStream outStream;
    private InputStream inStream ;
    private ArrayAdapter<String> btArrayAdapter;
    private ArrayList<BluetoothDevice> btArrayDevice;
    private ProgressDialog progDialog;
    private static final UUID MY_UUID =
            UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public static final int DATA_SEND = 0;
    public static final int DATA_RECEIVED = 1;
    public static final int SOCKET_CONNECTED = 2;

    private static final byte[] testByte = new byte[]{0x7D,(byte)0x81,(byte)0xA1,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};
    private static final byte[] testByte1 = new byte[]{0x7D,(byte)0x81,(byte)0xAF,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};
    private static final byte[] stopSend = new byte[]{0x7D,(byte)0x81,(byte)0xA2,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};

    private static final byte[] scaleConfirmationData = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x08,(byte)0x00,(byte)0x05,(byte)0x01,(byte)0x53,(byte)0x49,(byte)0x4e,(byte)0x4f,(byte)0x47};
    private static final byte[] scaleSynchronizeTime = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x0,(byte)0x00,(byte)0x05,(byte)0x05,        (byte)0x0f,(byte)0x01,(byte)0x05,(byte)0xC,(byte)0x01,(byte)0x01,(byte)0x37};
    private static final byte[] scaleSingleData = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x05,(byte)0x03,(byte)0x0C};
    private static final byte[] scaleReadTime = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x05,(byte)0x06,(byte)0x0F};

    private static final byte[] spPatientInfo = new byte[]{(byte)0x46};
    private static final byte[] spResult1 = new byte[]{(byte)0x40};
    private static final byte[] spResult2 = new byte[]{(byte)0x41};

    private ConnectionThread mBluetoothConnection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        txtStatus = (TextView) findViewById(R.id.txtStatus);
        btnSwitch = (Button)findViewById(R.id.btnSwitch);
        btnList = (Button)findViewById(R.id.btnPairList);
        btnScan = (Button)findViewById(R.id.btnScan);
        btnSend = (Button) findViewById(R.id.btnSend);
        btnStopSend = (Button) findViewById(R.id.btnStopSend);

        btnScaleConfirmation = (Button) findViewById(R.id.btnScaleConfirmation);
        btnScaleSynchronizeTime = (Button) findViewById(R.id.btnScaleSynchronizeTime);
        btnScaleReadTime =  (Button) findViewById(R.id.btnScaleReadTime);
        btnScaleData = (Button) findViewById(R.id.btnScaleData);

        btnSpPatientInfo = (Button) findViewById(R.id.btnSpPatientInfo);
        btnSpResult1 = (Button) findViewById(R.id.btnSpResult1);
        btnSpResult2 = (Button) findViewById(R.id.btnSpResult2);

        btnDisconnect = (Button) findViewById(R.id.btnDisconnect);
        btnDiscover = (Button) findViewById(R.id.btnDiscover);
        lvDevice = (ListView)findViewById(R.id.lvDevice);
        btAdapter = BluetoothAdapter.getDefaultAdapter();
        btArrayAdapter =  new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1);
        btArrayDevice = new ArrayList<BluetoothDevice>();

        IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        filter.addAction(BluetoothDevice.ACTION_FOUND);
        filter.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);

        registerReceiver(btReceiver, filter);

        if(btAdapter == null)
        {
            Log.d("Bluetooth","Bluetooth is not supported!");
            finish();
        }

        if(btAdapter.isEnabled())
        {
            btnList.setEnabled(true);
            btnScan.setEnabled(true);
            txtStatus.setText("Bluetooth Status: ON");
        }
        else
        {
            btnList.setEnabled(false);
            btnScan.setEnabled(false);
            txtStatus.setText("Bluetooth Status: OFF");
        }

        if(btSocket != null)
        {
            btnSend.setEnabled(false);
            btnDisconnect.setEnabled(false);
        }
        else{
            btnSend.setEnabled(true);
            btnDisconnect.setEnabled(true);
        }

        lvDevice.setAdapter(btArrayAdapter);

        btnDiscover.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent discoverableIntent = new
                        Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
                discoverableIntent.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 3600);
                startActivity(discoverableIntent);
            }
        });

        btnSwitch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                bluetoothSwitch(v);
            }
        });

        btnList.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getPairedDevices(v);
            }
        });

        btnScan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                scan(v);
            }
        });

        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //sendData(testByte1);
                sendData(testByte);
            }
        });

        btnStopSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(stopSend);

            }
        });

        btnScaleConfirmation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(scaleConfirmationData);
            }
        });

        btnScaleSynchronizeTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Calendar cal = Calendar.getInstance();
                Date date = cal.getTime();
                Log.d("","======== Current time: Y = " + date.getYear() + " M = " + date.getMonth()
                        + " D = " + date.getDate()  + " H = " + date.getHours()  + " M = " + date.getMinutes()  + " S = " + date.getSeconds());


                Log.d("", "======== Current time: Y = " + cal.get(Calendar.YEAR) + " M = " + cal.get(Calendar.MONTH)
                        + " D = " + cal.get(Calendar.DAY_OF_MONTH) + " H = " + cal.get(Calendar.HOUR_OF_DAY) + " M = " + cal.get(Calendar.MINUTE) + " S = " + cal.get(Calendar.SECOND));

                int yy = cal.get(Calendar.YEAR)%100;
                int mm = cal.get(Calendar.MONTH) + 1;
                int dd = cal.get(Calendar.DAY_OF_MONTH);
               int hh = cal.get(Calendar.HOUR_OF_DAY);
                int mi = cal.get(Calendar.MINUTE);
                int ss = cal.get(Calendar.SECOND);
                int sum = yy + mm + dd + hh + mi + ss + 10 + 5 + 5;


                Log.d("","======== Current time: Y = " + yy + " " + Integer.toHexString(yy) + " M = " + mm  + " " + Integer.toHexString(mm)
                        + " D = " + dd  + " " + Integer.toHexString(dd) + " H = " + hh  + " " + Integer.toHexString(hh)
                        + " M = " + mi  + " " + Integer.toHexString(mi) + " S = " + ss  + " " + Integer.toHexString(ss));

                byte[] scaleSynchronizeTime = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x0A,(byte)0x00,(byte)0x05,(byte)0x05,        (byte)yy,(byte)mm,(byte)dd,(byte)hh,(byte)mi,(byte)ss,(byte)sum};

                sendData(scaleSynchronizeTime);

            }
        });

        btnScaleReadTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(scaleReadTime);

            }
        });

        btnScaleData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(scaleSingleData);

            }
        });

        btnSpPatientInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spPatientInfo);

            }
        });

        btnSpResult1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spResult1);

            }
        });

        btnSpResult2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spResult2);

            }
        });

        btnDisconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(btSocket != null)
                    try {
                        btSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
            }
        });

        lvDevice.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                btAdapter.cancelDiscovery();
                BluetoothDevice device = btAdapter.getRemoteDevice(btArrayDevice.get(position).getAddress());
                connectToDevice(device);
            }
        });

    }

    public void sendData(byte[] data){
        if(mBluetoothConnection.isAlive()) {
            mBluetoothConnection.write(data);
            Log.d("", "======== Send Message: " + toHex(data));
        }else{
            Log.d("", "======== Send Message: lost connection");
        }
    }

    public void bluetoothSwitch(View v){
        if(btAdapter.isEnabled())
        {
            btAdapter.disable();
            btnList.setEnabled(false);
            btnScan.setEnabled(false);

            txtStatus.setText("Bluetooth Status: OFF");
        }
        else
        {

            btAdapter.enable();
            btnList.setEnabled(true);
            btnScan.setEnabled(true);

            txtStatus.setText("Bluetooth Status: ON");
        }
    }

    public void getPairedDevices(View v){
        btArrayAdapter.clear();
        btArrayDevice.clear();
        Set<BluetoothDevice> pairedDevices = btAdapter.getBondedDevices();
        if(pairedDevices.size() > 0)
        {
            for(BluetoothDevice device : pairedDevices)
            {
                btArrayAdapter.add(device.getName()+"\n"+device.getAddress());
                btArrayDevice.add(device);
                btArrayAdapter.notifyDataSetChanged();
            }
        }
    }

    public void scan(View v){
        btArrayAdapter.clear();
        btArrayDevice.clear();

        btAdapter.startDiscovery();
    }

    public void connectToDevice(BluetoothDevice device)
    {
        try {
            if(btSocket != null)
                btSocket.close();

            showMessage("Connecting to ... " + device);

            btSocket = device.createRfcommSocketToServiceRecord(MY_UUID);
            btSocket.connect();

            if(btSocket.isConnected())
            {
                showMessage("Connection Made");

                manageConnectedSocket();
            }

        } catch (Exception e) {
            try
            {
                if(btSocket != null)
                    btSocket.close();

            } catch (Exception e2) {
                showMessage("Unable to end the connection");
                e2.printStackTrace();
            }
            showMessage("Socket creation failed.."+e.getMessage());
            e.printStackTrace();
        }
    }

    private void manageConnectedSocket() {
        Log.d("","==================== Manage Connection");

        mBluetoothConnection =
                new ConnectionThread(btSocket, mHandler);
        mBluetoothConnection.start();
    }

    public class ConnectionThread extends Thread {
        ConnectionThread(BluetoothSocket socket, Handler handler) {
            super();
            mBluetoothSocket = socket;
            mHandler = handler;
            try {
                inStream = btSocket.getInputStream();
                outStream = btSocket.getOutputStream();
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
//                    String data = new String(buffer, 0, bytes);
                    mHandler.obtainMessage(
                            MainActivity.DATA_RECEIVED,bytes,-1,buffer).sendToTarget();
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
                    String readMessage = new String(readBuf, 0, msg.arg1);
                    //Log.d("","=== Received Data: "+toBinary(readBuf)+" : " + toHumanData(readBuf) + " : "+toHex(readBuf));
                    Log.d("","=== Received Data: " + toHex(readBuf));
                    //System.out.println(toBinary(readBuf)+" : "+toHex(readBuf));
                    break;
                }
                case SOCKET_CONNECTED:{
                    mBluetoothConnection = (ConnectionThread) msg.obj;
                    byte[] writeBuf = new byte[]{0x53,0x4e,0x08,0x00,0x02,0x01,0x53,0x49,0x4e,0x4f,0x44};
                    mBluetoothConnection.write(writeBuf);
                    Log.d("","=== Send Message: "+toHex(writeBuf));
                    break;
                }
            }
        }
    };

    final BroadcastReceiver btReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if(BluetoothAdapter.ACTION_DISCOVERY_STARTED.equals(action)){
                progDialog = new ProgressDialog(MainActivity.this);
                progDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                progDialog.setTitle("Please Wait...");
                progDialog.setMessage("Scanning...");
                progDialog.show();
            }
            else if(BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action))
            {
                progDialog.cancel();
                if(btArrayAdapter.getCount() == 0)
                {
                    String noDevices = "No Devices Found!";
                    btArrayAdapter.add(noDevices);
                }
            }
            else if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                if(device.getBondState() != BluetoothDevice.BOND_BONDED)
                {
                    String deviceInfo = device.getName() + "\n" + device.getAddress();
                    if(btArrayAdapter.getPosition(deviceInfo) < 0)
                    {
                        btArrayAdapter.add(device.getName() + "\n" + device.getAddress());
                        btArrayDevice.add(device);
                    }
                }
            }
            else if(BluetoothDevice.ACTION_BOND_STATE_CHANGED.equals(action)){
                final int state 		= intent.getIntExtra(BluetoothDevice.EXTRA_BOND_STATE, BluetoothDevice.ERROR);
                final int prevState	= intent.getIntExtra(BluetoothDevice.EXTRA_PREVIOUS_BOND_STATE, BluetoothDevice.ERROR);

                if (state == BluetoothDevice.BOND_BONDED && prevState == BluetoothDevice.BOND_BONDING) {
                    showMessage("Paired");
                } else if (state == BluetoothDevice.BOND_NONE && prevState == BluetoothDevice.BOND_BONDED){
                    showMessage("Unpaired");
                }
            }
        }
    };

    private void showMessage(String theMsg) {
        Toast msg = Toast.makeText(getBaseContext(),
                theMsg, (Toast.LENGTH_SHORT));
        msg.show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        btAdapter.cancelDiscovery();

        unregisterReceiver(btReceiver);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public static String toHex(byte[] bytes) {
        //BigInteger bi = new BigInteger(1, bytes);
        //return String.format("%0" + (bytes.length << 1) + "X", bi);

        String result = "";
        for(int i=0;i<bytes.length && i < 50 ;i++){
            result += String.format("%02X ", bytes[i]) + " ";
        }
        return result;

    }


    public static String toBinary(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length && i < 50 ;i++){
            result += Integer.toBinaryString((bytes[i]+256)%256) + "  ";
        }
        return result;
    }

    public static String toDecimal(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length && i < 50 ;i++){
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
        for(int i=0;i<bytes.length && i < 50 ;i++){
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
}

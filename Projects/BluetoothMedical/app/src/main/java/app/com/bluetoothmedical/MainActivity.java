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
import java.util.HashMap;


public class MainActivity extends ActionBarActivity {

    private TextView txtStatus,txtValue;

    private Button btnSwitch,btnList,btnScan,btnDiscover,btnDisconnect,btnSend,btnStopSend,btnScaleConfirmation,btnScaleSynchronizeTime,btnScaleReadTime,btnScaleData;
    private Button btnSpPatientInfo,btnSpResult1,btnSpResult2,btnSpDelete;
    private Button btnBP1,btnBP2,btnBP3,btnBP4;
    private Button btnUrConfirmation,btnUrSynchronizeTime,btnUrReadTime,btnUrSingleData,btnUrAllData,btnUrDeleteData,btnUrCloseBle,btnUrShutdown,btnUrMeasure;
    private Button btnBGTestConn,btnBGDeleteData,btnBGPowerOff,btnBGBLEOff,btnBGHistoryData,btnBGData;
    private Button btnFindAndConnect;
    private Button btnMiniECGData,btnMiniECGDeviceInfo,btnMiniECGSetTime,btnMiniECGCaseInfo,btnMiniECGDelete;
    private Button btnECGDataUpload,btnECGFinishRec,btnECGFinishRecCon,btnECGGetTime,btnECGStopUpload;


    private ListView lvDevice;
    private BluetoothAdapter btAdapter;
    private BluetoothSocket btSocket,mBluetoothSocket;
    //private OutputStream outStream;
    //private InputStream inStream ;
    private ArrayAdapter<String> btArrayAdapter;
    private ArrayList<BluetoothDevice> btArrayDevice;
    private ProgressDialog progDialog;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public static final int DATA_SEND = 0;
    public static final int DATA_RECEIVED = 1;
    public static final int SOCKET_CONNECTED = 2;

    private static final byte[] pulseGetData = new byte[]{0x7D,(byte)0x81,(byte)0xA1,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};
    private static final byte[] pulseGetData1Time = new byte[]{0x7D,(byte)0x81,(byte)0xAF,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};
    private static final byte[] pulseStopData = new byte[]{0x7D,(byte)0x81,(byte)0xA2,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80,(byte)0x80};

    private static final byte[] scaleConfirmationData = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x08,(byte)0x00,(byte)0x05,(byte)0x01,(byte)0x53,(byte)0x49,(byte)0x4e,(byte)0x4f,(byte)0x47};
    private static final byte[] scaleSynchronizeTime = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x0,(byte)0x00,(byte)0x05,(byte)0x05,        (byte)0x0f,(byte)0x01,(byte)0x05,(byte)0xC,(byte)0x01,(byte)0x01,(byte)0x37};
    private static final byte[] scaleSingleData = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x05,(byte)0x03,(byte)0x0C};
    private static final byte[] scaleReadTime = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x05,(byte)0x06,(byte)0x0F};

    private static final byte[] spPatientInfo = new byte[]{(byte)0x08};
    private static final byte[] spStart = new byte[]{(byte)0x40};
    private static final byte[] spFinish = new byte[]{(byte)0x41};
    private static final byte[] spDelete = new byte[]{(byte)0x42};

    private static final byte[] bpHandShake = new byte[]{(byte)0x42,(byte)0x8f,(byte)0xff,(byte)0xfe,(byte)0xfd,(byte)0xfc};
    private static final byte[] bp1 = new byte[]{(byte)0x43,(byte)0x42,(byte)0x01,(byte)0x08,(byte)0x03,(byte)0x00};

    private ConnectionThread mBluetoothConnection;
    private ConnectionThread bleSpirometer;
    private ConnectionThread bleBG;
    private ConnectionThread blePulse;
    private ConnectionThread bleBP;

    private BluetoothSocket bleSpirometerSocket,bleBGSocket,blePulseSocket,bleBPSocket;

    private PulseDevice pulse;
    private BpDevice bp;

    private static final UUID MY_UUIDSpirometer = UUID.fromString("00001101-0000-1000-8000-00805F9B34FC");
    private static final UUID MY_UUIDBG = UUID.fromString("00001101-0000-1000-8000-00805F9B34FD");
    private static final UUID MY_UUIDPulse = UUID.fromString("00001101-0000-1000-8000-00805F9B34FE");

    private static boolean isUrineSingleData = false;
    private static boolean isPulseData = false;
    private static boolean isBpData = false;
    private static int printLen = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d("TAG","test tes test");

        pulse = new PulseDevice();
        bp = new BpDevice();

        txtStatus = (TextView) findViewById(R.id.txtStatus);
        txtValue = (TextView) findViewById(R.id.txtValue);
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
        btnSpDelete =  (Button) findViewById(R.id.btnSpDelete);

        btnUrConfirmation =  (Button) findViewById(R.id.btnUrConfirmation);
        btnUrSynchronizeTime =  (Button) findViewById(R.id.btnUrSynchronizeTime);
        btnUrReadTime =  (Button) findViewById(R.id.btnUrReadTime);
        btnUrSingleData =  (Button) findViewById(R.id.btnUrSingleData);
        btnUrAllData =  (Button) findViewById(R.id.btnUrAllData);
        btnUrDeleteData =  (Button) findViewById(R.id.btnUrDeleteData);
        btnUrCloseBle =  (Button) findViewById(R.id.btnUrCloseBle);
        btnUrShutdown =  (Button) findViewById(R.id.btnUrShutdown);
        btnUrMeasure =  (Button) findViewById(R.id.btnUrMeasure);

        btnBP1 =  (Button) findViewById(R.id.btnBP1);
        btnBP2 =  (Button) findViewById(R.id.btnBP2);
        btnBP3 =  (Button) findViewById(R.id.btnBP3);
        btnBP4 =  (Button) findViewById(R.id.btnBP4);

        btnBGTestConn =  (Button) findViewById(R.id.btnBGTestConn);
        btnBGDeleteData =  (Button) findViewById(R.id.btnBGDeleteData);
        btnBGPowerOff =  (Button) findViewById(R.id.btnBGPowerOff);
        btnBGBLEOff =  (Button) findViewById(R.id.btnBGBLEOff);
        btnBGHistoryData =  (Button) findViewById(R.id.btnBGHistoryData);
        btnBGData =  (Button) findViewById(R.id.btnBGData);

        btnMiniECGData =  (Button) findViewById(R.id.btnMiniECGData);
        btnMiniECGDeviceInfo =  (Button) findViewById(R.id.btnMiniECGDeviceInfo);
        btnMiniECGSetTime =  (Button) findViewById(R.id.btnMiniECGSetTime);
        btnMiniECGCaseInfo =  (Button) findViewById(R.id.btnMiniECGCaseInfo);
        btnMiniECGDelete =  (Button) findViewById(R.id.btnMiniECGDelete);

        btnECGDataUpload =  (Button) findViewById(R.id.btnECGDataUpload);
        btnECGFinishRec =  (Button) findViewById(R.id.btnECGFinishRec);
        btnECGFinishRecCon =  (Button) findViewById(R.id.btnECGFinishRecCon);
        btnECGGetTime =  (Button) findViewById(R.id.btnECGGetTime);
        btnECGStopUpload =  (Button) findViewById(R.id.btnECGStopUpload);

        btnDisconnect = (Button) findViewById(R.id.btnDisconnect);
        btnDiscover = (Button) findViewById(R.id.btnDiscover);
        btnFindAndConnect =  (Button) findViewById(R.id.btnFindAndConnect);

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

        refreshValue();

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

        //pulse
        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(pulseGetData);
                //sendData(testByte);
            }
        });

        btnStopSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(pulseStopData);

            }
        });
        //pulse
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

        ////////////////Spirometer /////////////////////

        btnSpPatientInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spPatientInfo);

            }
        });

        btnSpResult1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spStart);

            }
        });

        btnSpResult2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spFinish);

            }
        });

        btnSpDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(spDelete);

            }
        });

        //////////// Blood Pressure////////////

        btnBP1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData(bpHandShake);

            }
        });

        btnBP2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] deleteBPData = new byte[]{(byte)0x43,(byte)0x42,(byte)0x03,(byte)0x04,(byte)0x02,(byte)0x00};
                sendData(deleteBPData);

            }
        });

        btnBP3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] readBPData = new byte[]{(byte)0x43,(byte)0x42,(byte)0x01,(byte)0x04,(byte)0x02,(byte)0x00};
                sendData(readBPData);

            }
        });

        btnBP4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x40,(byte)0x8f,(byte)0xff,(byte)0xfe,(byte)0xfd,(byte)0xfc};
                sendData(bp10);

            }
        });
        //////////////////////Urine////////////////////
        btnUrConfirmation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x08,(byte)0x00,(byte)0x09,(byte)0x01,(byte)0x43,(byte)0x4f,(byte)0x4e,(byte)0x54,(byte)0x46};
                sendData(bp10);

            }
        });

        btnUrSynchronizeTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x40,(byte)0x8f,(byte)0xff,(byte)0xfe,(byte)0xfd,(byte)0xfc};
                sendData(bp10);

            }
        });

        btnUrReadTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x03,(byte)0x10};
                sendData(bp10);

            }
        });

        btnUrSingleData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x04,(byte)0x11};
                sendData(bp10);

            }
        });

        btnUrAllData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x05,(byte)0x12};
                sendData(bp10);

            }
        });

        btnUrDeleteData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x06,(byte)0x13};
                sendData(bp10);

            }
        });

        btnUrCloseBle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x09,(byte)0x16};
                sendData(bp10);

            }
        });

        btnUrShutdown.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x0A,(byte)0x17};
                sendData(bp10);

            }
        });

        btnUrMeasure.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x93,(byte)0x8e,(byte)0x04,(byte)0x00,(byte)0x09,(byte)0x0B,(byte)0x18};
                sendData(bp10);

            }
        });

        ///////////////////Blood Glucose/////////////
        btnBGTestConn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x08,(byte)0x00,(byte)0x02,(byte)0x01,(byte)0x53,(byte)0x49,(byte)0x4e,(byte)0x4f,(byte)0x44};
                sendData(bp10);

            }
        });

        btnBGDeleteData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x06,(byte)0x00,(byte)0x02,(byte)0x08,(byte)0x00,(byte)0x00,(byte)0x10};
                sendData(bp10);

            }
        });

        btnBGPowerOff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x06,(byte)0x00,(byte)0x02,(byte)0x0B,(byte)0x00,(byte)0x00,(byte)0x13};
                sendData(bp10);

            }
        });

        btnBGBLEOff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x06,(byte)0x00,(byte)0x02,(byte)0x0C,(byte)0x00,(byte)0x00,(byte)0x14};
                sendData(bp10);

            }
        });

        btnBGHistoryData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x06,(byte)0x00,(byte)0x02,(byte)0x05,(byte)0x00,(byte)0x00,(byte)0x0D};
                sendData(bp10);

            }
        });

        btnBGData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x53,(byte)0x4e,(byte)0x06,(byte)0x00,(byte)0x02,(byte)0x04,(byte)0x00,(byte)0x00,(byte)0x0C};
                sendData(bp10);

            }
        });
        ////////////////////Mini ECG///////////////////
        btnMiniECGData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xA0,(byte)0x01,(byte)0x01,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
                };
                sendData(bp10);

            }
        });

        btnMiniECGDeviceInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0x81,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
                };
                sendData(bp10);

            }
        });

        btnMiniECGSetTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
                };
                sendData(bp10);

            }
        });

        btnMiniECGCaseInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
                };
                sendData(bp10);

            }
        });

        btnMiniECGDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xB0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                        (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
                };
                sendData(bp10);

            }
        });
        /////////////////////ECG///////////////////////
        btnECGDataUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xF0};
                sendData(bp10);

            }
        });

        btnECGFinishRec.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xF1};
                sendData(bp10);

            }
        });

        btnECGFinishRecCon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xF2};
                sendData(bp10);

            }
        });

        btnECGGetTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xF4};
                sendData(bp10);

            }
        });

        btnECGStopUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                byte[] bp10 = new byte[]{(byte)0xF7};
                sendData(bp10);

            }
        });
        ///////////////////////////////////////////////
        btnDisconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(btSocket != null)
                {
                    try {
                        btSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if(bleBGSocket != null)
                {
                    try {
                        bleBGSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if(blePulseSocket != null)
                {
                    try {
                        blePulseSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if(bleSpirometerSocket != null)
                {
                    try {
                        bleSpirometerSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        btnFindAndConnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findAndConnect();
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
            ////// de bat bat translate pulse data
            pulseData(toHex(data),"",null);
            Log.d("", "======== Send Message: " + toHex(data));
        }else{
            Log.d("", "======== Send Message: lost connection");
        }
    }

    public void bgSendData(byte[] data){
        if(bleBG.isAlive()) {
            bleBG.write(data);
            ////// de bat bat translate pulse data
            pulseData(toHex(data),"",null);
            Log.d("", "======== bgSendData Send Message: " + toHex(data));
        }else{
            Log.d("", "======== bgSendData Send Message: lost connection");
        }
    }

    public void sprirometerSendData(byte[] data){
        if(bleSpirometer.isAlive()) {
            bleSpirometer.write(data);
            ////// de bat bat translate pulse data
            pulseData(toHex(data),"",null);
            Log.d("", "======== sprirometerSendData Send Message: " + toHex(data));
        }else{
            Log.d("", "======== sprirometerSendData Send Message: lost connection");
        }
    }

    public void pulseSendData(byte[] data){
        if(blePulse.isAlive()) {
            blePulse.write(data);
            ////// de bat bat translate pulse data
            pulseData(toHex(data),"",null);
            Log.d("", "======== pulseSendData Send Message: " + toHex(data));
        }else{
            Log.d("", "======== pulseSendData Send Message: lost connection");
        }
    }

    public void bpSendData(byte[] data){
        if(bleBP.isAlive()) {
            bleBP.write(data);
            Log.d("", "======== bpSendData Send Message: " + toHex(data));
        }else{
            Log.d("", "======== bpSendData Send Message: lost connection");
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
                String deviceName = device.getName();
                if(deviceName.contains("PULM")){
                    deviceName = "Spirometer";
                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                }else if(deviceName.contains("WT0")){
                    deviceName = "Scale";
                }else if(deviceName.contains("BC0")){
                    deviceName = "Urine Test";
                }else if(deviceName.contains("SpO2")){
                    deviceName = "Pluse Oximeter";
                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                }else if(deviceName.contains("NIBP")){
                    deviceName = "Blood Pressure";
                }else if(deviceName.contains("PM10")){
                    deviceName = "Mini ECG";
                }else if(deviceName.contains("PM03")){
                    deviceName = "ECG";
                }
                else{
                    deviceName = "Unknown";
                }

                btArrayAdapter.add(device.getName() + " (" + deviceName + ")" + "\n" + device.getAddress());
                btArrayDevice.add(device);
                btArrayAdapter.notifyDataSetChanged();
            }
        }
    }

    public void getPairedDevices(){
        btArrayAdapter.clear();
        btArrayDevice.clear();
        Set<BluetoothDevice> pairedDevices = btAdapter.getBondedDevices();
        if(pairedDevices.size() > 0)
        {
            for(BluetoothDevice device : pairedDevices)
            {
                String deviceName = device.getName();
                boolean isAdd = true;
                if(deviceName.contains("PULM")){
                    deviceName = "Spirometer";
                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                }else if(deviceName.contains("WT0")){
                    deviceName = "Scale";
                }else if(deviceName.contains("BC0")){
                    deviceName = "Urine Test";
                }else if(deviceName.contains("SpO2")){
                    deviceName = "Pluse Oximeter";
                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                }else if(deviceName.contains("NIBP")){
                    deviceName = "Blood Pressure";
                }else if(deviceName.contains("PM03")){
                    deviceName = "ECG";
                }
                else{
                    deviceName = "Unknown";
                    isAdd = false;
                }

                if(isAdd) {
                    btArrayAdapter.add(device.getName() + " (" + deviceName + ")" + "\n" + device.getAddress());
                    btArrayDevice.add(device);
                    btArrayAdapter.notifyDataSetChanged();
                }
            }
        }
    }

    public void scan(View v){
        btArrayAdapter.clear();
        btArrayDevice.clear();
        btAdapter.startDiscovery();
    }

    public void findAndConnect(){
        boolean isFindDevice = false;
        btAdapter.cancelDiscovery();
        this.getPairedDevices();
        this.txtValue.setText(" waiting...");
        for(int i = 0; i < btArrayDevice.size() ; i++){

            BluetoothDevice device = btAdapter.getRemoteDevice(btArrayDevice.get(i).getAddress());
            try {

                String deviceName = device.getName();
                boolean isAdd = true;
                if(deviceName.contains("PULM")){
                    try{
                        deviceName = "Spirometer";
                        if(bleSpirometerSocket != null){
                            bleSpirometerSocket.close();
                        }

                        showMessage("Connecting to " + deviceName + "... " + device);
                        Log.d(""," findAndConnect i = " + i + " " + device.getName());

                        bleSpirometerSocket = device.createRfcommSocketToServiceRecord(MY_UUID);
                        bleSpirometerSocket.connect();

                        Log.d(""," findAndConnect i = " + i + " " + device.getName() + " connect successfully ! " );
                        if(bleSpirometerSocket.isConnected())
                        {
                            showMessage("Connection Made to " + deviceName);
                            bleSpirometerConn();

                        }
                    }catch (Exception e)
                    {

                    }


                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                    try{
                        if(bleBGSocket != null){
                            bleBGSocket.close();
                        }

                        showMessage("Connecting to " + deviceName + "... " + device);
                        Log.d(""," findAndConnect i = " + i + " " + device.getName());

                        bleBGSocket = device.createRfcommSocketToServiceRecord(MY_UUID);
                        bleBGSocket.connect();

                        Log.d(""," findAndConnect i = " + i + " " + device.getName() + " connect successfully ! " );

                        if(bleBGSocket.isConnected())
                        {
                            showMessage("Connection Made to " + deviceName);
                            bleBGConn();

                        }
                    }catch (Exception e)
                    {

                    }

                }else if(deviceName.contains("WT0")){
                    deviceName = "Scale";
                }else if(deviceName.contains("BC0")){
                    deviceName = "Urine Test";
                }else if(deviceName.contains("SpO2")){

                    pulse.setDeviceName("Pluse Oximeter");
                    pulse.setDevice(device);
                    pulse.manageConnectedSocket();
                    if(pulse.isConnection()) isFindDevice = true;
                    pulse.setLastTime(10000);
                    pulse.setCloseConnStatement(pulseStopData);

                    //txtValue.setText("  value = " + pulse.getStringValue());
                    //pulse.setTxtValue(txtValue);
                    pulse.sendData(pulseGetData);

                }else if(deviceName.contains("BG0")){
                    deviceName = "Blood Glucose";
                }else if(deviceName.contains("NIBP")){
                    deviceName = "Blood Pressure";
                    bp.setDeviceName("Blood Pressure");
                    bp.setDevice(device);
                    bp.manageConnectedSocket();
                    if(bp.isConnection()) isFindDevice = true;
                    bp.setLastTime(10000);
                    bp.setCloseConnStatement(pulseStopData);

                    //txtValue.setText("  value = " + pulse.getStringValue());
                    //bp.setTxtValue(txtValue);

                    ArrayList<byte[]> stmts = new ArrayList<byte[]>();
                    byte[] readBPData = new byte[]{(byte)0x43,(byte)0x42,(byte)0x01,(byte)0x04,(byte)0x02,(byte)0x00};

                    stmts.add(bpHandShake);
                    stmts.add(readBPData);
                    //Log.d("",toHex(bpHandShake));
                    //bp.sendData(bpHandShake);

                    //Log.d("",toHex(readBPData));
                    bp.sendData(stmts);

                    //break;
                }else{
                    deviceName = "Unknown";
                    isAdd = false;
                }


            } catch (Exception e) {
                try
                {
                    if(btSocket != null)
                        btSocket.close();

                } catch (Exception e2) {
                    showMessage("Unable to end the connection");
                    //e2.printStackTrace();
                }
                showMessage("Socket creation failed.."+e.getMessage());
                //e.printStackTrace();
            }

            if( isFindDevice)
            {
                break;
            }
        }

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
        mBluetoothConnection = new ConnectionThread(btSocket, mHandler);
        mBluetoothConnection.start();

    }

    private void bleSpirometerConn() {

        Log.d("","====================bleSpirometerConn Manage Connection");
        bleSpirometer = new ConnectionThread(bleSpirometerSocket, mHandler);
        bleSpirometer.start();

    }

    private void blePulseConn() {

        Log.d("","====================blePulseConn Manage Connection");
        blePulse = new ConnectionThread(blePulseSocket, mHandler);
        blePulse.start();

    }

    private void bleBGConn() {

        Log.d("","====================bleBGConn Manage Connection");
        bleBG = new ConnectionThread(bleBGSocket, mHandler);
        bleBG.start();

    }

    private void bleBPConn() {

        Log.d("","====================bleBPConn Manage Connection");
        bleBP = new ConnectionThread(bleBPSocket, mHandler);
        bleBP.start();

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
                    handler.obtainMessage(
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

    /// display data
    public Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case DATA_RECEIVED: {
                    byte[] readBuf = ((byte[])msg.obj).clone();
                    String hexData = toHex(readBuf);
                    String binData = toBinary(readBuf);
                    //String humanData = toHumanData(readBuf);
                    Log.d("","=== Received Data: "+ toHex(readBuf));
                    Log.d("","=== Received Data: "+toBinary(readBuf) );
                    //Log.d("",spirometerData(hexData, binData, readBuf));
                    //Log.d("","=== Received Data: " + toHex(readBuf));
                    //Log.d("","=== Received Data: "  + "  :  " + binData + "  :  " );
                    //ecgData(readBuf);
                    //System.out.println(toBinary(readBuf)+" : "+toHex(readBuf));
                    //urineSingleData(hexData, binData, readBuf);
                    //pulseData(hexData, binData, readBuf);
                    //bpData(hexData, binData, readBuf);
                    //showMessage(bpData(hexData, binData, readBuf),1000);
                    //showMessage(spirometerData(hexData, binData, readBuf),1000);
                    //showMessage(bgData(hexData, binData, readBuf),1000);
                    //showMessage(scaleData(hexData, binData, readBuf),1000);
                    miniECGData(hexData, binData, readBuf);
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


    private void refreshValue() {
        new Thread(new Runnable() {
            int seconds = 0;
            public void run() {
                while(true)
                    try {
                        Thread.sleep(1000);
                        seconds++;
                        Message msg = Message.obtain();
                        msg.obj = bp.getStringValue() + pulse.getStringValue();
                        countHandler.sendMessage(msg);
                    }
                    catch(Exception e) {
                        Log.w("counter Thread Exception ", e+"");
                    }
            }
        }).start();
    }

    final Handler countHandler = new Handler() {

        public void handleMessage(Message msg) {
            txtValue.setText((String) msg.obj);
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

                //if(device.getBondState() != BluetoothDevice.BOND_BONDED)
                //{
                    String deviceInfo = device.getName() + "\n" + device.getAddress();
                    if(btArrayAdapter.getPosition(deviceInfo) < 0)
                    {
                        btArrayAdapter.add(device.getName() + "\n" + device.getAddress());
                        btArrayDevice.add(device);
                    }
                //}
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

    private void showMessage(String theMsg,int length) {
        Toast msg = Toast.makeText(getBaseContext(),
                theMsg, length);
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
        for(int i=0;i<bytes.length && i < printLen ;i++){
            result += String.format("%02X ", bytes[i]) + " ";
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

    private static byte getBit(byte[] data, int pos) {
        int posByte = pos/8;
        int posBit = pos%8;
        byte valByte = data[posByte];
        byte valInt = (byte)(valByte>>(8-(posBit+1)) & 0x0001);
        return valInt;
    }

    private static byte getBitRever(byte[] data, int posIn) {
        int pos = 7-posIn;
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
    //////////////Urine data////////////
    public static void urineSingleData(String hex,String bin,byte[] rawData) {

        if(hex.contains("93  8E  12  00  09  04")){
            Log.d("", "=== Urine: Header Single Data.");
            isUrineSingleData = true;
            return;
        }
        if(isUrineSingleData){
            HashMap<Integer,String> UROs = new HashMap<Integer,String>();
            HashMap<Integer,String> BLDs = new HashMap<Integer,String>();
            HashMap<Integer,String> BILs = new HashMap<Integer,String>();
            HashMap<Integer,String> KETs = new HashMap<Integer,String>();
            HashMap<Integer,String> GLUs = new HashMap<Integer,String>();
            HashMap<Integer,String> PROs = new HashMap<Integer,String>();
            HashMap<Integer,String> PHs = new HashMap<Integer,String>();
            HashMap<Integer,String> NITs = new HashMap<Integer,String>();
            HashMap<Integer,String> LEUs = new HashMap<Integer,String>();
            HashMap<Integer,String> SGs = new HashMap<Integer,String>();
            HashMap<Integer,String> VCs = new HashMap<Integer,String>();

            UROs.put(0,"{'Special unit':'Norm','International unit':'3.3umol/l','Traditional unit':'0.2mg/dl'}");
            UROs.put(1,"{'Special unit':'1+','International unit':'33umol/l','Traditional unit':'2mg/dl'}");
            UROs.put(2,"{'Special unit':'2+','International unit':'66umol/l','Traditional unit':'4mg/dl'}");
            UROs.put(3,"{'Special unit':'>=3+','International unit':'131umol/l','Traditional unit':'8mg/dl'}");

            BLDs.put(0,"{'Special unit':'-','International unit':'-','Traditional unit':'-'}");
            BLDs.put(1,"{'Special unit':'+-','International unit':'10ul','Traditional unit':'0.03mg/dl'}");
            BLDs.put(2,"{'Special unit':'1+','International unit':'25ul','Traditional unit':'0.08mg/dl'}");
            BLDs.put(3,"{'Special unit':'2+','International unit':'50ul','Traditional unit':'0.15mg/dl'}");
            BLDs.put(4,"{'Special unit':'3+','International unit':'250ul','Traditional unit':'0.75mg/dl'}");

            BILs.put(0,"{'Special unit':'-','International unit':'0umol/l','Traditional unit':'0mg/dl'}");
            BILs.put(1,"{'Special unit':'1+','International unit':'17umol/l','Traditional unit':'1mg/dl'}");
            BILs.put(2,"{'Special unit':'2+','International unit':'50umol/l','Traditional unit':'3mg/dl'}");
            BILs.put(3,"{'Special unit':'3+','International unit':'100umol/l','Traditional unit':'6mg/dl'}");

            KETs.put(0,"{'Special unit':'-','International unit':'0umol/l','Traditional unit':'0mg/dl'}");
            KETs.put(1,"{'Special unit':'1+','International unit':'1.5umol/l','Traditional unit':'15mg/dl'}");
            KETs.put(2,"{'Special unit':'2+','International unit':'4.0umol/l','Traditional unit':'40mg/dl'}");
            KETs.put(3,"{'Special unit':'3+','International unit':'8.0umol/l','Traditional unit':'80mg/dl'}");

            GLUs.put(0,"{'Special unit':'-','International unit':'0umol/l','Traditional unit':'0mg/dl'}");
            GLUs.put(1,"{'Special unit':'+-','International unit':'2.8umol/l','Traditional unit':'50mg/dl'}");
            GLUs.put(2,"{'Special unit':'1+','International unit':'5.5umol/l','Traditional unit':'100mg/dl'}");
            GLUs.put(3,"{'Special unit':'2+','International unit':'14umol/l','Traditional unit':'250mg/dl'}");
            GLUs.put(4,"{'Special unit':'3+','International unit':'28umol/l','Traditional unit':'500mg/dl'}");
            GLUs.put(5,"{'Special unit':'4+','International unit':'55umol/l','Traditional unit':'1000mg/dl'}");

            PROs.put(0,"{'Special unit':'-','International unit':'0g/l','Traditional unit':'0mg/dl'}");
            PROs.put(1,"{'Special unit':'+-','International unit':'0.15g/l','Traditional unit':'15mg/dl'}");
            PROs.put(2,"{'Special unit':'1+','International unit':'0.3g/l','Traditional unit':'30mg/dl'}");
            PROs.put(3,"{'Special unit':'2+','International unit':'1g/l','Traditional unit':'100mg/dl'}");
            PROs.put(4,"{'Special unit':'3+','International unit':'3g/l','Traditional unit':'300mg/dl'}");

            PHs.put(0,"{'5'}");
            PHs.put(1,"{'6'}");
            PHs.put(2,"{'7'}");
            PHs.put(3,"{'8'}");
            PHs.put(4,"{'9'}");


            NITs.put(0,"{'Special unit':'-','International unit':'-','Traditional unit':'-'}");
            NITs.put(1,"{'Special unit':'1+','International unit':'18umol/l','Traditional unit':'0.12mg/dl'}");

            LEUs.put(0,"{'Special unit':'-','Traditional unit':'-'}");
            LEUs.put(1,"{'Special unit':'+-','Traditional unit':'15/ul'}");
            LEUs.put(2,"{'Special unit':'1+','Traditional unit':'70/ul'}");
            LEUs.put(3,"{'Special unit':'2+','Traditional unit':'125/ul'}");
            LEUs.put(4,"{'Special unit':'3+','Traditional unit':'500/ul'}");

            SGs.put(0,"{'<=1.005'}");
            SGs.put(1,"{'1.010'}");
            SGs.put(2,"{'1.015'}");
            SGs.put(3,"{'1.020'}");
            SGs.put(4,"{'1.025'}");
            SGs.put(5,"{'>=1.030'}");

            VCs.put(0,"{'Special unit':'-','International unit':'0mmol/l','Traditional unit':'0mg/dl'}");
            VCs.put(1,"{'Special unit':'+-','International unit':'0.6mmol/l','Traditional unit':'10mg/dl'}");
            VCs.put(2,"{'Special unit':'1+','International unit':'1.4mmol/l','Traditional unit':'25mg/dl'}");
            VCs.put(3,"{'Special unit':'2+','International unit':'2.8mmol/l','Traditional unit':'50mg/dl'}");
            VCs.put(4,"{'Special unit':'3+','International unit':'5.6mmol/l','Traditional unit':'100mg/dl'}");

            isUrineSingleData = false;
            Log.d("","=== Urine: Raw Single Data. len = " + rawData.length + " : " + hex + " : " + bin + " : " + rawData );
            Log.d("","Data " + toBinary3(rawData[13]) + " " + toBinary3(rawData[12]) + " " + toBinary3(rawData[11]) + " " + toBinary3(rawData[10]) + " " + toBinary3(rawData[9]) );

            Log.d("",
                    "\n\nURO = " + getBitSequence( new byte[]{rawData[9],rawData[8]},11,3)

                    + "\nBLD = " + getBitSequence( new byte[]{rawData[11],rawData[10]},0,3)
                    + "\nBIL = " + getBitSequence( new byte[]{rawData[11],rawData[10]},3,3)
                    + "\nKET = " + getBitSequence( new byte[]{rawData[11],rawData[10]},6,3)
                    + "\nGLU = " + getBitSequence( new byte[]{rawData[11],rawData[10]},9,3)
                    + "\nPRO = " + getBitSequence( new byte[]{rawData[11],rawData[10]},12,3)

                    + "\nPH = " + getBitSequence( new byte[]{rawData[13],rawData[12]},0,3)
                    + "\nNIT = " + getBitSequence( new byte[]{rawData[13],rawData[12]},3,3)
                    + "\nLEU = " + getBitSequence( new byte[]{rawData[13],rawData[12]},6,3)
                    + "\nSG = " + getBitSequence( new byte[]{rawData[13],rawData[12]},9,3)
                    + "\nVC = " + getBitSequence( new byte[]{rawData[13],rawData[12]},12,3)
            );

            /*
            Log.d("",
                    "\nURO = " + getBitSequenceAsInt( new byte[]{rawData[9],rawData[8]},11,3)

                            + "\nBLD = " + getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},0,3)
                            + "\nBIL = " + getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},3,3)
                            + "\nKET = " + getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},6,3)
                            + "\nGLU = " + getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},9,3)
                            + "\nPRO = " + getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},12,3)

                            + "\nPH = " + getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},0,3)
                            + "\nNIT = " + getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},3,3)
                            + "\nLEU = " + getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},6,3)
                            + "\nSG = " + getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},9,3)
                            + "\nVC = " + getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},12,3)

            );
            */

            Log.d("",
                    "\n\nURO = " + UROs.get(getBitSequenceAsInt( new byte[]{rawData[9],rawData[8]},11,3))
                    + "\nBLD = " + BLDs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},0,3))
                    + "\nBIL = " + BILs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},3,3))
                    + "\nKET = " + KETs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},6,3))
                    + "\nGLU = " + GLUs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},9,3))
                    + "\nPRO = " + PROs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},12,3))

                    + "\nPH = " + PHs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},0,3))
                    + "\nNIT = " + NITs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},3,3))
                    + "\nLEU = " + LEUs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},6,3))
                    + "\nSG = " + SGs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},9,3))
                    + "\nVC = " + VCs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},12,3))
            );

        }
    }
    //////////////Urine data////////////
    //////////////Pulse data////////////
    public static void pulseData(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        if (hex.contains("7D  81  A1")) {//7D  81  A1
            Log.d("", "=== Pulse: Header Single Data.");
            isPulseData = true;
            return;
        }
        if(isPulseData && !hex.substring(0,3).contains("01")){
            Log.d("", "=== Pulse: End Single Data.");
            isPulseData = false;
            return;
        }
        if(isPulseData && hex.substring(0,3).contains("01")){
            byte highByte = rawData[1];

            byte highByteOfPulseRate = getBit(new byte[]{highByte},4);
            highByteOfPulseRate = (byte)((highByteOfPulseRate<<7)|0x7f);

            byte highByteOfSpO2 = getBit(new byte[]{highByte},5);
            highByteOfSpO2 = (byte)((highByteOfSpO2<<7)|0x7f);

            byte pulseWaveForm = (byte)(rawData[3]&0x7f);
            byte barGraph = (byte)(rawData[4]&0x0f);
            byte pulseRate = (byte)(rawData[5]&highByteOfPulseRate);
            byte spO2 = (byte)(rawData[6]&highByteOfSpO2);

            int pulseWaveFormInInt = pulseWaveForm&0xff;
            int barGraphInInt = barGraph&0xff;
            int pulseRateInInt = pulseRate&0xff;
            int spO2InInt = spO2&0xff;

            Log.d("","       pulseRate = " + pulseRateInInt +
                     "  spO2InInt = " + spO2InInt
                     //"  pulseWaveFormInInt = " + pulseWaveFormInInt +
                     //"  barGraphInInt = " + barGraphInInt +

                     //"  highByte = " + toBinary(new byte[]{highByte}) +
                     //"  highByteOfPulseRate = " + toBinary(new byte[]{highByteOfPulseRate}) +
                     //"  highByteOfSpO2 = " + toBinary(new byte[]{highByteOfSpO2}) +
                     //"  pulseRate = " + toBinary(new byte[]{pulseRate}) +
                     //"  spO2 = " + toBinary(new byte[]{spO2})
                     );
        }
    }
    //////////////Pulse data////////////
    //////////////BP data////////////
    public static String bpData(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        if (hex.contains("4A  43  01  00  46  42")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data.");
            isBpData = true;
            isBpData = false;
            byte highByte = rawData[18];

            byte highByteOfSys = getBit(new byte[]{highByte},6);
            highByteOfSys = (byte)((highByteOfSys<<7)|0x7f);

            byte highByteOfDia = getBit(new byte[]{highByte},5);
            highByteOfDia = (byte)((highByteOfDia<<7)|0x7f);

            byte highByteOfBmp = getBit(new byte[]{highByte},4);
            highByteOfBmp = (byte)((highByteOfBmp<<7)|0x7f);

            byte highByteOfMmHg = getBit(new byte[]{highByte},3);
            highByteOfMmHg = (byte)((highByteOfMmHg<<7)|0x7f);


            byte sys = (byte)(rawData[20]&highByteOfSys);
            byte dia = (byte)(rawData[21]&highByteOfDia);
            byte bpm = (byte)(rawData[22]&highByteOfBmp);
            byte mmHg = (byte)(rawData[23]&highByteOfMmHg);

            String highByteInBin = toBinary(new byte[]{highByte});
            int sysInInt = sys&0xff;
            int diaInInt = dia&0xff;
            int bpmInInt = bpm&0xff;
            int mmHgInInt = mmHg&0xff;

            Log.d("",   " highByteInBin = " + highByteInBin
                        + "  .\nsysInInt = "  + sysInInt
                        + "  .\ndiaInInt = "  + diaInInt
                        + "  .\nbpmInInt = "  + bpmInInt
                        + "  .\nmmHgInInt = "  + mmHgInInt
            );


            return "  .\nsysInInt = "  + sysInInt
                    + "  .\ndiaInInt = "  + diaInInt
                    + "  .\nbpmInInt = "  + bpmInInt
                    + "  .\nmmHgInInt = "  + mmHgInInt;

        }
        return "";
    }
    //////////////Spirometer data////////////
    //////////////Blood Glucose data////////////
    public static String bgData(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        if (hex.contains("53  4E") &&  hex.contains("00  02  04")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data.");

            byte yy = rawData[6];
            byte mm = rawData[7];
            byte dd = rawData[8];
            byte mi = rawData[9];
            byte ss = rawData[10];
            byte bgHigh = rawData[11];
            byte bgLow = rawData[12];


            int yyInInt = yy  & 0xff;
            int mmInInt = mm  & 0xff;
            int ddInInt = dd  & 0xff;
            int miInInt = mi  & 0xff;
            int ssInInt = ss  & 0xff;
            int bgHighInInt = bgHigh  & 0xff;
            int bgLowInInt = bgLow  & 0xff;



            Log.d("",   " yyInInt = " + yyInInt
                            + "  .\nmmInInt = "  + mmInInt
                            + "  .\nddInInt = "  + ddInInt
                            + "  .\nmiInInt = "  + miInInt
                            + "  .\nssInInt = "  + ssInInt
                            + "  .\nbgHighInInt = "  + bgHighInInt
                            + "  .\nbgLowInInt = "  + bgLowInInt
            );


            return   " yyInInt = " + yyInInt
                    + "  .\nmmInInt = "  + mmInInt
                    + "  .\nddInInt = "  + ddInInt
                    + "  .\nmiInInt = "  + miInInt
                    + "  .\nssInInt = "  + ssInInt
                    + "  .\nbgHighInInt = "  + bgHighInInt
                    + "  .\nbgLowInInt = "  + bgLowInInt;

        }
        if (hex.contains("53  4E") && (hex.contains("00  02  05") )) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data (History).");

            byte yy = rawData[9];
            byte mm = rawData[10];
            byte dd = rawData[11];
            byte mi = rawData[12];
            byte ss = rawData[13];
            byte bgHigh = rawData[14];
            byte bgLow = rawData[15];


            int yyInInt = yy  & 0xff;
            int mmInInt = mm  & 0xff;
            int ddInInt = dd  & 0xff;
            int miInInt = mi  & 0xff;
            int ssInInt = ss  & 0xff;
            int bgHighInInt = bgHigh  & 0xff;
            int bgLowInInt = bgLow  & 0xff;



            Log.d("",   " yyInInt = " + yyInInt
                            + "  .\nmmInInt = "  + mmInInt
                            + "  .\nddInInt = "  + ddInInt
                            + "  .\nmiInInt = "  + miInInt
                            + "  .\nssInInt = "  + ssInInt
                            + "  .\nbgHighInInt = "  + bgHighInInt
                            + "  .\nbgLowInInt = "  + bgLowInInt
            );


            return   " yyInInt = " + yyInInt
                    + "  .\nmmInInt = "  + mmInInt
                    + "  .\nddInInt = "  + ddInInt
                    + "  .\nmiInInt = "  + miInInt
                    + "  .\nssInInt = "  + ssInInt
                    + "  .\nbgHighInInt = "  + bgHighInInt
                    + "  .\nbgLowInInt = "  + bgLowInInt;

        }
        return "";
    }
    //////////////BP data////////////
    //////////////Spirometer data////////////
    public static String spirometerData(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        if (hex.contains("01") && hex.contains("02") && hex.contains("03") && hex.contains("04") && hex.contains("05")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data." + hex);

            byte highByte = rawData[19];

            byte highByteOfHighFVC = getBit(new byte[]{highByte},2);
            highByteOfHighFVC = (byte)((highByteOfHighFVC<<7)|0x7f);

            byte highByteOfLowFVC = getBit(new byte[]{highByte},1);
            highByteOfLowFVC = (byte)((highByteOfLowFVC<<7)|0x7f);

            byte highByteOfHighFEV1 = getBit(new byte[]{highByte},4);
            highByteOfHighFEV1 = (byte)((highByteOfHighFEV1<<7)|0x7f);

            byte highByteOfLowFEV1 = getBit(new byte[]{highByte},3);
            highByteOfLowFEV1 = (byte)((highByteOfLowFEV1<<7)|0x7f);

            byte highByteOfHighPEF = getBit(new byte[]{highByte},6);
            highByteOfHighPEF = (byte)((highByteOfHighPEF<<7)|0x7f);

            byte highByteOfLowPEF = getBit(new byte[]{highByte},5);
            highByteOfLowPEF = (byte)((highByteOfLowPEF<<7)|0x7f);

            byte highFVC = (byte)(rawData[21]&highByteOfHighFVC);
            byte lowFVC = (byte)(rawData[20]&highByteOfLowFVC);
            short FVC = (short)(highFVC<<8|(lowFVC& 0xFF));

            byte highFEV1 = (byte)(rawData[23]&highByteOfHighFEV1);
            byte lowFEV1 = (byte)(rawData[22]&highByteOfLowFEV1);
            short FEV1 = (short)(highFEV1<<8|(lowFEV1 & 0xFF));
            //Log.d(""," FEV1 = " + shortToStringBinary(FEV1));
            //FEV1 = (short)(FEV1<<8);
            //Log.d(""," FEV1 = " + shortToStringBinary(FEV1));
            //FEV1 = (short)(FEV1<<8|(lowFEV1 & 0xFF));
            //Log.d(""," FEV1 = " + shortToStringBinary(FEV1));

            byte highPEF = (byte)(rawData[25]&highByteOfHighPEF);
            byte lowPEF = (byte)(rawData[24]&highByteOfLowPEF);
            short PEF = (short)(highPEF<<8|(lowPEF & 0xFF));


            String highByteInBin = toBinary(new byte[]{highByte});
            String highFVCInBin = toBinary(new byte[]{highFVC});
            String lowFVCInBin = toBinary(new byte[]{lowFVC});
            String highFEV1InBin = toBinary(new byte[]{highFEV1});
            String lowFEV1InBin = toBinary(new byte[]{lowFEV1});
            String highPEFInBin = toBinary(new byte[]{highPEF});
            String lowPEFInBin = toBinary(new byte[]{lowPEF});

            int FVCInInt = FVC  & 0xffff;;
            int FEV1InInt = FEV1  & 0xffff;;
            int PEFInInt = PEF  & 0xffff;;


            Log.d("",   " highByteInBin = " + highByteInBin

                            + "  .\nFVC = "  + shortToStringBinary(FVC)
                            + "  .\nFEV1 = "  + shortToStringBinary(FEV1)
                            + "  .\nPEF = "  + shortToStringBinary(PEF)
                            + "  .\nhighFVCInBin = "  + highFVCInBin
                            + "  .\nlowFVCInBin = "  + lowFVCInBin
                            + "  .\nhighFEV1InBin = "  + highFEV1InBin
                            + "  .\nlowFEV1InBin = "  + lowFEV1InBin
                            + "  .\nhighPEFInBin = "  + highPEFInBin
                            + "  .\nlowPEFInBin = "  + lowPEFInBin

                            + "  .\nFVCInInt = "  + FVCInInt
                            + "  .\nFEV1InInt = "  + FEV1InInt
                            + "  .\nPEFInInt = "  + PEFInInt
                            + " \n " + toBinary(rawData)
                            + " \n "
            );

            Log.d("",         toHex(rawData));

            return    " highByteInBin = " + highByteInBin
                    + "  .\nFVCInInt = "  + FVCInInt
                    + "  .\nFEV1InInt = "  + FEV1InInt
                    + "  .\nPEFInInt = "  + PEFInInt;

        }
        return "";
    }
    //////////////Blood Glucose data////////////
    //////////////Scale data////////////
    public static String scaleData(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);

        if (hex.contains("93  8E") &&  hex.contains("00  05  03")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data.");

            byte yy = rawData[6];
            byte mm = rawData[7];
            byte dd = rawData[8];
            byte mi = rawData[9];
            byte dataHigh = rawData[12];
            byte dataLow = rawData[13];


            short data = (short)(dataHigh<<8|(dataLow & 0xFF));


            int DataInInt = data  & 0xffff;;

            int yyInInt = yy  & 0xff;
            int mmInInt = mm  & 0xff;
            int ddInInt = dd  & 0xff;
            int miInInt = mi  & 0xff;

            Log.d("",   " yyInInt = " + yyInInt
                            + "  .\nmmInInt = "  + mmInInt
                            + "  .\nddInInt = "  + ddInInt
                            + "  .\nmiInInt = "  + miInInt
                            + "  .\ndata = "  + data
            );


            return   " yyInInt = " + yyInInt
                    + "  .\nmmInInt = "  + mmInInt
                    + "  .\nddInInt = "  + ddInInt
                    + "  .\nmiInInt = "  + miInInt;

        }

        return "";
    }
    //////////////Scale data////////////
    //////////////Mini ECG data////////////
    public static int getValueOfMiniECGData(byte high,byte low,byte highestBitOfHigh,byte highestBitOfLow,int highPosition,int lowPosition){
        byte highestBitOfHighByte = getBitRever(new byte[]{highestBitOfHigh},highPosition);
        highestBitOfHighByte = (byte)((highestBitOfHighByte<<7)|0x7f);

        byte highestBitOfLowByte = getBitRever(new byte[]{highestBitOfLow},lowPosition);
        highestBitOfLowByte = (byte)((highestBitOfLowByte<<7)|0x7f);

        byte highData = (byte)(high&highestBitOfHighByte);
        byte lowData = (byte)(low&highestBitOfLowByte);
        short Data = (short)(highData<<8|(lowData& 0xFF));

        return  (int)(Data & 0xffff);
    }
    public String miniECGData(String hex,String bin,byte[] rawData) {
        Log.d("","  miniECGData = " + hex);
        if(hex.contains("DF") && hex.contains("00  00  00  00  00  00  00  00  00  00  00  00")){
            byte[] bp10 = new byte[]{(byte)0xA0,(byte)0x01,(byte)0x01,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00,
                    (byte)0x00,(byte)0x00,(byte)0x00,(byte)0x00
            };
            this.sendData(bp10);
        }
        else if (hex.contains("D0")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data." + hex);

            byte highByte3 = rawData[3];
            byte highByte4 = rawData[4];
            byte highByte5 = rawData[5];
            byte highByte6 = rawData[6];
            byte highByte7 = rawData[7];
            byte highByte8 = rawData[8];
            byte highByte9 = rawData[9];
            byte highByte10 = rawData[10];

            int data0 = getValueOfMiniECGData(rawData[11],rawData[12],highByte3,highByte3,0,1);
            int data1 = getValueOfMiniECGData(rawData[13],rawData[14],highByte3,highByte3,2,3);
            int data2 = getValueOfMiniECGData(rawData[15],rawData[16],highByte3,highByte3,4,5);

            int data3 = getValueOfMiniECGData(rawData[17],rawData[18],highByte3,highByte4,6,0);
            int data4 = getValueOfMiniECGData(rawData[19],rawData[20],highByte4,highByte4,1,2);
            int data5 = getValueOfMiniECGData(rawData[21],rawData[22],highByte4,highByte4,3,4);

            int data6 = getValueOfMiniECGData(rawData[23],rawData[24],highByte4,highByte4,5,6);
            int data7 = getValueOfMiniECGData(rawData[25],rawData[26],highByte5,highByte5,0,1);
            int data8 = getValueOfMiniECGData(rawData[27],rawData[28],highByte5,highByte5,2,3);

            int data9 = getValueOfMiniECGData(rawData[29],rawData[30],highByte5,highByte5,4,5);
            int data10 = getValueOfMiniECGData(rawData[31],rawData[32],highByte5,highByte6,6,0);
            int data11 = getValueOfMiniECGData(rawData[33],rawData[34],highByte6,highByte6,1,2);

            int data12 = getValueOfMiniECGData(rawData[35],rawData[36],highByte6,highByte6,3,4);
            int data13 = getValueOfMiniECGData(rawData[37],rawData[38],highByte6,highByte6,5,6);
            int data14 = getValueOfMiniECGData(rawData[39],rawData[40],highByte7,highByte7,0,1);

            int data15 = getValueOfMiniECGData(rawData[41],rawData[42],highByte7,highByte7,2,3);
            int data16 = getValueOfMiniECGData(rawData[43],rawData[44],highByte7,highByte7,4,5);
            int data17 = getValueOfMiniECGData(rawData[45],rawData[46],highByte7,highByte8,6,0);

            int data18 = getValueOfMiniECGData(rawData[47],rawData[48],highByte8,highByte8,1,2);
            int data19 = getValueOfMiniECGData(rawData[49],rawData[50],highByte8,highByte8,3,4);
            int data20 = getValueOfMiniECGData(rawData[51],rawData[52],highByte8,highByte8,5,6);

            int data21 = getValueOfMiniECGData(rawData[53],rawData[54],highByte9,highByte9,0,1);
            int data22 = getValueOfMiniECGData(rawData[55],rawData[56],highByte9,highByte9,2,3);
            int data23 = getValueOfMiniECGData(rawData[57],rawData[58],highByte9,highByte9,4,5);

            int data24 = getValueOfMiniECGData(rawData[59],rawData[60],highByte9,highByte10,6,0);


            Log.d("",   " DATA0 = " + data0

                            + "  \nDATA1 = "  + data1
                            + "  \nDATA2 = "  + data2
                            + "  \nDATA3 = "  + data3
                            + "  \nDATA4 = "  + data4
                            + "  \nDATA5 = "  + data5
                            + "  \nDATA6 = "  + data6
                            + "  \nDATA7 = "  + data7
                            + "  \nDATA8 = "  + data8
                            + "  \nDATA9 = "  + data9
                            + "  \nDATA10 = "  + data10
                            + "  \nDATA11 = "  + data11
                            + "  \nDATA12 = "  + data12
                            + "  \nDATA13 = "  + data13
                            + "  \nDATA14 = "  + data14
                            + "  \nDATA15 = "  + data15
                            + "  \nDATA16 = "  + data16
                            + "  \nDATA17 = "  + data17
                            + "  \nDATA18 = "  + data18
                            + "  \nDATA19 = "  + data19
                            + "  \nDATA20 = "  + data20
                            + "  \nDATA21 = "  + data21
                            + "  \nDATA22 = "  + data22
                            + "  \nDATA23 = "  + data23
                            + "  \nDATA24 = "  + data24
            );



        }
        return "";
    }
    //////////////Mini ECG data////////////
    //////////////ECG data////////////
    public static String ecgData(byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        byte[] data = new byte[9];
        byte preByte = 0x00;
        boolean isStart = false;
        int count = 0;

        for(int i = 0; i < rawData.length ; i++){
            if(rawData[i] == 0x02){
                isStart = true;
                count = 0;
            }
            if(isStart && count < 9){
                data[count] = rawData[i];
                count++;
            }
            if(count == 8){
                int segment = (data[3] & 0x0f) & 0xff;
                int v = data[3]&0xff;
                int la = data[4]&0xff;
                int ra = data[6]&0xff;
                int qb = data[7]&0xff;
                int I = la - ra + 2048;
                int II = 4096 - ra;
                int III = 4096 - la;
                int AVR = ra - (la/2) + 1024;
                int AVL = la - (ra/2) + 1024;
                int AVF = -(ra/2) - (la/2) + 4096;
                int V = v - (la + ra - 4096)/3;

                Log.d("", " ECG data segment = " + segment + " v = " + v + " la = " + la + " ra = " + ra + " qb = " + qb +
                                " I = " + I +
                                " II = " + II +
                                " III = " + III +
                                " AVR = " + AVR +
                                " AVL = " + AVL +
                                " AVF = " + AVF +
                                " V = " + V
                );
            }
        }

        return "";
    }
    //////////////Blood Glucose data////////////
}

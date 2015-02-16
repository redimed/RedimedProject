package app.com.bluetoothmedical;

import android.util.Log;
import android.os.Handler;
/**
 * Created by phuongnguyen on 3/02/15.
 */
public class PulseDevice extends MedicalBluetoothDevice {

    public PulseDevice(){
        super();
    }

    public void data(String hex,String bin,byte[] rawData) {
        Log.d("","  pulseData = " + hex);
        if (hex.contains("7D  81  A1")) {//7D  81  A1
            Log.d("", "=== Pulse: Header Single Data.");
            isPulseData = true;
            return;
        }
        if(isPulseData && !hex.substring(0,3).contains("01")){
            Log.d("", "=== Pulse: End Single Data.");
            ///isPulseData = false;
            return;
        }
        if(isPulseData && hex.substring(0,3).contains("01")){
            isHasData = true;
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

            value = "  pulseRate = " + pulseRateInInt +
                    "  spO2InInt = " + spO2InInt;
            //txtValue.setText("value = " + value);
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



}

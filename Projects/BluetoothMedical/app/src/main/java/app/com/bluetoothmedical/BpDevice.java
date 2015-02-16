package app.com.bluetoothmedical;

import android.util.Log;
import android.os.Handler;
/**
 * Created by phuongnguyen on 3/02/15.
 */
public class BpDevice extends MedicalBluetoothDevice {

    public BpDevice(){
        super();
    }

    public void data(String hex,String bin,byte[] rawData) {
        //Log.d("","  pulseData = " + hex);
        if (hex.contains("4A  43  01  00  46  42")) {//7D  81  A1
            Log.d("", "=== BP: Header Single Data.");
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

            if(sysInInt > 0) isHasData = true;

            value =  " sysInInt = "  + sysInInt
                    + " diaInInt = "  + diaInInt
                    + " bpmInInt = "  + bpmInInt
                    + " mmHgInInt = "  + mmHgInInt;

            //txtValue.setText(" Value = " + value);

        }
        //return "";
    }
}

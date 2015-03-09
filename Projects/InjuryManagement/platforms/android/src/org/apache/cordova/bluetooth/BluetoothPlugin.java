package org.apache.cordova.bluetooth;

import java.util.*;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.util.Log;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.annotation.TargetApi;


/**
 * Bluetooth interface for Cordova 2.6.0 (PhoneGap).
 *
 * @version 	0.9.2
 * @author  	Taneli Hartikainen
 */
@TargetApi(Build.VERSION_CODES.GINGERBREAD)
public class BluetoothPlugin extends CordovaPlugin
{
	private static final String LOG_TAG					= "BluetoothPlugin";

	private static final String ACTION_IS_BT_ENABLED 	= "isEnabled";
	private static final String ACTION_ENABLE_BT		= "enable";
	private static final String ACTION_DISABLE_BT		= "disable";

	private static final String ACTION_IS_DISCOVERING	= "isDiscovering";
	private static final String ACTION_START_DISCOVERY	= "startDiscovery";
	private static final String ACTION_STOP_DISCOVERY	= "stopDiscovery";

	private static final String ACTION_IS_PAIRED		= "isPaired";
	private static final String ACTION_PAIR				= "pair";
	private static final String ACTION_UNPAIR			= "unpair";

	private static final String ACTION_GET_PAIRED		= "getPaired";
	private static final String ACTION_GET_UUIDS		= "getUuids";

	private static final String ACTION_IS_CONNECTED		= "isConnected";
	private static final String ACTION_IS_READING		= "isConnectionManaged";
	private static final String ACTION_CONNECT 			= "connect";
	private static final String ACTION_DISCONNECT 		= "disconnect";

	private	static final String ACTION_START_READING	= "startConnectionManager";
	private	static final String ACTION_STOP_READING		= "stopConnectionManager";

	private static final String ACTION_WRITE			= "write";
    private static final String ACTION_IS_DISCOVERY_ONE_DEVICE	= "isDiscoveryOneDevice";
    private static final String ACTION_RESET_MINIECG_DATA	= "resetMiniEcgData";
	/**
	 * Bluetooth interface
	 */
	private BluetoothWrapper _bluetooth;

	/**
	 * Callback context for device discovery actions.
	 */
	private CallbackContext _discoveryCallback;

	/**
	 * Callback context for pairing devices.
	 */
	private CallbackContext _pairingCallback;

	/**
	 * Callback context for fetching UUIDs.
	 */
	private CallbackContext	_uuidCallback;

	/**
	 * Callback context for the asynchronous connection attempt.
	 */
	private CallbackContext _connectCallback;

	/**
	 * Callback context for the asynchronous (and continuous) read operation.
	 */
	private CallbackContext _ioCallback;

	/**
	 * Is set to true when a discovery process is canceled or a new one is started when
	 * there is a discovery process still in progress (cancels the old one).
	 */
	private boolean _wasDiscoveryCanceled;

	/**
	 * Encoding used to read incoming data.
	 */
	private Charset _encoding;

    /*
    * use to store mini ecg data PhuongNM
    */
    private JSONObject miniEcgValueObject;
    private JSONObject ecgValueObject;

    private JSONObject ecgIValueObject;
    private JSONObject ecgIIValueObject;
    private JSONObject ecgIIIValueObject;
    private JSONObject ecgAVRValueObject;
    private JSONObject ecgAVLValueObject;
    private JSONObject ecgAVFValueObject;
    private JSONObject ecgVValueObject;

    private int miniEcgCount = 0;
    private int ecgCount = 0;
	/**
	 * Initialize the Plugin, Cordova handles this.
	 *
	 * @param cordova	Used to get register Handler with the Context accessible from this interface
	 * @param view		Passed straight to super's initialization.
	 */
	public void initialize(CordovaInterface cordova, CordovaWebView view)
	{
		super.initialize(cordova, view);

		_encoding = Charset.forName("UTF-8");
		_wasDiscoveryCanceled = false;

		_bluetooth = new BluetoothWrapper(cordova.getActivity().getBaseContext(), _handler);

		miniEcgValueObject = new JSONObject();
        ecgValueObject = new JSONObject();

        ecgIValueObject = new JSONObject();
        ecgIIValueObject = new JSONObject();
        ecgIIIValueObject = new JSONObject();
        ecgAVRValueObject = new JSONObject();
        ecgAVLValueObject = new JSONObject();
        ecgAVFValueObject = new JSONObject();
        ecgVValueObject = new JSONObject();


		try{
		    miniEcgValueObject.put("deviceType", "Mini ECG");
		    miniEcgValueObject.put("rawData", "Mini ECG");

            ecgValueObject.put("deviceType", "ECG");
            ecgValueObject.put("rawData", "ECG");
		}catch(Exception e)
		{

		}

	}

	/**
	 * Executes the given action.
	 *
	 * @param action		The action to execute.
	 * @param args			Potential arguments.
	 * @param callbackCtx	Babby call home.
	 */
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackCtx)
	{
		if(ACTION_IS_BT_ENABLED.equals(action))
		{
			isEnabled(args, callbackCtx);
		}
		else if(ACTION_ENABLE_BT.equals(action))
		{
			enable(args, callbackCtx);
		}
		else if(ACTION_DISABLE_BT.equals(action))
		{
			disable(args, callbackCtx);
		}
		else if(ACTION_IS_DISCOVERING.equals(action))
		{
			isDiscovering(args, callbackCtx);
		}
		else if(ACTION_START_DISCOVERY.equals(action))
		{
			startDiscovery(args, callbackCtx);
		}
		else if(ACTION_STOP_DISCOVERY.equals(action))
		{
			stopDiscovery(args, callbackCtx);
		}
		else if(ACTION_IS_PAIRED.equals(action))
		{
			isPaired(args, callbackCtx);
		}
		else if(ACTION_PAIR.equals(action))
		{
			pair(args, callbackCtx);
		}
		else if(ACTION_UNPAIR.equals(action))
		{
			unpair(args, callbackCtx);
		}
		else if(ACTION_GET_PAIRED.equals(action))
		{
			getPaired(args, callbackCtx);
		}
		else if(ACTION_GET_UUIDS.equals(action))
		{
			getUuids(args, callbackCtx);
		}
		else if(ACTION_IS_CONNECTED.equals(action))
		{
			isConnected(args, callbackCtx);
		}
		else if(ACTION_CONNECT.equals(action))
		{
			connect(args, callbackCtx);
		}
		else if(ACTION_DISCONNECT.equals(action))
		{
			disconnect(args, callbackCtx);
		}
		else if(ACTION_IS_READING.equals(action))
		{
			isConnectionManaged(args, callbackCtx);
		}
		else if(ACTION_START_READING.equals(action))
		{
			startConnectionManager(args, callbackCtx);
		}
		else if(ACTION_STOP_READING.equals(action))
		{
			stopConnectionManager(args, callbackCtx);
		}
		else if(ACTION_WRITE.equals(action))
		{
			write(args, callbackCtx);
		}
		else if(ACTION_IS_DISCOVERY_ONE_DEVICE.equals(action))
		{
		    isDiscoveryOneDevice(args, callbackCtx);
		}
		else if(ACTION_RESET_MINIECG_DATA.equals(action))
		{
            resetMiniEcgData(args, callbackCtx);
		}
		else
		{
			Log.e(LOG_TAG, "Invalid Action[" + action + "]");
			callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
		}

		return true;
	}

	/**
	 * Send an error to given CallbackContext containing the error code and message.
	 *
	 * @param ctx	Where to send the error.
	 * @param msg	What seems to be the problem.
	 * @param code	Integer value as a an error "code"
	 */
	private void error(CallbackContext ctx, String msg, int code)
	{
		try
		{
			JSONObject result = new JSONObject();
			result.put("message", msg);
			result.put("code", code);

			ctx.error(result);
		}
		catch(Exception e)
		{
			Log.e(LOG_TAG, "Error with... error raising, " + e.getMessage());
		}
	}


    private void resetMiniEcgData(JSONArray args, CallbackContext callbackCtx)
    {
        // TODO Add options to enable with Intent

        try
        {
            miniEcgValueObject = new JSONObject();
            miniEcgValueObject.put("deviceType", "Mini ECG");
            miniEcgValueObject.put("rawData", "Mini ECG");

            ecgValueObject = new JSONObject();
            ecgValueObject.put("deviceType", "ECG");
            ecgValueObject.put("rawData", "ECG");

            ecgIValueObject = new JSONObject();
            ecgIIValueObject = new JSONObject();
            ecgIIIValueObject = new JSONObject();
            ecgAVRValueObject = new JSONObject();
            ecgAVLValueObject = new JSONObject();
            ecgAVFValueObject = new JSONObject();
            ecgVValueObject = new JSONObject();

            callbackCtx.success();
        }
        catch(Exception e)
        {
            this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
        }

    }
	/**
	 * Is Bluetooth on.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */

	private void isEnabled(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isEnabled()));
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	private void isDiscoveryOneDevice(JSONArray args, CallbackContext callbackCtx)
	{
        try
        {
            callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isDiscoveryOneDevice()));
        }
        catch(Exception e)
        {
            this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
        }
	}

	/**
	 * Turn Bluetooth on.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void enable(JSONArray args, CallbackContext callbackCtx)
	{
		// TODO Add options to enable with Intent

		try
		{
			_bluetooth.enable();
			callbackCtx.success();
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Turn Bluetooth off.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void disable(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			_bluetooth.disable();
			callbackCtx.success();
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * See if a device discovery process is in progress.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void isDiscovering(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isDiscovering()));
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Start a device discovery.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void startDiscovery(JSONArray args, CallbackContext callbackCtx)
	{
		// TODO Someday add an option to fetch UUIDs at the same time

		try
		{
			if(_bluetooth.isConnecting())
			{
				this.error(callbackCtx, "A Connection attempt is in progress.", BluetoothError.ERR_CONNECTING_IN_PROGRESS);
			}
			else
			{
				if(_bluetooth.isDiscovering())
				{
					_wasDiscoveryCanceled = true;
					_bluetooth.stopDiscovery();

					if(_discoveryCallback != null)
					{
						this.error(_discoveryCallback,
							"Discovery was stopped because a new discovery was started.",
							BluetoothError.ERR_DISCOVERY_RESTARTED
						);
						_discoveryCallback = null;
					}
				}

				_bluetooth.startDiscovery();

				PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
				result.setKeepCallback(true);
				callbackCtx.sendPluginResult(result);

				_discoveryCallback = callbackCtx;
			}
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Stop device discovery.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void stopDiscovery(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			if(_bluetooth.isDiscovering())
			{
				_wasDiscoveryCanceled = true;
				_bluetooth.stopDiscovery();

				if(_discoveryCallback != null)
				{
					this.error(_discoveryCallback,
						"Discovery was cancelled.",
						BluetoothError.ERR_DISCOVERY_CANCELED
					);

					_discoveryCallback = null;
				}

				callbackCtx.success();
			}
			else
			{
				this.error(callbackCtx, "There is no discovery to cancel.", BluetoothError.ERR_UNKNOWN);
			}
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * See if the device is paired with the device in the given address.
	 *
	 * @param args			Arguments given. First argument should be the address in String format.
	 * @param callbackCtx	Where to send results.
	 */
	private void isPaired(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			String address = args.getString(0);
			callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isBonded(address)));
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Pair the device with the device in the given address.
	 *
	 * @param args			Arguments given. First argument should be the address in String format.
	 * @param callbackCtx	Where to send results.
	 */
	private void pair(JSONArray args, CallbackContext callbackCtx)
	{
		// TODO Add a timeout function for pairing

		if(_pairingCallback != null)
		{
			this.error(callbackCtx, "Pairing process is already in progress.", BluetoothError.ERR_PAIRING_IN_PROGRESS);
		}
		else
		{
			try
			{
				String address = args.getString(0);
				_bluetooth.createBond(address);
				_pairingCallback = callbackCtx;
			}
			catch(Exception e)
			{
				_pairingCallback = null;
				this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
			}
		}
	}

	/**
	 * Unpair with the device in the given address.
	 *
	 * @param args			Arguments given. First argument should be the address in String format.
	 * @param callbackCtx	Where to send results.
	 */
	private void unpair(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			String address = args.getString(0);
			_bluetooth.removeBond(address);
			callbackCtx.success();
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}


	/**
	 * Get the devices paired with this device.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void getPaired(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			JSONArray devices 						= new JSONArray();
			ArrayList<Pair<String>> bondedDevices 	= _bluetooth.getBondedDevices();

			for(Pair<String> deviceInfo : bondedDevices)
			{
				JSONObject device = new JSONObject();
				device.put("name", deviceInfo.a);
				device.put("address", deviceInfo.b);
				devices.put(device);
			}

			callbackCtx.success(devices);
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Get the UUID(s) of the device at given address.
	 *
	 * @param args			Arguments given. First argument should be the address in String format.
	 * @param callbackCtx	Where to send results.
	 */
	private void getUuids(JSONArray args, CallbackContext callbackCtx)
	{
		if(_uuidCallback != null)
		{
			this.error(callbackCtx,
				"Could not start UUID fetching because there is already one in progress.",
				BluetoothError.ERR_UUID_FETCHING_IN_PROGRESS
			);
		}
		else
		{
			try
			{
				String address = args.getString(0);
				_bluetooth.fetchUuids(address);
				_uuidCallback = callbackCtx;

			}
			catch(Exception e)
			{
				_uuidCallback = null;
				this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
			}
		}
	}

	/**
	 * See if we have a connection.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void isConnected(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isConnected()));
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Attempt to connect to a device.
	 *
	 * @param args			Arguments given. [Address, UUID, ConnectionType(Secure, Insecure, Hax)], String format.
	 * @param callbackCtx	Where to send results.
	 */
	private void connect(JSONArray args, CallbackContext callbackCtx)
	{
		boolean isConnecting 	= _bluetooth.isConnecting();
		boolean isConnected		= _bluetooth.isConnected();

		if(isConnecting)
		{
			this.error(callbackCtx, "There is already a connection attempt in progress.", BluetoothError.ERR_CONNECTING_IN_PROGRESS);
		}
		else if(isConnected)
		{
			this.error(callbackCtx, "There is already a connection in progress.", BluetoothError.ERR_CONNECTION_ALREADY_EXISTS);
		}
		else
		{
			try
			{
				if(_bluetooth.isDiscovering())
				{
					_wasDiscoveryCanceled = true;
					_bluetooth.stopDiscovery();

					if(_discoveryCallback != null)
					{
						this.error(_discoveryCallback, "Discovery stopped because a connection attempt was started.", BluetoothError.ERR_DISCOVERY_CANCELED);
					}
				}

				String address 		= args.getString(0);
				String uuid			= args.getString(1);
				String connTypeStr	= args.getString(2);

				_bluetooth.connect(address, uuid, connTypeStr);

				PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
				result.setKeepCallback(true);
				callbackCtx.sendPluginResult(result);

				_connectCallback = callbackCtx;
			}
			catch(Exception e)
			{
				_connectCallback = null;

				this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
			}
		}
	}

	/**
	 * Disconnect from the device currently connected to.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void disconnect(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			_bluetooth.disconnect();
			callbackCtx.success();
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * See if we have a managed connection active (allows read/write).
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void isConnectionManaged(JSONArray args, CallbackContext callbackCtx)
	{
		callbackCtx.sendPluginResult(new PluginResult(PluginResult.Status.OK, _bluetooth.isConnectionManaged()));
	}

	/**
	 * Start a managed connection, allowing read and write operations.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void startConnectionManager(JSONArray args, CallbackContext callbackCtx)
	{
		if(_ioCallback != null)
		{
			this.error(callbackCtx, "There is already an active connection.", BluetoothError.ERR_CONNECTION_ALREADY_EXISTS);
		}
		else
		{
			try
			{
				_encoding = Charset.forName(args.getString(0));

				_bluetooth.startConnectionManager();
				_ioCallback = callbackCtx;
			}
			catch(Exception e)
			{
				_ioCallback = null;
				this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
			}
		}
	}

	/**
	 * Stop the managed connection, preventing further read or write operations.
	 *
	 * @param args			Arguments given.
	 * @param callbackCtx	Where to send results.
	 */
	private void stopConnectionManager(JSONArray args, CallbackContext callbackCtx)
	{
		try
		{
			if(_bluetooth.isConnectionManaged())
			{
				_bluetooth.stopConnectionManager();
				callbackCtx.success();
			}
			else
			{
				this.error(callbackCtx,
					"There is no connection being managed.",
					BluetoothError.ERR_CONNECTION_DOESNT_EXIST
				);
			}
		}
		catch(Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Write given data to the managed connection.
	 *
	 * @param args			Arguments given. First argument should be the data you want to write.
	 * @param callbackCtx	Where to send results.
	 */
	private void write(JSONArray args, CallbackContext callbackCtx)
	{
		Log.d(LOG_TAG, "write-method called");

		try
		{
			Object data 		= args.get(0);
			String encoding 	= args.getString(1);
			boolean forceString = args.getBoolean(2);

			byte[] defaultBytes = new byte[4];
			ByteBuffer buffer = ByteBuffer.wrap(defaultBytes);

			if(forceString || data.getClass() == String.class)
			{
				String dataString = (String)data;
				//buffer = ByteBuffer.wrap(dataString.getBytes(encoding));
				buffer = ByteBuffer.wrap(fromHexString(dataString));
			}
			else if(data.getClass().equals(Integer.class))
			{
				byte[] bytes = new byte[4];
				buffer = ByteBuffer.wrap(bytes);
				buffer.putInt((Integer)data);
			}
			else if(data.getClass().equals(Double.class))
			{
				byte[] bytes = new byte[8];
				buffer = ByteBuffer.wrap(bytes);
				buffer.putDouble((Double)data);
			}
			else
			{
				this.error(callbackCtx, "Unknown data-type", BluetoothError.ERR_UNKNOWN);
				return;
			}

			if(!_bluetooth.isConnected())
			{
				this.error(callbackCtx, "There is no managed connection to write to.", BluetoothError.ERR_CONNECTION_DOESNT_EXIST);
			}
			else
			{
				buffer.rewind();
				_bluetooth.write(buffer.array());
				callbackCtx.success();
			}
		}
		catch (Exception e)
		{
			this.error(callbackCtx, e.getMessage(), BluetoothError.ERR_UNKNOWN);
		}
	}

	/**
	 * Handle messages from BluetoothWrapper. BluetoothWrapper does a lot of asynchronous
	 * work, so the main way of communicating between BluetoothPlugin and BluetoothWrapper
	 * is to use callback Messages.
	 *
	 * @see Handler
	 * @see Message
	 * @see BluetoothWrapper
	 */
	private final Handler _handler = new Handler(new Handler.Callback()
	{
		@Override
		public boolean handleMessage(Message msg)
		{
			switch(msg.what)
			{
				case BluetoothWrapper.MSG_DISCOVERY_STARTED:

					_wasDiscoveryCanceled = false;

					break;

				case BluetoothWrapper.MSG_DISCOVERY_FINISHED:

					if(!_wasDiscoveryCanceled)
					{
						if(_discoveryCallback != null)
						{
							PluginResult result = new PluginResult(PluginResult.Status.OK, false);
							_discoveryCallback.sendPluginResult(result);
							_discoveryCallback = null;
						}
					}

					break;

				case BluetoothWrapper.MSG_DEVICE_FOUND:

					try
					{
						String name 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_NAME);
						String deviceType 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_TYPE);
						String address 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_ADDRESS);

						JSONObject device = new JSONObject();
						device.put("name", name);
						device.put("address", address);
                        device.put("deviceType", deviceType);

						// Send one device at a time, keeping callback to be used again
						if(_discoveryCallback != null)
						{
							PluginResult result = new PluginResult(PluginResult.Status.OK, device);
							result.setKeepCallback(true);
							_discoveryCallback.sendPluginResult(result);
						}
						else
						{
							Log.e(LOG_TAG, "CallbackContext for discovery doesn't exist.");
						}
					}
					catch(JSONException e)
					{
						if(_discoveryCallback != null)
						{
							BluetoothPlugin.this.error(_discoveryCallback,
								e.getMessage(),
								BluetoothError.ERR_UNKNOWN
							);
							_discoveryCallback = null;
						}
					}

					break;

				case BluetoothWrapper.MSG_UUIDS_FOUND:

					try
					{
						if(_uuidCallback != null)
						{
							String name 			= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_NAME);
							String address 			= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_ADDRESS);
							ArrayList<String> uuids = msg.getData().getStringArrayList(BluetoothWrapper.DATA_UUIDS);

							JSONObject deviceInfo = new JSONObject();
							JSONArray deviceUuids = new JSONArray(uuids);

							deviceInfo.put("name", name);
							deviceInfo.put("address", address);
							deviceInfo.put("uuids", deviceUuids);

							_uuidCallback.success(deviceInfo);
							_uuidCallback = null;
						}
						else
						{
							Log.e(LOG_TAG, "CallbackContext for uuid fetching doesn't exist.");
						}
					}
					catch(Exception e)
					{
						if(_uuidCallback != null)
						{
							BluetoothPlugin.this.error(_uuidCallback,
								e.getMessage(), BluetoothError.ERR_UNKNOWN
							);
							_uuidCallback = null;
						}
					}

					break;

				case BluetoothWrapper.MSG_DEVICE_BONDED:

					try
					{
						String name 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_NAME);
						String address 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_ADDRESS);
                        String deviceType 	= msg.getData().getString(BluetoothWrapper.DATA_DEVICE_TYPE);

						JSONObject bondedDevice = new JSONObject();
						bondedDevice.put("name", name);
						bondedDevice.put("address", address);
                        bondedDevice.put("deviceType", deviceType);

						if(_pairingCallback != null)
						{
							_pairingCallback.success(bondedDevice);
							_pairingCallback = null;
						}
						else
						{
							Log.e(LOG_TAG, "CallbackContext for pairing doesn't exist.");
						}
					}
					catch(Exception e)
					{
						if(_pairingCallback != null)
						{
							BluetoothPlugin.this.error(_pairingCallback,
								e.getMessage(), BluetoothError.ERR_PAIRING_FAILED
							);
							_pairingCallback = null;
						}
					}

					break;

				case BluetoothWrapper.MSG_CONNECTION_ESTABLISHED:

					if(_connectCallback != null)
					{
						_connectCallback.success();
						_connectCallback = null;
					}
					else
					{
						Log.e(LOG_TAG, "CallbackContext for connection doesn't exist.");
					}

					break;

				case BluetoothWrapper.MSG_CONNECTION_FAILED:

					String error = msg.getData().getString(BluetoothWrapper.DATA_ERROR);

					if(_connectCallback != null)
					{
						BluetoothPlugin.this.error(_connectCallback,
							error, BluetoothError.ERR_CONNECTING_FAILED
						);
						_connectCallback = null;
					}
					else
					{
						Log.e(LOG_TAG, "CallbackContext for connection doesn't exist.");
					}

					break;

				case BluetoothWrapper.MSG_CONNECTION_LOST:

					if(_connectCallback != null)
					{
						BluetoothPlugin.this.error(_connectCallback,
							"Connection lost.", BluetoothError.ERR_CONNECTION_LOST
						);
						_connectCallback = null;
					}

					if(_ioCallback != null)
					{
						BluetoothPlugin.this.error(_ioCallback,
							"Connection lost.", BluetoothError.ERR_CONNECTION_LOST
						);
						_ioCallback = null;
					}

					break;

				case BluetoothWrapper.MSG_CONNECTION_STOPPED:

					if(_connectCallback != null)
					{
						BluetoothPlugin.this.error(_connectCallback,
							"Disconnected.", BluetoothError.ERR_DISCONNECTED
						);
						_connectCallback = null;
					}

					if(_ioCallback != null)
					{
						BluetoothPlugin.this.error(_ioCallback,
							"Disconnected.", BluetoothError.ERR_DISCONNECTED
						);
						_ioCallback = null;
					}

					break;

				case BluetoothWrapper.MSG_READ:

					//String data = new String(msg.getData().getByteArray(BluetoothWrapper.DATA_BYTES),BluetoothPlugin.this._encoding);
					byte[] readBuf = (msg.getData().getByteArray(BluetoothWrapper.DATA_BYTES)).clone();

                    String data = toHex(readBuf);
                    JSONObject dataObject = deviceData(data, readBuf );
					if(_ioCallback != null)
					{
						PluginResult result = new PluginResult(PluginResult.Status.OK,dataObject);
						result.setKeepCallback(true);
						_ioCallback.sendPluginResult(result);
						//_ioCallback.success(dataObject);
					}
					else
					{
						Log.e(LOG_TAG, "CallbackContext for IO doesn't exist.");
					}

					break;

				case BluetoothWrapper.MSG_BLUETOOTH_LOST:

					if(_discoveryCallback != null)
					{
						BluetoothPlugin.this.error(_discoveryCallback,
							"Bluetooth lost.", BluetoothError.ERR_BLUETOOTH_LOST
						);
						_discoveryCallback = null;
					}

					if(_pairingCallback != null)
					{
						BluetoothPlugin.this.error(_pairingCallback,
							"Bluetooth lost.", BluetoothError.ERR_BLUETOOTH_LOST
						);
						_pairingCallback = null;
					}

					if(_uuidCallback != null)
					{
						BluetoothPlugin.this.error(_uuidCallback,
							"Bluetooth lost.", BluetoothError.ERR_BLUETOOTH_LOST
						);
						_uuidCallback = null;
					}

					if(_connectCallback != null)
					{
						BluetoothPlugin.this.error(_connectCallback,
							"Bluetooth lost.", BluetoothError.ERR_BLUETOOTH_LOST
						);
						_connectCallback = null;
					}

					if(_ioCallback != null)
					{
						BluetoothPlugin.this.error(_ioCallback,
							"Bluetooth lost.", BluetoothError.ERR_BLUETOOTH_LOST
						);
						_ioCallback = null;
					}

					break;

				default:

					Log.e(LOG_TAG, "Message type could not be resolved.");

					break;
			}

			return true;
		}
	});

	/*
	Process Hex String to byte array to send to the ble device
	*/
	public static final byte[] fromHexString(final String s) {
	    String[] v = s.split(" ");
	    byte[] arr = new byte[v.length];
	    int i = 0;
	    for(String val: v) {
	        arr[i++] =  Integer.decode(val).byteValue();

	    }
	    return arr;
	}

    public static String toHex(byte[] bytes) {
        //BigInteger bi = new BigInteger(1, bytes);
        //return String.format("%0" + (bytes.length << 1) + "X", bi);

        String result = "";
        for(int i=0;i<bytes.length ;i++){
            result += String.format("%02X ", bytes[i]) + " ";
        }
        return result;

    }

    public static byte getBit(byte[] data, int pos) {
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

    public static String toBinary(byte[] bytes) {
        String result = "";
        for(int i=0;i<bytes.length ;i++){
            String b = "00000000" + Integer.toBinaryString((bytes[i]+256)%256);
            b = b.substring(b.length() - 8);
            result += b + "  ";
        }
        return result;
    }

    public JSONObject deviceData(String hex,byte[] rawData) {

    	JSONObject valueObject = new JSONObject();
        String value = "";

        try{
            if(_bluetooth.deviceType.contains("Pulse Oximeter") && hex.substring(0,3).contains("01")){

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

                valueObject.put("deviceType", "Pulse Oximeter");
                valueObject.put("pulse", pulseRateInInt);
                valueObject.put("spO2", spO2InInt);
                valueObject.put("rawData", hex);
            }
            else if(_bluetooth.deviceType.contains("Blood Pressure") && hex.contains("4A  43  01  00  46  42")) {

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

                int sysInInt = sys&0xff;
                int diaInInt = dia&0xff;
                int bpmInInt = bpm&0xff;
                int mmHgInInt = mmHg&0xff;

                value =  " sysInInt = "  + sysInInt
                + " diaInInt = "  + diaInInt
                + " bpmInInt = "  + bpmInInt
                + " mmHgInInt = "  + mmHgInInt;

                valueObject.put("deviceType", "Blood Pressure");
                valueObject.put("sys", sysInInt);
                valueObject.put("dia", diaInInt);
                valueObject.put("bpm", bpmInInt);
                valueObject.put("mmHg", mmHgInInt);
                valueObject.put("rawData", hex);

            }else if(_bluetooth.deviceType.contains("Spirometer") && hex.contains("01") && hex.contains("02") && hex.contains("03") && hex.contains("04") && hex.contains("05") )
            {
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

                /*
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

                );


                return    " highByteInBin = " + highByteInBin
                        + "  .\nFVCInInt = "  + FVCInInt
                        + "  .\nFEV1InInt = "  + FEV1InInt
                        + "  .\nPEFInInt = "  + PEFInInt;
                */
                valueObject.put("deviceType", "Spirometer");
                valueObject.put("FVC", FVCInInt);
                valueObject.put("FEV1", FEV1InInt);
                valueObject.put("PEF", PEFInInt);
                valueObject.put("rawData", hex);

            }else if(_bluetooth.deviceType.contains("Urine Test") )
            {
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

                //isUrineSingleData = false;
                //Log.d("","=== Urine: Raw Single Data. len = " + rawData.length + " : " + hex + " : " + bin + " : " + rawData );
                //Log.d("","Data " + toBinary3(rawData[13]) + " " + toBinary3(rawData[12]) + " " + toBinary3(rawData[11]) + " " + toBinary3(rawData[10]) + " " + toBinary3(rawData[9]) );

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

                valueObject.put("deviceType", "Urine Test");
                valueObject.put("URO", UROs.get(getBitSequenceAsInt( new byte[]{rawData[9],rawData[8]},11,3)) );
                valueObject.put("BLD", BLDs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},0,3)) );
                valueObject.put("BIL", BILs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},3,3)) );
                valueObject.put("KET", KETs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},6,3)) );
                valueObject.put("GLU", GLUs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},9,3)) );
                valueObject.put("PRO", PROs.get(getBitSequenceAsInt( new byte[]{rawData[11],rawData[10]},12,3)) );
                valueObject.put("PH", PHs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},0,3)) );
                valueObject.put("NIT", NITs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},3,3)) );
                valueObject.put("LEU", LEUs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},6,3)) );
                valueObject.put("SG", SGs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},9,3)));
                valueObject.put("VC", VCs.get(getBitSequenceAsInt( new byte[]{rawData[13],rawData[12]},12,3)) );

                valueObject.put("rawData", hex);
            }
            else  if (_bluetooth.deviceType.contains("Blood Glucose") && hex.contains("53  4E") &&  hex.contains("00  02  04")) {//7D  81  A1
            /////get current data of glucose
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


                 valueObject.put("deviceType", "Blood Glucose");
                 valueObject.put("yy", yyInInt );
                 valueObject.put("mm", mmInInt );
                 valueObject.put("dd", ddInInt );
                 valueObject.put("mi", miInInt );
                 valueObject.put("ss", ssInInt );
                 valueObject.put("bgHigh", bgHighInInt );
                 valueObject.put("bgLow", bgLowInInt );
                 valueObject.put("rawData", hex);

             }
             else if (_bluetooth.deviceType.contains("Blood Glucose") && hex.contains("53  4E") && (hex.contains("00  02  05") )) {//7D  81  A1
                //// all history data but only get the first line, need further code to complete this function, I am lazy now :)
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


                 valueObject.put("deviceType", "Blood Glucose");
                 valueObject.put("yy", yyInInt );
                 valueObject.put("mm", mmInInt );
                 valueObject.put("dd", ddInInt );
                 valueObject.put("mi", miInInt );
                 valueObject.put("ss", ssInInt );
                 valueObject.put("bgHigh", bgHighInInt );
                 valueObject.put("bgLow", bgLowInInt );
                 valueObject.put("rawData", hex);

             }else if(_bluetooth.deviceType.contains("Scale") && hex.contains("93  8E") &&  hex.contains("00  05  03")) {//7D  81  A1
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

                 valueObject.put("yy", yyInInt );
                 valueObject.put("mm", mmInInt );
                 valueObject.put("dd", ddInInt );
                 valueObject.put("mi", miInInt );
                 valueObject.put("Data", DataInInt );
                 valueObject.put("rawData", hex);
                 valueObject.put("deviceType", "Scale");

             }else  if(_bluetooth.deviceType.contains("ECG")) {
                    byte[] data = new byte[15];
                    byte preByte = 0x00;
                    boolean isStart = false;
                    int count = 0;

                     valueObject.put("deviceType", "ECG");
                     valueObject.put("rawData", hex);

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
                            byte highestByte = data[1];
                            byte highestBitOfByte2 = getBitRever(new byte[]{highestByte},0);
                            highestBitOfByte2 = (byte)((highestBitOfByte2<<7)|0x7f);
                            byte byte2 = (byte)(highestBitOfByte2&data[2]);

                            byte highestBitOfByte3 = getBitRever(new byte[]{highestByte},1);
                            highestBitOfByte3 = (byte)((highestBitOfByte3<<7)|0x7f);
                            byte byte3 = (byte)(highestBitOfByte3&data[3]);

                            byte highestBitOfByte4 = getBitRever(new byte[]{highestByte},2);
                            highestBitOfByte4 = (byte)((highestBitOfByte4<<7)|0x7f);
                            byte byte4 = (byte)(highestBitOfByte4&data[4]);

                            byte highestBitOfByte5 = getBitRever(new byte[]{highestByte},3);
                            highestBitOfByte5 = (byte)((highestBitOfByte5<<7)|0x7f);
                            byte byte5 = (byte)(highestBitOfByte5&data[5]);

                            byte highestBitOfByte6 = getBitRever(new byte[]{highestByte},4);
                            highestBitOfByte6 = (byte)((highestBitOfByte6<<7)|0x7f);
                            byte byte6 = (byte)(highestBitOfByte6&data[6]);

                            byte highestBitOfByte7 = getBitRever(new byte[]{highestByte},5);
                            highestBitOfByte7 = (byte)((highestBitOfByte7<<7)|0x7f);
                            byte byte7 = (byte)(highestBitOfByte7&data[7]);

                            byte highestBitOfByte8 = getBitRever(new byte[]{highestByte},6);
                            highestBitOfByte8 = (byte)((highestBitOfByte8<<7)|0x7f);
                            byte byte8 = (byte)(highestBitOfByte8&data[8]);

                            int segment = (byte2 & 0x0f) & 0xff;
                            byte v_l = byte3;
                            byte v_h = (byte)(byte5 & 0x0f);

                            byte la_l= byte4;
                            byte la_h = (byte)((byte5 & 0xf0)>>4);

                            byte ra_l = byte6;
                            byte ra_h = (byte)(byte8 & 0x0f);

                            byte qb_l = byte7;
                            byte qb_h = (byte)((byte8 & 0xf0)>>4);

                            short v_s = (short)(v_h<<8|(v_l& 0xFF));
                            short la_s = (short)(la_h<<8|(la_l& 0xFF));
                            short qb_s = (short)(qb_h<<8|(qb_l& 0xFF));
                            short ra_s = (short)(ra_h<<8|(ra_l& 0xFF));




                            data[9] = v_h;
                            data[10] = la_h;
                            data[11] = ra_h;
                            data[12] = qb_h;

                            int v = v_s&0xffff;
                            int la = la_s&0xffff;
                            int ra = ra_s&0xffff;
                            int qb = qb_s&0xffff;

                            int I = la - ra + 2048;
                            int II = 4096 - ra;
                            int III = 4096 - la;
                            int AVR = ra - (la/2) + 1024;
                            int AVL = la - (ra/2) + 1024;
                            int AVF = -(ra/2) - (la/2) + 4096;
                            int V = v - (la + ra - 4096)/3;

                            int ecgPosition = ecgCount++;

                            ecgIValueObject.put("" + (ecgPosition),I);
                            ecgIIValueObject.put("" + (ecgPosition),II);
                            ecgIIIValueObject.put("" + (ecgPosition),III);
                            ecgAVRValueObject.put("" + (ecgPosition),AVR);
                            ecgAVLValueObject.put("" + (ecgPosition),AVL);
                            ecgAVFValueObject.put("" + (ecgPosition),AVF);
                            ecgVValueObject.put("" + (ecgPosition),V);

                            Log.d("", toHex(data) + toBinary(data) + " ECG data segment = " + segment + " v = " + v + " la = " + la + " ra = " + ra + " qb = " + qb +
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

                    valueObject.put("I",ecgIValueObject);
                    valueObject.put("II",ecgIIValueObject);
                    valueObject.put("III",ecgIIIValueObject);
                    valueObject.put("AVR",ecgAVRValueObject);
                    valueObject.put("AVL",ecgAVLValueObject);
                    valueObject.put("AVF",ecgAVFValueObject);
                    valueObject.put("V",ecgVValueObject);
                    valueObject.put("rawData", "data");
                    valueObject.put("deviceType", "ECG");

             }else  if(_bluetooth.deviceType.contains("Mini ECG") && hex.contains("D0")) {//7D  81  A1
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

                miniEcgValueObject.put("" + (miniEcgCount++), data0);
                miniEcgValueObject.put("" + (miniEcgCount++), data1);
                miniEcgValueObject.put("" + (miniEcgCount++), data2);
                miniEcgValueObject.put("" + (miniEcgCount++), data3);
                miniEcgValueObject.put("" + (miniEcgCount++), data4);
                miniEcgValueObject.put("" + (miniEcgCount++), data5);
                miniEcgValueObject.put("" + (miniEcgCount++), data6);
                miniEcgValueObject.put("" + (miniEcgCount++), data7);
                miniEcgValueObject.put("" + (miniEcgCount++), data8);
                miniEcgValueObject.put("" + (miniEcgCount++), data9);
                miniEcgValueObject.put("" + (miniEcgCount++), data10);
                miniEcgValueObject.put("" + (miniEcgCount++), data11);
                miniEcgValueObject.put("" + (miniEcgCount++), data12);
                miniEcgValueObject.put("" + (miniEcgCount++), data13);
                miniEcgValueObject.put("" + (miniEcgCount++), data14);
                miniEcgValueObject.put("" + (miniEcgCount++), data15);
                miniEcgValueObject.put("" + (miniEcgCount++), data16);
                miniEcgValueObject.put("" + (miniEcgCount++), data17);
                miniEcgValueObject.put("" + (miniEcgCount++), data18);
                miniEcgValueObject.put("" + (miniEcgCount++), data19);
                miniEcgValueObject.put("" + (miniEcgCount++), data20);
                miniEcgValueObject.put("" + (miniEcgCount++), data21);
                miniEcgValueObject.put("" + (miniEcgCount++), data22);
                miniEcgValueObject.put("" + (miniEcgCount++), data23);
                miniEcgValueObject.put("" + (miniEcgCount++), data24);

                return miniEcgValueObject;

                /*
                valueObject.put("deviceType", "Mini ECG");
                valueObject.put("data0", data0 );
                valueObject.put("data1", data1 );
                valueObject.put("data2", data2 );
                valueObject.put("data3", data3 );
                valueObject.put("data4", data4 );
                valueObject.put("data5", data5 );
                valueObject.put("data6", data6 );
                valueObject.put("data7", data7 );
                valueObject.put("data8", data8 );
                valueObject.put("data9", data9 );
                valueObject.put("data10", data10 );
                valueObject.put("data11", data11 );
                valueObject.put("data12", data12 );
                valueObject.put("data13", data13 );
                valueObject.put("data14", data14 );
                valueObject.put("data15", data15 );
                valueObject.put("data16", data16 );
                valueObject.put("data17", data17 );
                valueObject.put("data18", data18 );
                valueObject.put("data19", data19 );
                valueObject.put("data20", data20 );
                valueObject.put("data21", data21 );
                valueObject.put("data22", data22 );
                valueObject.put("data23", data23 );
                valueObject.put("data24", data24 );
                valueObject.put("rawData", hex);
                */


             }else{
                valueObject.put("deviceType", _bluetooth.deviceType);
                valueObject.put("rawData", hex);
             }

        }catch(Exception e){
            try{
                valueObject.put("deviceType", "Error");
                valueObject.put("Error", e.getMessage());
                valueObject.put("rawData", hex);
            }
            catch(Exception e2){

            }
        }


        return valueObject;
    }

    public static int getValueOfMiniECGData(byte high,byte low,byte highestBitOfHigh,byte highestBitOfLow,int highPosition,int lowPosition){
        byte highestBitOfHighByte = getBitRever(new byte[]{highestBitOfHigh},highPosition);
        highestBitOfHighByte = (byte)((highestBitOfHighByte<<7)|0x7f);

        byte highestBitOfLowByte = getBitRever(new byte[]{highestBitOfLow},lowPosition);
        highestBitOfLowByte = (byte)((highestBitOfLowByte<<7)|0x7f);

        byte highData = (byte)(high&highestBitOfHighByte);
        byte lowData = (byte)(low&highestBitOfLowByte);
        short Data = (short)(highData<<8|(lowData& 0xFF));

        return  (int)(Data & 0xffff) - 16384;
    }

}

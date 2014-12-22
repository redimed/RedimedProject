package com.redimed.service;

import au.gov.hic.hiconline.client.api.*;
import au.gov.hic.hiconline.client.core.*;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.*;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;



import org.ini4j.Ini;
import org.ini4j.InvalidFileFormatException;

import com.google.gson.Gson;
import com.google.gson.JsonObject;


@Path("medicare")
public class MedicareService {
	String recipient = "ebus.test@medicareaustralia.gov.au";
	String server = "www4.medicareaustralia.gov.au/ext";
	String locationId = "RMD00000";
	String logicPackDir = "C:/Program Files/Online Claiming/LogicPack";
	String pmsProduct = "RediTotalHealthSolutions";

	int rval = 0;

	Ini ini = null;
	
	public int getSessionId(){
		
		InputStream asStream = MedicareService.class.getResourceAsStream("/iniFile/ErrorList.ini");
		try {
			ini = new Ini(asStream);
		} catch (InvalidFileFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String versionId = null;
		int sessionId;
		String sessionIdStr;

		versionId = EasyclaimAPI.getVersionId();

		sessionId =
				EasyclaimAPI.getInstance().createSessionEasyclaim(
						"C:/Program Files/Online Claiming/hic.psi",
						"1234");

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "Recipient", recipient);

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "Server", server);

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "LocationId", locationId);

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "PmsProduct", pmsProduct);

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "PmsVersion", "1.0");

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "TransmissionType", "P");

		EasyclaimAPI.getInstance().setSessionElement(sessionId, "LogicPackDir", logicPackDir);
		

		return sessionId;
	}

	@Path("verify/pvm")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyPVM(String json) {
		
		Map<String,Object> patient = new Gson().fromJson(json, Map.class);

		int sessionId = getSessionId();

		Vector rs = new Vector();
		rval = EasyclaimAPI.getInstance().createBusinessObject(sessionId, "HIC/HolMedical/PatientVerificationRequest@4", "", "", rs);
		
		if(rval == 0)	
			rval =  EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "OPVTypeCde", "PVM") ;
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "PatientFirstName", patient.get("firstName").toString());
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "PatientFamilyName", patient.get("lastName").toString());
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "PatientDateOfBirth", patient.get("dob").toString());
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "PatientMedicareCardNum", patient.get("medicareNo").toString());
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "PatientReferenceNum", patient.get("refNo").toString());
		else
			return returnOPVJson(rval);

		if(rval == 0)
		{
			rval = EasyclaimAPI.getInstance().sendContent(sessionId, "HIC/HolMedical/PatientVerificationRequest@4", "Pass-123");
		}
		else
			return returnOPVJson(rval);

		if(rval == 9501)
			rval = EasyclaimAPI.getInstance().isReportAvailable(sessionId);
		else
			return returnOPVJson(rval);

		
		Vector statusCode = new Vector();
		if(rval == 0)
		{
			rval = EasyclaimAPI.getInstance().getReportElement(sessionId,"MedicareStatusCode", statusCode);
			
		}
		else
			return returnOPVJson(rval);

		EasyclaimAPI.getInstance().resetSession(sessionId);

		if(rval == 0)
		{
			int code = Integer.parseInt(statusCode.elementAt(0).toString());
			
			if(code == 0)
			{
				JsonObject a = new JsonObject();
				JsonObject b = new JsonObject();

				a.addProperty("code", "0");
				a.addProperty("message", "Patient details verified");
				b.add("status",a);
				return Response.ok(b.toString()).build();
				
			}
			else
			{
				return returnOPVJson(code);
			}
			
		}
		else
		{
			return returnOPVJson(rval);
		}

	}
	
	@Path("verify/ecm")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyECM(String json) {
		Map<String, Object> jsonObj = new Gson().fromJson(json, Map.class);
		
		int sessionId = getSessionId();

		rval = EasyclaimAPI.getInstance().createBusinessObject(sessionId, "HIC/HolMedical/OnlineEligibilityCheckRequestCH@4", "", "", null);
		
		Vector rs = new Vector();
		if(rval == 0)	
			rval =  EasyclaimAPI.getInstance().getUniqueId(sessionId, rs);
		else
			return returnOPVJson(rval);
		
		if(rval == 0)	
			rval =  EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"../", "TransactionId ", rs.get(0).toString()) ;
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "OECTypeCde", "ECM");
		else
			return returnOPVJson(rval);

		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "SubmissionAuthorisedInd", "Y");
		else
			return returnOPVJson(rval);
		
		if(rval == 0)
			rval = EasyclaimAPI.getInstance().setBusinessObjectElement(sessionId,"", "AccountReferenceId", "Y");
		else
			return returnOPVJson(rval);


		return null;
	}
	

	public Response returnOPVJson(int code)
	{
		JsonObject json = new JsonObject();
		JsonObject obj = new JsonObject();

		json.addProperty("code", code);
		json.addProperty("message", ini.get("ErrorCodes",String.valueOf(code)));
		obj.add("status",json);
		return Response.ok(obj.toString()).build();
	}
}

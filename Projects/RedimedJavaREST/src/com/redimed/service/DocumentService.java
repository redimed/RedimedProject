package com.redimed.service;

import groovyjarjarasm.asm.tree.TryCatchBlockNode;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import java.util.HashMap;
import java.util.Map;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.type.WhenNoDataTypeEnum;
import net.sf.jasperreports.engine.util.JRLoader;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.mysql.jdbc.Driver;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.FileInputStream;

import util.Database;

import com.redimed.service.AudioBean;

	
@Path("document")
public class DocumentService {
	@Path("{report}/{id}")
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response printGorgon(@PathParam("report") String report, 
								@PathParam("id") int id)
								
						{
        try {
        	HashMap params = new HashMap();
        	
        	//Gorgon MH
        	if(report.equalsIgnoreCase("gorgonMH"))
        	{
        		
        		params.put("id", id);
        		params.put("realPath", "/reports/Gorgon/");
                
                return downloadReport("/reports/Gorgon/GorgonMHReport.jasper", params, "gorgonMH.pdf");
        	}
        	
        	//Gorgon FA
        	if(report.equalsIgnoreCase("gorgonFA"))
        	{
        		params.put("id", id);
        		params.put("realPath", "/reports/Gorgon/");
                
                return downloadReport("/reports/Gorgon/GorgonFCAReport.jasper", params, "gorgonFA.pdf");
        	}
        	
        	//Gorgon MA
        	if(report.equalsIgnoreCase("gorgonMA"))
        	{
        		params.put("id", id);
        		params.put("realPath", "/reports/Gorgon/");
                
                return downloadReport("/reports/Gorgon/gorgonMAReport.jasper", params, "gorgonMA.pdf");
        	}
        	
        	//Gorgon UQ
        	if(report.equalsIgnoreCase("gorgonUQ"))
        	{
        		params.put("id", id);
        		params.put("realPath", "/reports/Gorgon/");
                
                return downloadReport("/reports/Gorgon/UserQuestionnaireReport.jasper", params, "gorgonUQ.pdf");
        	}
        	
        	//COE
        	if(report.equalsIgnoreCase("coe"))
        	{
        		params.put("key", id);
        		params.put("real_path", "/reports/COE/");
                
                return downloadReport("/reports/COE/COE.jasper", params, "COE.pdf");
        	}
        	
        	//Form18
        	if(report.equalsIgnoreCase("form18"))
        	{
        		params.put("key", id);
        		params.put("real_path", "/reports/AF18");
                
                return downloadReport("/reports/AF18/from18.jasper", params, "Form18.pdf");
        	}
        	
        	//MA
        	if(report.equalsIgnoreCase("ma"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/MA");
                
                return downloadReport("/reports/MA/MedicalAssessmentReport.jasper", params, "MedicalAssessmentReport.pdf");
        	}
        	
        	//MH
        	if(report.equalsIgnoreCase("mh"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/MH/");
                
                return downloadReport("/reports/MH/mh_report.jasper", params, "MedicalHistoryReport.pdf");
        	}
        	
        	//MRS
        	if(report.equalsIgnoreCase("mrs"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/MRS/");
                
                return downloadReport("/reports/MRS/result_summary.jasper", params, "MedicalResultSummary.pdf");
        	}
        	
        	//First WA
        	if(report.equalsIgnoreCase("firstWA"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/FirstWA/");
                
                return downloadReport("/reports/FirstWA/FirstWA.jasper", params, "FirstWA.pdf");
        	}
        	
        	//Progress WA
        	if(report.equalsIgnoreCase("progressWA"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/ProgressWA/");
                
                return downloadReport("/reports/ProgressWA/ProgressWA.jasper", params, "ProgressWA.pdf");
        	}
        	
        	//Final WA
        	if(report.equalsIgnoreCase("finalWA"))
        	{
        		params.put("id", id);
        		params.put("real_path", "/reports/FinalWA/");
                
                return downloadReport("/reports/FinalWA/FinalWA.jasper", params, "FinalWA.pdf");
        	}
        	
        	
        	
            
        } catch (Exception e) {
            e.printStackTrace();
        }        
        
        return Response.status(Response.Status.BAD_REQUEST).build();
	}
	
	@Path("{report}/{id}/{calId}/{patientId}")
	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response printDocument(@PathParam("report") String report, 
								  @PathParam("id") int id,
								  @PathParam("calId") int calId,
								  @PathParam("patientId") int patientId){
		try {
        	HashMap params = new HashMap();
        	
        	//CAT 2
        	if(report.equalsIgnoreCase("cat2"))
        	{
        		params.put("cal_id", calId);
        		params.put("real_path", "/reports/CAT2");
        		params.put("patient_id",patientId);
        		params.put("key",id);
        		
        		return downloadReport("/reports/CAT2/category_2.jasper", params, "Category2.pdf");
        	}
        	
        	//CAT 3
        	if(report.equalsIgnoreCase("cat3"))
        	{
        		params.put("cal_id", calId);
        		params.put("real_path", "/reports/CAT3");
        		params.put("patient_id",patientId);
        		params.put("key",id);
        		
        		return downloadReport("/reports/CAT3/category_3.jasper", params, "Category3.pdf");
        	}
        	
        	//FA
        	if(report.equalsIgnoreCase("fa"))
        	{
        		params.put("cal_id", calId);
        		params.put("real_path", "/reports/FA/");
        		params.put("patient_id",patientId);
        		params.put("key",id);
        		
        		return downloadReport("/reports/FA/cln_fa_header.jasper", params, "FunctionalAssessment.pdf");
        	}
        	
        	//IDS
        	if(report.equalsIgnoreCase("ids"))
        	{
        		params.put("cal_id", calId);
        		params.put("real_path", "/reports/IDAS");
        		params.put("patient_id",patientId);
        		params.put("key",id);
        		
        		return downloadReport("/reports/IDAS/idas_report.jasper", params, "IDS.pdf");
        	}
        	
        	//SA1
        	if(report.equalsIgnoreCase("sa1"))
        	{
        		Connection connection = Database.getConnection();
        		PreparedStatement ps = null;
        		ResultSet rs = null;
        		String name,valueLeft,valueRight;
        		try
        		{
        			
        			JsonArray array = new JsonArray();
        			
        			ps = connection.prepareStatement("SELECT c.Name,c.VALUE_RIGHT,c.VALUE_LEFT FROM cln_sa_df_lines c WHERE c.patient_id = ? AND c.CAL_ID=? AND c.SA_ID=?");
        			ps.setInt(1, patientId);
        			ps.setInt(2, calId);
        			ps.setInt(3, id);
        			
        			rs = ps.executeQuery();
        			while (rs.next()) {
        				 JsonObject json = new JsonObject();
        				
    					 name = rs.getString("Name");
        				 valueLeft = rs.getString("VALUE_LEFT");
        				 valueRight = rs.getString("VALUE_RIGHT");
        				
        				json.addProperty("Name", name);
        				json.addProperty("VALUE_LEFT", valueLeft);
        				json.addProperty("VALUE_RIGHT", valueRight);
        				
        				array.add(json);
        			}
        			
        			
        			BufferedImage img = AudioBean.getImageChart(array.toString(), true);
        			
        			params.put("cal_id", calId);
            		params.put("patient_id",patientId);
            		params.put("sa_id",id);
            		params.put("real_path","/reports/SACln/");
            		params.put("result_image",img);
        			
            		return downloadReport("/reports/SACln/Government.jasper", params, "Audiogram_1.pdf");
        		}
        		catch(Exception e)
        		{
        			throw e;
        		}
        		finally {
        			if(rs != null)
        			{
        				rs.close();
        			}
        			
        			if (ps != null) {
        				ps.close();
        			}
         
        			if (connection != null) {
        				connection.close();
        			}
         
        		}
        		
        	}
        	
        	//SA2
        	if(report.equalsIgnoreCase("sa2"))
        	{
        		Connection connection = Database.getConnection();
        		PreparedStatement ps = null;
        		ResultSet rs = null;
        		String name,valueLeft,valueRight;
        		try
        		{
        			
        			JsonArray array = new JsonArray();
        			
        			ps = connection.prepareStatement("SELECT c.Name,c.VALUE_RIGHT,c.VALUE_LEFT FROM cln_sa_df_lines c WHERE c.patient_id = ? AND c.CAL_ID=? AND c.SA_ID=?");
        			ps.setInt(1, patientId);
        			ps.setInt(2, calId);
        			ps.setInt(3, id);
        			
        			rs = ps.executeQuery();
        			while (rs.next()) {
        				JsonObject json = new JsonObject(); 
        				
        				 name = rs.getString("Name");
        				 valueLeft = rs.getString("VALUE_LEFT");
        				 valueRight = rs.getString("VALUE_RIGHT");
        				
        				json.addProperty("Name", name);
        				json.addProperty("VALUE_LEFT", valueLeft);
        				json.addProperty("VALUE_RIGHT", valueRight);
        				
        				array.add(json);
        			}
        			
        			
        			
        			BufferedImage img = AudioBean.getImageChart(array.toString(), false);
        			
        			params.put("cal_id", calId);
            		params.put("patient_id",patientId);
            		params.put("sa_id",id);
            		params.put("result_image",img);
        			
            		return downloadReport("/reports/SACln/Redimed.jasper", params, "Audiogram_2.pdf");
        		}
        		catch(Exception e)
        		{
        			throw e;
        		}
        		finally {
        			if(rs != null)
        			{
        				rs.close();
        			}
        			
        			if (ps != null) {
        				ps.close();
        			}
         
        			if (connection != null) {
        				connection.close();
        			}
         
        		}
        		
        	}
            
        } catch (Exception e) {
            e.printStackTrace();
        }        
        
        return Response.status(Response.Status.BAD_REQUEST).build();
		
		
	}
	
	
	public Response downloadReport(String reportPath, HashMap<String, Object> params, String fileName)
	{
		 	Connection connection = null;
	        Statement statement = null;
	        try {
	        	
	            connection = Database.getConnection();
	            statement = connection.createStatement();
	            
	            InputStream fs = DocumentService.class.getResourceAsStream(reportPath);
	            JasperReport template = (JasperReport) JRLoader.loadObject(fs);
	            template.setWhenNoDataType(WhenNoDataTypeEnum.ALL_SECTIONS_NO_DETAIL);
	            JasperPrint print = JasperFillManager.fillReport(template, params, connection);
	            ByteArrayOutputStream baos = new ByteArrayOutputStream();
	            JasperExportManager.exportReportToPdfStream(print, baos);
	            byte[] bytes = baos.toByteArray();
	            
	            return Response.ok(bytes, "application/pdf") 
	                    .header("content-disposition", "attachment; filename = "+ fileName)
	                    .build();
	            
	            
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            try {
	                statement.close();
	                connection.close();
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        }
	        return Response.status(Response.Status.BAD_REQUEST).build();
	}
	
   
}

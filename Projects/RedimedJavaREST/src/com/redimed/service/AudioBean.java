package com.redimed.service;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Stroke;
import java.awt.geom.Line2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.redimed.service.Coordinate;
import com.google.gson.Gson;




public class AudioBean {
	
    public AudioBean() {
    	
    }
    
    public static void main(String[] args)
    {
    	
       	
    }

    public static BufferedImage getImageChart( String arrData, Boolean isGovernment) {
        // InputStream asStream = ClnSaBeans.class.getResourceAsStream("/saClnView/image/redimed.png");
    	
    	
    	Gson gson = new Gson();

    	String filePath = isGovernment ? "/images/Government.png" : "/images/Redimed.png";    	

        try {
			InputStream asStream = AudioBean.class.getResourceAsStream(filePath);
			
	        BufferedImage img = null;
	        
	        AudioModel[] allRows = gson.fromJson(arrData, AudioModel[].class);
	        Double yValue = 2.1;
	        try {
	            img = ImageIO.read(asStream);
	            Graphics2D g = img.createGraphics();
	            for (int i = 0, y = 1; i < allRows.length - 1; i++, y++) {
	                AudioModel rowY =  (AudioModel) allRows[y];
	                AudioModel rowX = (AudioModel) allRows[i];
	                
	                
	                drawPoint(g, String.valueOf(rowX.getName()), Integer.valueOf(rowX.getVALUE_LEFT()), true, isGovernment ? true : false);
	                drawPoint(g,String.valueOf(rowX.getName()), Integer.valueOf(rowX.getVALUE_RIGHT()), false, isGovernment ? true : false);
	                if (y == allRows.length - 1) {
	                    drawPoint(g, String.valueOf(rowY.getName()), Integer.valueOf(rowY.getVALUE_LEFT()), true,  isGovernment ? true : false);
	                    drawPoint(g, String.valueOf(rowY.getName()), Integer.valueOf(rowY.getVALUE_RIGHT()), false,  isGovernment ? true : false);
	                }

	                drawLine(g, String.valueOf(rowX.getName()), String.valueOf(rowY.getName()), Integer.valueOf(rowX.getVALUE_LEFT()),
	                         Integer.valueOf(rowY.getVALUE_LEFT()), true, isGovernment ? true : false);
	                drawLine(g, String.valueOf(rowX.getName()), String.valueOf(rowY.getName()), Integer.valueOf(rowX.getVALUE_RIGHT()),
	                         Integer.valueOf(rowY.getVALUE_RIGHT()), false, isGovernment ? true : false);
	            }
	           
	            
	            String imgStr;
	            imgStr = "data:image/png;base64," + encodeToString(img, "png");
	            
	            BufferedImage image = null;
	            byte[] imageByte;
	            try {
	                BASE64Decoder decoder = new BASE64Decoder();
	                imageByte = decoder.decodeBuffer(imgStr != null ? imgStr.substring(22) : null);
	                ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
	                image = ImageIO.read(bis);
	                bis.close();
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	            
	           
	            
	            return image;

	            
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
       	
        return null;
    }

    private static void drawLine(Graphics2D g, String name1, String name2, Integer value1, Integer value2, Boolean isBlue, Boolean isGovernment) {
       
        Coordinate coordinate1 =
            isGovernment ? getMapGov().get(name1) : getMap().get(name1);
        Coordinate coordinate2 =
    		isGovernment ? getMapGov().get(name2) : getMap().get(name2);
        g.setStroke(new BasicStroke(new Float(1.8)));
        g.setColor(isBlue ? Color.blue : Color.red);
        double yRate = isGovernment ? 4.6 : 4.1;
        if (coordinate1 != null && value1 != null && value2 != null && coordinate2 != null) {
            Integer x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            x1 = coordinate1.getX();
            y1 = ((Double) (coordinate1.getY() + (yRate * value1))).intValue();
            x2 = coordinate2.getX();
            y2 = ((Double) (coordinate1.getY() + (yRate * value2))).intValue();
            g.draw(new Line2D.Double(x1, y1, x2, y2));
        }
    }

    private static void drawPoint(Graphics2D g, String name, Integer value, Boolean isBlue, Boolean isGovernment) {
        
        g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 20));
        g.setColor(isBlue ? Color.blue : Color.red);
        Coordinate coordinate =
            isGovernment ? getMapGov().get(name) : getMap().get(name);
        double yRate = isGovernment ? 4.6 : 4.1;
        if (coordinate != null && value != null) {
            Integer x = 0, y = 0;
            x = coordinate.getX() - 8;
            y = ((Double) (coordinate.getY() + (yRate * value))).intValue() + 5;
            g.drawString(isBlue ? "X" : "O", x, y);

        }
    }


    private static Map<String, Coordinate> getMap() {
        Map<String, Coordinate> dic = new HashMap<String, Coordinate>();
        dic.put("500", new Coordinate(157, 216)); // 0 0
        dic.put("1000", new Coordinate(246, 216)); // 1 0
        dic.put("1500", new Coordinate(339, 216)); // 2 0
        dic.put("2000", new Coordinate(435, 216)); // 3 0
        dic.put("3000", new Coordinate(529, 216)); // 4 0
        dic.put("4000", new Coordinate(622, 216)); // 5 0
        dic.put("6000", new Coordinate(712, 216)); // 6 0
        dic.put("8000", new Coordinate(806, 216)); // 7 0
        return dic;
    }

    private static Map<String, Coordinate> getMapGov() {
        Map<String, Coordinate> dic = new HashMap<String, Coordinate>();
        dic.put("500", new Coordinate(250, 112)); // 0 0
        dic.put("1000", new Coordinate(376, 112)); // 1 0
        dic.put("1500", new Coordinate(439, 112)); // 2 0
        dic.put("2000", new Coordinate(502, 112)); // 3 0
        dic.put("3000", new Coordinate(568, 112)); // 4 0
        dic.put("4000", new Coordinate(628, 112)); // 5 0
        dic.put("6000", new Coordinate(694, 112)); // 6 0
        dic.put("8000", new Coordinate(756, 112)); // 7 0
        return dic;
    }

    public static String encodeToString(BufferedImage image, String type) {
        String imageString = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        try {
            ImageIO.write(image, type, bos);
            byte[] imageBytes = bos.toByteArray();

            BASE64Encoder encoder = new BASE64Encoder();
            imageString = encoder.encode(imageBytes);

            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imageString;
    }
    
}

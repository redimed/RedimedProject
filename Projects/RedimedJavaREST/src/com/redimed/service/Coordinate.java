package com.redimed.service;

public class Coordinate {
    private Integer x ;
    private Integer y ;
    
    public Coordinate(){
        
    }
 
    public Coordinate(Integer x , Integer y){
        this.x = x ; 
        this.y= y;
    }
    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getX() {
        return x;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getY() {
        return y;
    }
   
}

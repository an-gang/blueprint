package com.WangDeFa.blueprint.entity;

public class Blueprint {
    private String name;
    private String front;
    private String back;

    public Blueprint(String name, String front, String back) {
        this.name = name;
        this.front = front;
        this.back = back;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }
}

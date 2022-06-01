package com.WangDeFa.blueprint.other;

public class User {
    private String username;
    private String password;
    private String name;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User(String username, String password, String name) {
        this.username = username;
        this.password = password;
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }
}

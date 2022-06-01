package com.WangDeFa.blueprint.controller;

import com.WangDeFa.blueprint.other.User;
import com.WangDeFa.blueprint.service.Auth_Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;

@RestController
public class Auth_Controller {
    @Resource
    private Auth_Service service;

    @RequestMapping("/login")
    public HashMap<String, Object> login(String username, String password) {
        return service.login(new User(username, password));
    }

    @RequestMapping("/getCurrentUser")
    public String getCurrentUser(HttpSession session) {
        if (session.getAttribute("currentUser") != null) {
            return (String) session.getAttribute("currentUser");
        } else {
            return "unLogged";
        }
    }

}

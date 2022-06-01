package com.WangDeFa.blueprint.service;

import com.WangDeFa.blueprint.other.User;
import com.WangDeFa.blueprint.repository.Auth_Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Objects;

@Service
public class Auth_Service{

    @Resource
    private Auth_Repository repository;

    public HashMap<String, Object> login(User user) {
        HashMap<String, Object> rtn = repository.login(user);
        if ("success".equals(rtn.get("status"))) {
            HttpSession session = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest().getSession();
            session.setAttribute("currentUser", rtn.get("currentUser"));
//            session.setAttribute("permissionLevel", rtn.get("permissionLevel"));
        }
        return rtn;
    }
}

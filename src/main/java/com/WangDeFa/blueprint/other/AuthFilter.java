package com.WangDeFa.blueprint.other;

import org.springframework.core.annotation.Order;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(urlPatterns = {"/*"})
@Order(1)
public class AuthFilter implements Filter {
    private String whiteList[] = new String[]{
            "/",
            "/favicon.ico",
            "/lib/jquery-3.6.0.min.js",
            "/lib/jquery.mousewheel.min.js",
            "/lib/jszip.min.js",
            "/index.html",
            "/index.js",
            "/index.css",
            "/login.html",
            "/login.js",
            "/login.css",
            "/login",
            "/getBlueprintList",
            "/getCurrentUser"
    };

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String uri = request.getRequestURI();
//        System.out.println(uri);
        if (inWhiteList(uri)) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            HttpSession session = request.getSession();
            if (session.getAttribute("currentUser") != null) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                if("XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With"))){
                    //是Ajax请求
                    response.getWriter().write("Haven't login");
                    response.setStatus(401);
                }else{
                    response.sendRedirect(request.getContextPath() + "/login.html");
                }
            }
        }
    }

    private boolean inWhiteList(String uri) {
        for (String path : whiteList) {
            if (path.equals(uri)) {
                return true;
            }
        }
        return false;
    }


}

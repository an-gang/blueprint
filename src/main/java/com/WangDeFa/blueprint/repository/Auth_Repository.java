package com.WangDeFa.blueprint.repository;

import com.WangDeFa.blueprint.other.User;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class Auth_Repository {

    @Resource
    private JdbcTemplate template;

    public HashMap<String, Object> login(User user) {
        HashMap<String, Object> rtn = new HashMap<>();
        try {
            String sql = "SELECT * FROM user WHERE username=? AND password=?";
            List<Map<String, Object>> result = template.queryForList(sql, user.getUsername(), user.getPassword());
            if (result.size() > 0) {
                rtn.put("status", "success");
                Map<String, Object> userEntry = result.get(0);
                if (userEntry.get("name") != "" && userEntry.get("name") != null) {
                    rtn.put("currentUser", userEntry.get("name"));
                } else {
                    rtn.put("currentUser", userEntry.get("username"));
                }
            } else {
                rtn.put("status", "failed");
                rtn.put("message", "incorrect email or password!");
            }
        } catch (DataAccessException e) {
            rtn.put("status", "exception");
            rtn.put("message", "server exception");
            System.out.println(e.getMessage());
        }
        return rtn;
    }


//    public HashMap<String, Object> checkUserName(String email) {
//        HashMap<String, Object> rtn = new HashMap<>();
//        try {
//            String sql = "select COUNT(*) from user where email='" + email + "'";
//            int result = template.queryForObject(sql, Integer.class);
//            if (result == 0) {
//                rtn.put("status", "available");
//            } else {
//                rtn.put("status", "unavailable");
//            }
//        } catch (DataAccessException e) {
//            rtn.put("status", "exception");
//            rtn.put("message", "server exception");
//            System.out.println(e.getMessage());
//        }
//        return rtn;
//    }

}

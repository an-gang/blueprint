package com.WangDeFa.blueprint.repository;

import com.WangDeFa.blueprint.entity.Blueprint;
import com.WangDeFa.blueprint.entity.Tools;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class Main_Repository implements Main_Repository_Interface {

    @Resource
    private JdbcTemplate template;

    @Override
    public String uploadBlueprint(Blueprint blueprint) {
        try {
            String sql = "INSERT INTO blueprint (blueprintID,name,front,back) VALUES (?,?,?,?)";
            template.update(sql, Tools.getUUID(), blueprint.getName(), blueprint.getFront(), blueprint.getBack());
            return "上传完成";
        } catch (DataAccessException e) {
            if (e.getCause().getMessage().contains("Duplicate") && e.getCause().getMessage().contains("PRIMARY")) {
                return uploadBlueprint(blueprint);
            } else {
                return "服务器异常";
            }
        }
    }

    @Override
    public HashMap<String, Object> getBlueprintList() {
        HashMap<String, Object> rtn = new HashMap<>();
        try {
            String sql = "SELECT name FROM blueprint";
            List<Map<String, Object>> result = template.queryForList(sql);
            rtn.put("status", "success");
            rtn.put("data", result);
        } catch (DataAccessException e) {
            rtn.put("status", "exception");
        }
        return rtn;
    }

    @Override
    public String getFrontByName(String name) {
        try {
            String sql = "SELECT front FROM blueprint WHERE name=?";
            List<Map<String, Object>> result = template.queryForList(sql, name);
            return (String) result.get(0).get("front");
        } catch (DataAccessException e) {
            return "服务器异常";
        }
    }
}

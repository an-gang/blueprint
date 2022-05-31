package com.WangDeFa.blueprint.service;

import com.WangDeFa.blueprint.entity.Blueprint;
import com.WangDeFa.blueprint.repository.Main_Repository;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.HashMap;

@Service
public class Main_Service {

    @Resource
    private Main_Repository repository;

    public String uploadBlueprint(Blueprint blueprint) {
        return repository.uploadBlueprint(blueprint);
    }

    public HashMap<String, Object> getBlueprintList() {
        return repository.getBlueprintList();
    }

    public String getFrontByName(String name) {
        return repository.getFrontByName(name);
    }

    public String getBackByName(String name) {
        return repository.getBackByName(name);
    }
}

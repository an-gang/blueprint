package com.WangDeFa.blueprint.service;

import com.WangDeFa.blueprint.entity.Blueprint;
import com.WangDeFa.blueprint.repository.Main_Repository_Interface;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.HashMap;

@Service
public class Main_Service implements Main_Service_Interface {

    @Resource
    private Main_Repository_Interface repository;

    @Override
    public String uploadBlueprint(Blueprint blueprint) {
        return repository.uploadBlueprint(blueprint);
    }

    @Override
    public HashMap<String, Object> getBlueprintList() {
        return repository.getBlueprintList();
    }

    @Override
    public String getFrontByName(String name) {
        return repository.getFrontByName(name);
    }
}

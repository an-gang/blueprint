package com.WangDeFa.blueprint.service;

import com.WangDeFa.blueprint.entity.Blueprint;

import java.util.HashMap;

public interface Main_Service_Interface {
    String uploadBlueprint(Blueprint blueprint);
    HashMap<String, Object> getBlueprintList();
    String getFrontByName(String name);
}

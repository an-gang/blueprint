package com.WangDeFa.blueprint.repository;

import com.WangDeFa.blueprint.entity.Blueprint;

import java.util.HashMap;

public interface Main_Repository_Interface {
    String uploadBlueprint(Blueprint blueprint);
    HashMap<String, Object> getBlueprintList();
    String getFrontByName(String name);
}

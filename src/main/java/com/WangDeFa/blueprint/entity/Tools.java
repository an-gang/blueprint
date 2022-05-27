package com.WangDeFa.blueprint.entity;

import java.util.UUID;

public class Tools {
    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}

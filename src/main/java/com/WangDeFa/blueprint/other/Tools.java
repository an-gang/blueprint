package com.WangDeFa.blueprint.other;

import java.util.UUID;

public class Tools {
    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}

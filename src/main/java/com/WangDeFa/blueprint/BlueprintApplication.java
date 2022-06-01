package com.WangDeFa.blueprint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class BlueprintApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlueprintApplication.class, args);
    }

}

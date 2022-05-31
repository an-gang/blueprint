package com.WangDeFa.blueprint.controller;

import com.WangDeFa.blueprint.entity.Blueprint;
import com.WangDeFa.blueprint.service.Main_Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.util.HashMap;


@RestController
public class Main_Controller {

    @Resource
    private Main_Service service;

    @RequestMapping("/uploadBlueprint")
    public String uploadBlueprint(String name, String front, String back) {
        return service.uploadBlueprint(new Blueprint(name, front, back));
    }

    @RequestMapping("/getBlueprintList")
    public HashMap<String, Object> getBlueprintList() {
        return service.getBlueprintList();
    }

    @CrossOrigin("*")//TODO
    @RequestMapping("/getFrontByName")
    public String getFrontByName(String name) {
        return service.getFrontByName(name);
    }

    @CrossOrigin("*")//TODO
    @RequestMapping("/getBackByName")
    public String getBackByName(String name) {
        return service.getBackByName(name);
    }

    @RequestMapping("/admin")
    public ModelAndView admin(){
        return new ModelAndView("admin.html");
    }
}

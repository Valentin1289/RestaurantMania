package com.codecooll.RestaurantMania.controllers;

import com.codecooll.RestaurantMania.restaurant.model.Menu;
import com.codecooll.RestaurantMania.services.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = "/menu")
public class MenuController {
    private MenuService menuService;

    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping(path = "/delete/{menuId}")
    public ResponseEntity<Menu> deleteMenuById(@PathVariable Long menuId){
       return ResponseEntity.ok( menuService.deleteById(menuId));
    }

}

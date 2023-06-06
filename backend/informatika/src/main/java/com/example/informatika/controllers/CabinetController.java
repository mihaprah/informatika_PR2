package com.example.informatika.controllers;

import com.example.informatika.models.Cabinet;
import com.example.informatika.services.CabinetService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/cabinet")
public class CabinetController {
    private CabinetService cabinetService;
    @GetMapping
    public Iterable<Cabinet> getAll(){
        return cabinetService.getAll();
    }
    @GetMapping("/{cabinet_id}")
    public Cabinet getById(@PathVariable("cabinet_id") String id){
        return cabinetService.getById(id);
    }
    @PutMapping
    public void updateCabinet(@RequestBody Cabinet cabinet){
        cabinetService.updateCabinet(cabinet);
    }
    @PutMapping("/settings")
    public void updateCabinetSettings(@RequestBody Cabinet cabinet) {
        cabinetService.updateCabinetSettings(cabinet);
    }
}

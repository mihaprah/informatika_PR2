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
    @PostMapping
    public void saveCabinet(@RequestBody Cabinet cabinet){
        cabinetService.addCabinet(cabinet);
    }
    @PutMapping
    public void updateCabinet(@RequestBody Cabinet cabinet){
        cabinetService.updateCabinet(cabinet);
    }
    @DeleteMapping("/{cabinet_id}")
    public void deleteCabinet(@PathVariable("cabinet_id") String id){
        cabinetService.deleteCabinet(id);
    }
}

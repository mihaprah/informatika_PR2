package com.example.informatika.controllers;


import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import com.example.informatika.services.MeasurementDataService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/data")
public class MeasurementDataController {
    private MeasurementDataService measurementDataService;

    @GetMapping
    public Iterable<MeasurementData> getAll(){
        return measurementDataService.getAll();
    }

    @GetMapping("/{date}/{cabinetId}")
    public MeasurementData getByDate(@PathVariable("date")LocalDate date, @PathVariable("cabinetId") String cabinetId){
        return measurementDataService.getByDate(date, cabinetId);
    }

    @PostMapping
    public void saveMeasurementData(@RequestBody MeasurementData data){
        measurementDataService.addMeasurementData(data);
    }

    @PutMapping
    public void updateMeasurementData(@RequestBody MeasurementData data){
        measurementDataService.updateMeasurementData(data);
    }

    @DeleteMapping("/{id}")
    public void deleteMeasurementData(@PathVariable("id") Long id){
        measurementDataService.deleteMeasurementData(id);
    }
}

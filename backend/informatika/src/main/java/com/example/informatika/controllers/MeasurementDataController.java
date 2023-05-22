package com.example.informatika.controllers;


import com.example.informatika.models.MeasurementData;
import com.example.informatika.services.MeasurementDataService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/measurement")
public class MeasurementDataController {
    private MeasurementDataService measurementDataService;

    @GetMapping
    public Iterable<MeasurementData> getAll(){
        return measurementDataService.getAll();
    }

    @GetMapping("/{date}/{cabinet_id}")
    public MeasurementData getByDate(@PathVariable("date") Date date, @PathVariable("cabinet_id") String cabinetId){
        return measurementDataService.getByDate(date, cabinetId);
    }
    @GetMapping("/{cabinet_id}")
    public Iterable<MeasurementData> getByCabinet(@PathVariable("cabinet_id") String cabinetId){
        return measurementDataService.getAllByCabinet(cabinetId);
    }

    @PostMapping
    public void saveMeasurementData(@RequestBody MeasurementData data){
        measurementDataService.addMeasurementData(data);
    }

    @PutMapping
    public void updateMeasurementData(@RequestBody MeasurementData data){
        measurementDataService.updateMeasurementData(data);
    }

    @DeleteMapping("/{measurement_id}")
    public void deleteMeasurementData(@PathVariable("measurement_id") Long id){
        measurementDataService.deleteMeasurementData(id);
    }
}

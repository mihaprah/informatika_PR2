package com.example.informatika.controllers;


import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.MeasurementData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/data")
public class MeasurementDataController {

    //@Autowired
    private MeasurementDataRepository measurementDataDao;

    @GetMapping
    public Iterable<MeasurementData> getAllMeasurementdata(){
        return measurementDataDao.findAll();
    }

    @GetMapping("/{identMM}")
    public Iterable<MeasurementData> getAllidentMM(@PathVariable(name = "identMM") String identMM){
        return measurementDataDao.findMeasurementDataBy(identMM);
    }

}

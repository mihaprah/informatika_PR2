package com.example.informatika.controllers;


import com.example.informatika.models.MeasurementData;
import com.example.informatika.services.MeasurementDataService;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @GetMapping("/{cabinet_id}")
    public Iterable<MeasurementData> getByCabinet(@PathVariable("cabinet_id") String cabinetId){
        System.out.println(cabinetId);
        return measurementDataService.getAllByCabinet(cabinetId);
    }

    @GetMapping("/day/{cabinet_id}/{day}")
    public Iterable<MeasurementData> getByDate(@PathVariable("day") String day, @PathVariable("cabinet_id") String cabinetId){
        return measurementDataService.getAllByCabinetByDay(cabinetId, day);
    }

    @GetMapping("/month/{cabinet_id}/{month}")
    public Iterable<MeasurementData> getByCabinetByMonth(@PathVariable("cabinet_id") String cabinetId, @PathVariable("month") String month){
        return measurementDataService.getAllByCabinetByMonth(cabinetId, month);
    }
    @GetMapping("/year/{cabinet_id}/{year}")
    public Iterable<MeasurementData> getByCabinetByYear(@PathVariable("cabinet_id") String cabinetId, @PathVariable("year") String year){
        return measurementDataService.getAllByCabinetByYear(cabinetId, year);
    }
    @GetMapping("/usage/{cabinet_id}/{date}")
    public double getUsageAmountForYear(@PathVariable("cabinet_id") String cabinetId, @PathVariable("date") String date){
        return measurementDataService.getSumOfUsageForYear(cabinetId, date);
    }

    @GetMapping("/lowHighUsage/{cabinet_id}/{date}")
    public double[] getLowHighUsageAmountForYear(@PathVariable("cabinet_id") String cabinetId, @PathVariable("date") String date){
        return measurementDataService.getSumOfLowUsageHighUsagaForYear(cabinetId, date);
    }

    @GetMapping("/year/month/{cabinet_id}/{date}")
    public List<JSONObject> getYearPerMonths(@PathVariable("cabinet_id") String cabinetId, @PathVariable("date") String date){
        return measurementDataService.getUsagePerMonths(cabinetId, date);
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

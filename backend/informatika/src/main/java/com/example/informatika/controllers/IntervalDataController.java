package com.example.informatika.controllers;

import com.example.informatika.models.IntervalData;
import com.example.informatika.services.IntervalDataService;
import lombok.AllArgsConstructor;
import lombok.Generated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/interval")
public class IntervalDataController {

    private IntervalDataService intervalDataService;

    @GetMapping("/{cabinet_id}/{day}")
    public Iterable<IntervalData> getForOneDay(@PathVariable("cabinet_id") String cabinetId, @PathVariable("day") String day){
        return intervalDataService.getIntervalForOneDay(cabinetId, day);
    }
}

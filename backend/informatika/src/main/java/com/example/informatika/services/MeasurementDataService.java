package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class MeasurementDataService {
    private MeasurementDataRepository measurementDataDao;
    private CabinetRepository cabinetDao;

    public Iterable<MeasurementData> getAll(){
        return measurementDataDao.findAll();
    }
    public MeasurementData getByDate(String date, String cabinetId){
        LocalDate localDate = LocalDate.parse(date);
        Iterable<MeasurementData> allData = getAll();
        for (MeasurementData data: allData) {
            if(data.getDate().equals(localDate) && data.getCabinet().getCabinetId().equals(cabinetId)) {
                return data;
            }
        }
        return null;
    }
    public Iterable<MeasurementData> getAllByCabinet(String cabinetId){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        return measurementDataDao.findByCabinet(cabinet);
    }

    public Iterable<MeasurementData> getAllByCabinetByMonth(String cabinetId, String month){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(month);
        LocalDate endDate = startDate.plusMonths(1);
        return measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
    }
    public void addMeasurementData(MeasurementData newMeasurementData){
        measurementDataDao.save(newMeasurementData);
    }
    public void updateMeasurementData(MeasurementData measurementData){
        MeasurementData updatedData = measurementDataDao.findById(measurementData.getId()).orElseThrow(() -> new IllegalCallerException("Cabinet does not exist"));

        updatedData.setCabinet(measurementData.getCabinet());
        updatedData.setDate(measurementData.getDate());
        updatedData.setRegister(measurementData.getRegister());
        updatedData.setUsage(measurementData.getUsage());

        measurementDataDao.save(updatedData);
    }

    public void deleteMeasurementData(Long id){
        measurementDataDao.deleteById(id);
    }

}

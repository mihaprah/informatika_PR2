package com.example.informatika.services;

import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.MeasurementData;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
public class MeasurementDataService {
    private MeasurementDataRepository measurementDataDao;

    public Iterable<MeasurementData> getAll(){
        return measurementDataDao.findAll();
    }
    public MeasurementData getByDate(Date date, String cabinetId){
        Iterable<MeasurementData> allData = getAll();
        for (MeasurementData data: allData) {
            if(data.getDate().equals(date) && data.getCabinet().getCabinetId().equals(cabinetId)) {
                return data;
            }
        }
        return null;
    }
    public Iterable<MeasurementData> getAllByCabinet(String cabinetId){
        return measurementDataDao.findByCabinet(cabinetId);
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

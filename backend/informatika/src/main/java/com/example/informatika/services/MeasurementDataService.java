package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

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

    public Iterable<MeasurementData> getAllByCabinetByDay(String cabinetId, String day){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(day).minusDays(10);
        LocalDate endDate = LocalDate.parse(day);
        return measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
    }

    public Iterable<MeasurementData> getAllByCabinetByMonth(String cabinetId, String date){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
    }

    public Iterable<MeasurementData> getAllByCabinetByYear(String cabinetId, String date){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate.plusYears(1).minusDays(1);
        return measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
    }

    public List<JSONObject> getUsagePerMonths(String cabinetId, String date){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate.plusYears(1).minusDays(1);
        Iterable<MeasurementData> data = measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);

        List<JSONObject> yearData = new ArrayList<>();

        for(int i =  1; i < 13;i++){
            JSONObject newData = new JSONObject();
            Month month = Month.of(i);
            newData.put("name", month.name());
            newData.put("correctValue", 0.00);
            newData.put("modifiedValue", 0.00);
            newData.put("invalidValue", 0.00);
            yearData.add(newData);
        }

        for (MeasurementData day : data) {
            String targetMonth = "";
            switch (day.getDate().getMonth()) {
                case JANUARY:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case FEBRUARY:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case MARCH:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case APRIL:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case MAY:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case JUNE:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case JULY:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case AUGUST:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case SEPTEMBER:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case OCTOBER:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case NOVEMBER:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
                case DECEMBER:
                    targetMonth = day.getDate().getMonth().toString();
                    break;
            }

            for (JSONObject monthData : yearData) {
                String monthName = monthData.getAsString("name");
                if (monthName.equals(targetMonth)) {
                    if (day.isFilledWithZeros()) {
                        double correctValue = (double) monthData.getAsNumber("correctValue");
                        double newCorrectValue = correctValue + day.getUsage();
                        monthData.put("correctValue", newCorrectValue);
                    } else if (day.isModifiedWithEvenDatesStrategy()) {
                        double modifiedValue = (double) monthData.getAsNumber("modifiedValue");
                        double newModifiedValue = modifiedValue + day.getUsage();
                        monthData.put("modifiedValue", newModifiedValue);
                    } else if (day.isInvalidFlag()) {
                        double invalidValue = (double) monthData.getAsNumber("invalidValue");
                        double newInvalidValue = invalidValue + day.getUsage();
                        monthData.put("invalidValue", newInvalidValue);
                    }
                    break;
                }
            }
        }
    return yearData;
    }


    public double getSumOfUsageForYear(String cabinetId, String date){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate.plusYears(1).minusDays(1);
        ArrayList<MeasurementData> data = (ArrayList<MeasurementData>) measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
        double result = 0;
        for(MeasurementData entry : data){
            result += entry.getUsage();
        }
        return result;
    }

    public double[] getSumOfLowUsageHighUsagaForYear(String cabinetId, String date){
        Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
        LocalDate startDate = LocalDate.parse(date);
        LocalDate endDate = startDate.plusYears(1).minusDays(1);
        ArrayList<MeasurementData> data = (ArrayList<MeasurementData>) measurementDataDao.findByCabinetAndDateBetween(cabinet, startDate, endDate);
        double low = 0;
        double high = 0;
        for(MeasurementData entry : data){
            low += entry.getLowUsage();
            high += entry.getHighUsage();
        }
        double[] usage = {low, high};
        return usage;
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

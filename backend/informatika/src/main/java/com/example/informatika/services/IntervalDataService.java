package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.dao.IntervalDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.IntervalData;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Service
@AllArgsConstructor
public class IntervalDataService {

    private IntervalDataRepository intervalDataDao;
    private CabinetRepository cabinetDao;
    public Iterable<IntervalData> getIntervalForOneDay(String cabinetId, String date){
        String pattern = "yyyy-MM-dd HH:mm:ss";
        date = date + " 00:00:00";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        Date normalDate;
        try {
            normalDate = simpleDateFormat.parse(date);
            Timestamp startDate = new Timestamp(normalDate.getTime());
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);

            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Timestamp endDate = new Timestamp(calendar.getTimeInMillis());

            Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
            return intervalDataDao.findByCabinetAndTimeStampBetween(cabinet, startDate, endDate);

        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    public Iterable<IntervalData> getIntervalForOneYear(String cabinetId, String date){
        String pattern = "yyyy-MM-dd HH:mm:ss";
        date = date + " 00:00:00";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        Date normalDate;
        try {
            normalDate = simpleDateFormat.parse(date);
            Timestamp startDate = new Timestamp(normalDate.getTime());
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);

            calendar.add(Calendar.YEAR, 1);
            Timestamp endDate = new Timestamp(calendar.getTimeInMillis());

            Cabinet cabinet = cabinetDao.findById(cabinetId).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
            return intervalDataDao.findByCabinetAndTimeStampBetween(cabinet, startDate, endDate);

        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}

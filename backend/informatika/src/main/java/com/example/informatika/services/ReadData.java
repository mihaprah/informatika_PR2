package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.dao.IntervalDataRepository;
import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.IntervalData;
import com.example.informatika.models.MeasurementData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.StreamSupport;

@Component
public class ReadData {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ReadData(DataSourceProperties dataSourceProperties) {
        this.jdbcTemplate = new JdbcTemplate(dataSourceProperties.initializeDataSourceBuilder().build());
    }

    @Autowired
    CabinetRepository cabinetDao;
    @Autowired
    MeasurementDataRepository measurementDataDao;
    @Autowired
    IntervalDataRepository intervalDataDao;

    public void readMerilniPodatki() {
//        Dynamic List of cabinet IDs
        Iterable<Cabinet> cabinets = cabinetDao.findAll();
        long numberOfCabinets = StreamSupport.stream(cabinets.spliterator(), false).count();
        int lengthOfArray = (int) numberOfCabinets;
        String [] cabinetIds = new String[lengthOfArray];
        int i = 0;
//        Get the Cabinets Ids and put them inside an array
        for (Cabinet cabinet : cabinets){
            cabinetIds[i] = cabinet.getCabinetId();
            i++;
        }
//        To sort the array so the Cabinet Ids are in ascending order
        Arrays.sort(cabinetIds, Comparator.comparingInt(s -> Integer.parseInt(s.split("-")[1])));

        try {
//            List of all result for getting the daily sum of the 15 min interval for each of the cabinets
            List<Map<String, Object>> intervalSumRows = new ArrayList<>();

//            List of all result for getting the daily usage with subtraction ([next day] - [current day]) for each of the cabinets
            List<Map<String, Object>> dailyUsageRows = new ArrayList<>();

            for (String cabinetId : cabinetIds){
//            Query for getting the sum of all 15 minute intervals for every day for individual cabinet
                String sumOfIntervalData = "SELECT" +
                    "    mp.enotni_ident_mm," +
                    "    DATE(mp.casovna_znacka) AS date," +
                    "    SUM(mp.a_plus) - COALESCE(vam.a_plus, 0) AS result" +
                    " FROM" +
                    "    merilni_podatki mp" +
                    " LEFT JOIN (" +
                    "    SELECT mp.casovna_znacka, mp.a_plus" +
                    "    FROM merilni_podatki mp" +
                    "    WHERE mp.enotni_ident_mm::text = '" + cabinetId +"'::text" +
                    "    AND date_trunc('day'::text, mp.casovna_znacka) = mp.casovna_znacka" +
                    "    ORDER BY mp.casovna_znacka" +
                    "    LIMIT 424" +
                    ") vam ON DATE(mp.casovna_znacka) = vam.casovna_znacka" +
                    " WHERE" +
                    "    mp.enotni_ident_mm = '" + cabinetId +"'" +
                    " GROUP BY" +
                    "    mp.enotni_ident_mm," +
                    "    DATE(mp.casovna_znacka)," +
                    "    vam.a_plus" +
                    " ORDER BY" +
                    "    DATE(mp.casovna_znacka)" +
                    " LIMIT 424;";


                List<Map<String, Object>> resultOne = jdbcTemplate.queryForList(sumOfIntervalData);
                intervalSumRows.addAll(resultOne);

//              Query for getting the daily usage with subtraction ([next day] - [current day]) every day for individual cabinet
                String dailyUsageData = "SELECT " +
                        "  t1.enotni_ident_mm AS cabinet_id, " +
                        "  DATE(t1.casovna_znacka) AS current_date," +
                        "  t1.a_plus_et AS current_value," +
                        "  t1.a_plus_et_24 AS current_value_24," +
                        "  DATE(t2.casovna_znacka) AS next_date," +
                        "  t2.a_plus_et AS next_value," +
                        "  t2.a_plus_et_24 AS next_value_24," +
                        "  t2.a_plus_et - t1.a_plus_et AS subtraction," +
                        "  t2.a_plus_et_24 - t1.a_plus_et_24 AS subtraction_24," +
                        "  t2.a_plus_vt - t1.a_plus_vt AS visokaPoraba," +
                        "  t2.a_plus_mt - t1.a_plus_mt AS nizkaPoraba" +
                        " FROM " +
                        "  (" +
                        "     SELECT " +
                        "      casovna_znacka," +
                        "      a_plus_et," +
                        "      a_plus_et_24," +
                        "      enotni_ident_mm," +
                        "      a_plus_vt," +
                        "      a_plus_mt," +
                        "      LAG(a_plus_et) OVER (ORDER BY casovna_znacka) AS prev_a_plus_et" +
                        "     FROM merilni_podatki_stanja" +
                        "     WHERE enotni_ident_mm = '" + cabinetId + "'" +
                        "      AND casovna_znacka = DATE(casovna_znacka)" +
                        "  ) t1" +
                        " JOIN " +
                        "  (" +
                        "     SELECT " +
                        "      casovna_znacka," +
                        "      a_plus_et," +
                        "      a_plus_et_24," +
                        "      a_plus_vt," +
                        "      a_plus_mt" +
                        "     FROM merilni_podatki_stanja" +
                        "     WHERE enotni_ident_mm = '" + cabinetId + "'" +
                        "      AND casovna_znacka = DATE(casovna_znacka)" +
                        "  ) t2 ON t1.casovna_znacka = t2.casovna_znacka - INTERVAL '1 day'" +
                        " ORDER BY t1.casovna_znacka;";

                List<Map<String, Object>> resultTwo = jdbcTemplate.queryForList(dailyUsageData);
                dailyUsageRows.addAll(resultTwo);
            }


            for(int j = 0; j < intervalSumRows.size(); j++){
                Map<String, Object> intervalRow = intervalSumRows.get(j);
                String enotniIdent = (String) intervalRow.get("enotni_ident_mm");
                Date date = (Date) intervalRow.get("date");
                BigDecimal result = (BigDecimal) intervalRow.get("result");

                Map<String, Object> dailyRow = dailyUsageRows.get(j);
                String cabinet_id = (String) dailyRow.get("cabinet_id");
                Date current_date = (Date) dailyRow.get("current_date");
                BigDecimal subtraction = (BigDecimal) dailyRow.get("subtraction");
                BigDecimal subtraction_24 = (BigDecimal) dailyRow.get("subtraction_24");
                BigDecimal visokaPoraba = (BigDecimal) dailyRow.get("visokaPoraba");
                BigDecimal nizkaPoraba = (BigDecimal) dailyRow.get("nizkaPoraba");

//                Create cabinet for any of the scenarios
                Cabinet cabinet = cabinetDao.findById(cabinet_id).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
//                Change the date format
                LocalDate currentDate = LocalDate.parse(date.toString());
//                Check if the cabinet numbers (ID) are the same
                if (Objects.equals(enotniIdent, cabinet_id)){
//                    Check if the dates are the same
                    if (date.equals(current_date)){
        //                Checking if we need to take the a_plus_et or a_plus_et_24. Always only one of them
                        BigDecimal dailyValue;
                        if (subtraction != null){
                            dailyValue = subtraction;
                        } else {
                            dailyValue = subtraction_24;
                        }
        //                Formula for the getting the percentage difference between the interval values and daily values
                        double checkDivison = result.doubleValue()/dailyValue.doubleValue();
                        if (checkDivison > 1){
//                            CASE 1 -> sum of interval is bigger then the daily value. Add flag invalid
                            MeasurementData data = new MeasurementData(currentDate, 0.0, cabinet);
                            data.setInvalidFlag(true);
                            data.setMeasuredValue(result.doubleValue());
                            if (data.getUsage() == 0){
                                data.setUsage(result.doubleValue());
                                data.setOnlyMeasuredValue(true);
                            }
                            measurementDataDao.save(data);
                        } else {
                            double divisionResult = (((result.doubleValue() / dailyValue.doubleValue())*100) - 100);
                            double absoluteResult = Math.abs(divisionResult);

                            if (absoluteResult <= 2){
            //                    CASE 1 -> ralika manj kot 2% (mankajoče podatke zapišemo z 0)
                                MeasurementData data = new MeasurementData(currentDate, dailyValue.doubleValue(), cabinet);
                                data.setFilledWithZeros(true);
                                if (visokaPoraba != null){
                                    data.setHighUsage(visokaPoraba.doubleValue());
                                }
                                if (nizkaPoraba != null){
                                    data.setLowUsage(nizkaPoraba.doubleValue());
                                }
                                data.setMeasuredValue(result.doubleValue());
                                if (data.getUsage() == 0){
                                    data.setUsage(result.doubleValue());
                                    data.setOnlyMeasuredValue(true);
                                }
                                measurementDataDao.save(data);
                            } else {
            //                    CASE 2 -> razlika več kot 2% (metoda instoležnih dni)
                                DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
                                String [] holidays = {"2022-01-01", "2022-01-02", "2022-02-08", "2022-04-18", "2022-04-27", "2022-05-01", "2022-05-02", "2022-06-25",
                                        "2022-08-15", "2022-10-31", "2022-10-01", "2022-12-25", "2022-12-26", "2023-01-01", "2023-01-02", "2023-02-08"};

                                LocalDate oneWeekBefore = currentDate.minusWeeks(1);
                                LocalDate twoWeeksBefore = currentDate.minusWeeks(2);
                                LocalDate threeWeeksBefore = currentDate.minusWeeks(3);
                                LocalDate [] weeks = {oneWeekBefore, twoWeeksBefore, threeWeeksBefore};
                                String checkSimilarDates = "";

                                boolean isHoliday = false;
                                for (String holiday : holidays){
                                    if (holiday.equals(currentDate.toString())) {
                                        isHoliday = true;
                                        break;
                                    }
                                }
                                double nextTrueValue = 0;
                                double nextLowUsage = 0;
                                double nextHighUsage = 0;
                                if(dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY || isHoliday){
//                                    Date is Saturday OR Sunday OR a Holiday
                                    for(LocalDate week : weeks){
                                        if (nextTrueValue != 0){
                                            break;
                                        }
                                        if (week.isBefore(LocalDate.parse("2022-01-01"))){
                                            continue;
                                        }
                                        checkSimilarDates = " SELECT md.low_usage, md.high_usage, md.usage " +
                                                " FROM measurement_data md" +
                                                " WHERE md.date = '" + week + "'" +
                                                " AND md.cabinet_id = '" + cabinet_id + "';";

                                        Map<String, Object> oneValueResult = jdbcTemplate.queryForMap(checkSimilarDates);
                                        Double usage = (Double) oneValueResult.get("usage");
                                        Double low_usage = (Double) oneValueResult.get("low_usage");
                                        Double high_usage = (Double) oneValueResult.get("high_usage");

                                        if (usage != null){
                                            nextTrueValue = usage;
                                            if (low_usage != 0){
                                                nextLowUsage = low_usage;
                                            }
                                            if (high_usage != 0){
                                                nextHighUsage = high_usage;
                                            }
                                        }
                                    }

                                    MeasurementData data = new MeasurementData(currentDate, nextTrueValue, cabinet);

                                    if (nextTrueValue == 0){
                                        data.setInvalidFlag(true);
                                    } else {
                                        data.setModifiedWithEvenDatesStrategy(true);
                                    }
                                    if (nextLowUsage != 0){
                                        data.setLowUsage(nextLowUsage);
                                    }
                                    if (nextHighUsage != 0){
                                        data.setHighUsage(nextHighUsage);
                                    }
                                    data.setMeasuredValue(result.doubleValue());
                                    if (data.getUsage() == 0){
                                        data.setUsage(result.doubleValue());
                                        data.setOnlyMeasuredValue(true);
                                    }
                                    measurementDataDao.save(data);
                                } else {
//                                    Date is a work day
                                    for(LocalDate week : weeks){
                                        if (nextTrueValue != 0){
                                            break;
                                        }
                                        if (week.isBefore(LocalDate.parse("2022-01-01"))){
                                            continue;
                                        }
//                                        Check if earlier date is a holiday
                                        boolean earlierIsHoliday = false;
                                        for(String holiday : holidays){
                                            if (week.toString().equals(holiday)){
                                                earlierIsHoliday = true;
                                                break;
                                            }
                                        }
//                                        If earlier date is holiday, continue to next
                                        if (earlierIsHoliday){
                                            continue;
                                        }
                                        checkSimilarDates = " SELECT md.low_usage, md.high_usage, md.usage " +
                                                " FROM measurement_data md" +
                                                " WHERE md.date = '" + week + "'" +
                                                " AND md.cabinet_id = '" + cabinet_id + "';";

                                        Map<String, Object> oneValueResult = jdbcTemplate.queryForMap(checkSimilarDates);
                                        Double usage = (Double) oneValueResult.get("usage");
                                        Double low_usage = (Double) oneValueResult.get("low_usage");
                                        Double high_usage = (Double) oneValueResult.get("high_usage");

                                        if (usage != null){
                                            nextTrueValue = usage;
                                            if (low_usage != 0){
                                                nextLowUsage = low_usage;
                                            }
                                            if (high_usage != 0){
                                                nextHighUsage = high_usage;
                                            }
                                        }
                                    }
                                    MeasurementData data = new MeasurementData(currentDate, nextTrueValue, cabinet);
                                    if (nextTrueValue == 0){
                                        data.setInvalidFlag(true);
                                    } else {
                                        data.setModifiedWithEvenDatesStrategy(true);
                                    }
                                    if (nextLowUsage != 0){
                                        data.setLowUsage(nextLowUsage);
                                    }
                                    if (nextHighUsage != 0){
                                        data.setHighUsage(nextHighUsage);
                                    }
                                    data.setMeasuredValue(result.doubleValue());
                                    if (data.getUsage() == 0){
                                        data.setUsage(result.doubleValue());
                                        data.setOnlyMeasuredValue(true);
                                    }
                                    measurementDataDao.save(data);
                                }

                            }

                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void readCabinet() {
        try {
            String query = "SELECT mps1.tov_stev_stevca, mps2.dis, pmp.enotni_ident_mm, pmp.prikljucna_moc, pmp.stevilo_faz, pmp.odjemna_skupina" +
                    " FROM prikljucne_moci_primeri pmp" +
                    " JOIN merilni_podatki_stanja mps1 ON mps1.enotni_ident_mm = pmp.enotni_ident_mm" +
                    " JOIN merilni_podatki_statusi mps2 ON mps2.enotni_ident_mm = pmp.enotni_ident_mm" +
                    " GROUP BY mps1.tov_stev_stevca, mps2.dis, pmp.enotni_ident_mm, pmp.prikljucna_moc, pmp.stevilo_faz, pmp.odjemna_skupina";
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);

            for (Map<String, Object> row : rows) {
                String tov_stev_stevca = (String) row.get("tov_stev_stevca");
                String dis = (String) row.get("dis");
                String enotni_ident_mm = (String) row.get("enotni_ident_mm");
                String prikljucna_moc = (String) row.get("prikljucna_moc");
                int stevilo_faz = (Integer) row.get("stevilo_faz");
                int odjemna_skupina = (Integer) row.get("odjemna_skupina");

                Cabinet cabinet = new Cabinet(enotni_ident_mm, tov_stev_stevca, dis, prikljucna_moc, stevilo_faz, odjemna_skupina);
                cabinetDao.save(cabinet);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void readInterval(){
        try {
            String query = " SELECT DATE_TRUNC('hour', casovna_znacka) AS hour," +
                    "       SUM(a_plus) AS hourly_usage," +
                    "       enotni_ident_mm AS cabinet_id" +
                        "   FROM merilni_podatki" +
                        "   GROUP BY hour, enotni_ident_mm" +
                        "   ORDER BY hour;";

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);

            for (Map<String, Object> row : rows){
                Timestamp timestamp = (Timestamp) row.get("hour");
                BigDecimal hourly_usage = (BigDecimal) row.get("hourly_usage");
                String cabinet_id = (String) row.get("cabinet_id");

                Cabinet cabinet = cabinetDao.findById(cabinet_id).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));

                LocalDate date = timestamp.toLocalDateTime().toLocalDate();
                DayOfWeek dayOfWeek = date.getDayOfWeek();
                int month = timestamp.getMonth() + 1; // Month 1-12
                int hour = timestamp.getHours(); // Hour 0-23

                int season = 9;
                int timeBlock = 9;
                int typeOfDay = 9;

                String [] holidays = {"2022-01-01", "2022-01-02", "2022-02-08", "2022-04-18", "2022-04-27", "2022-05-01", "2022-05-02", "2022-06-25",
                        "2022-08-15", "2022-10-31", "2022-10-01", "2022-12-25", "2022-12-26", "2023-01-01", "2023-01-02", "2023-02-08"};

                boolean isHoliday = false;
                for (String holiday : holidays){
                    if (holiday.equals(date.toString())) {
                        isHoliday = true;
                        break;
                    }
                }
//                Check season
                if (month == 11 || month == 12 || month == 1 || month == 2){
//                    CASE -> High season
                    season = 0;
//                    Check type of day
                    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY || isHoliday){
//                        It's a work free day
                        typeOfDay = 1;
//                        Check time block
                        if (hour <= 5 || hour >= 22){
                            timeBlock = 4;
                        } else if (hour == 6 || hour == 14 || hour == 15 || hour == 20 || hour == 21) {
                            timeBlock = 3;
                        } else {
                            timeBlock = 2;
                        }
                    } else {
//                        It's a work day
                        typeOfDay = 0;
//                        Check time block
                        if (hour <= 5 || hour >= 22){
                            timeBlock = 3;
                        } else if (hour == 6 || hour == 14 || hour == 15 || hour == 20 || hour == 21) {
                            timeBlock = 2;
                        } else {
                            timeBlock = 1;
                        }
                    }

                } else {
//                    CASE -> Low season
                    season = 1;
//                    Check type of day
                    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY || isHoliday){
//                        It's a work free day
                        typeOfDay = 1;
//                        Check time block
                        if (hour <= 5 || hour >= 22){
                            timeBlock = 5;
                        } else if (hour == 6 || hour == 14 || hour == 15 || hour == 20 || hour == 21) {
                            timeBlock = 4;
                        } else {
                            timeBlock = 3;
                        }
                    } else {
//                        It's a work day
                        typeOfDay = 0;
//                        Check time block
                        if (hour <= 5 || hour >= 22){
                            timeBlock = 4;
                        } else if (hour == 6 || hour == 14 || hour == 15 || hour == 20 || hour == 21) {
                            timeBlock = 3;
                        } else {
                            timeBlock = 2;
                        }
                    }
                }
                IntervalData data = new IntervalData(timestamp, hourly_usage.doubleValue(), typeOfDay, timeBlock, season, cabinet);
                intervalDataDao.save(data);
            }
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}

package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.dao.MeasurementDataRepository;
import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
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



            int intervalSumCount = 0;
            int dailyUsageCount = 0;
            int case1Count = 0;
            int case2Count = 0;
            int case1CountInvalid = 0;
//            for (Map<String, Object> row : intervalSumRows) {
//                String enotniIdent = (String) row.get("enotni_ident_mm");
//                Date date = (Date) row.get("date");
//                BigDecimal result = (BigDecimal) row.get("result");
//                System.out.println("Enotni_ident_mm: " + enotniIdent + ", DATE: " + date + ", RESULT: " + result);
//                intervalSumCount++;
//            }
//
//            for (Map<String, Object> row : dailyUsageRows){
//                String cabinet_id = (String) row.get("cabinet_id");
//                Date current_date = (Date) row.get("current_date");
//                BigDecimal current_value = (BigDecimal) row.get("current_value");
//                BigDecimal current_value_24 = (BigDecimal) row.get("current_value_24");
//                Date next_date = (Date) row.get("next_date");
//                BigDecimal next_value = (BigDecimal) row.get("next_value");
//                BigDecimal next_value_24 = (BigDecimal) row.get("next_value_24");
//                BigDecimal subtraction = (BigDecimal) row.get("subtraction");
//                BigDecimal subtraction_24 = (BigDecimal) row.get("subtraction_24");
////                System.out.println("CABINET ID: " + cabinet_id + ", CURR DATE: " + current_date + ", CURR VAL: " +
////                        current_value + ", CURR VAL 24: " + current_value_24 + ", NEXT DATE: " + next_date + ", NEXT VAL: " + next_value +
////                        ", NEXT VAL 24: " + next_value_24 + ", SUBTRA: " + subtraction + ", SUBTRA 24: " + subtraction_24);
//                dailyUsageCount++;
//            }

            for(int j = 0; j < intervalSumRows.size(); j++){
                Map<String, Object> intervalRow = intervalSumRows.get(j);
                String enotniIdent = (String) intervalRow.get("enotni_ident_mm");
                Date date = (Date) intervalRow.get("date");
                BigDecimal result = (BigDecimal) intervalRow.get("result");

                Map<String, Object> dailyRow = dailyUsageRows.get(j);
                String cabinet_id = (String) dailyRow.get("cabinet_id");
                Date current_date = (Date) dailyRow.get("current_date");
                BigDecimal current_value = (BigDecimal) dailyRow.get("current_value");
                BigDecimal current_value_24 = (BigDecimal) dailyRow.get("current_value_24");
                Date next_date = (Date) dailyRow.get("next_date");
                BigDecimal next_value = (BigDecimal) dailyRow.get("next_value");
                BigDecimal next_value_24 = (BigDecimal) dailyRow.get("next_value_24");
                BigDecimal subtraction = (BigDecimal) dailyRow.get("subtraction");
                BigDecimal subtraction_24 = (BigDecimal) dailyRow.get("subtraction_24");
                BigDecimal visokaPoraba = (BigDecimal) dailyRow.get("visokaPoraba");
                BigDecimal nizkaPoraba = (BigDecimal) dailyRow.get("nizkaPoraba");

//                Create cabinet for any of the scenarios
                Cabinet cabinet = cabinetDao.findById(cabinet_id).orElseThrow(() -> new RuntimeException("Cabinet does not exist"));
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

                            MeasurementData measurementData = new MeasurementData(date, 0.0, cabinet);
                            measurementData.setInvalidFlag(true);
                            measurementData.setMeasuredValue(result.doubleValue());

                            measurementDataDao.save(measurementData);
                            case1CountInvalid++;
                        } else {
                            double divisionResult = (((result.doubleValue() / dailyValue.doubleValue())*100) - 100);
                            double absoluteResult = Math.abs(divisionResult);

                            if (absoluteResult <= 2){
            //                    CASE 1 -> ralika manj kot 2% (mankajoče podatke zapišemo z 0)
    //                            System.out.println("CASE 1 -> Date: " + date + " , Cabient ID: " + cabinet_id + ", Division res: " + absoluteResult);

                                MeasurementData measurementData = new MeasurementData(date, dailyValue.doubleValue(), cabinet);
                                measurementData.setFilledWithZeros(true);
                                if (visokaPoraba != null){
                                    measurementData.setHighUsage(visokaPoraba.doubleValue());
                                }
                                if (nizkaPoraba != null){
                                    measurementData.setLowUsage(nizkaPoraba.doubleValue());
                                }

                                measurementDataDao.save(measurementData);
                                case1Count++;
                            } else {
            //                    CASE 2 -> razlika več kot 2% (metoda instoležnih dni)
    //                            System.out.println("CASE 2 -> Date: " + date + " , Cabinet ID: " + cabinet_id + ", Division res: " + absoluteResult);
                                case2Count++;
                            }

                            intervalSumCount++;
                            dailyUsageCount++;
                        }
                    } else {
//                        TODO -> write some way to handle exception
                    }
                } else {
//                    TODO -> write some way to handle exception
                }

            }

            System.out.println("Interval sum count: " + intervalSumCount);
            System.out.println("Daily usage sum: " + dailyUsageCount);
            System.out.println("CASE 1: " + case1Count);
            System.out.println("CASE 2: " + case2Count);
            System.out.println("CASE 1 INVALID: " + case1CountInvalid);
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
}

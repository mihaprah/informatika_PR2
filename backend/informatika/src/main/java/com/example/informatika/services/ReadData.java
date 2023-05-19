package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.models.Cabinet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ReadData {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ReadData(DataSourceProperties dataSourceProperties) {
        this.jdbcTemplate = new JdbcTemplate(dataSourceProperties.initializeDataSourceBuilder().build());
    }

    @Autowired
    CabinetRepository cabinetDao;

    public void readMerilniPodatki() {
        try {
            String query = "SELECT * FROM merilni_podatki";
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(query);

            int count = 0;
            for (Map<String, Object> row : rows) {
                String enotniIdent = (String) row.get("enotni_ident_mm");
                System.out.println("enotni_ident_mm: " + enotniIdent);
                count++;
            }

            System.out.println("Count: " + count);
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

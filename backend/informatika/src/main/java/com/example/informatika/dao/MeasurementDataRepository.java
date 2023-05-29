package com.example.informatika.dao;

import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;

public interface MeasurementDataRepository extends CrudRepository<MeasurementData, Long> {
    @Query("SELECT md FROM measurement_data md WHERE md.cabinet_id = ?1 AND md.date BETWEEN ?2 AND ?3")
    Iterable<MeasurementData> findByCabinetAndDateBetween(Cabinet cabinetId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT md FROM measurement_data md WHERE md.cabinet_id = ?1")
    Iterable<MeasurementData> findByCabinet(Cabinet cabinetId);

}

package com.example.informatika.dao;

import com.example.informatika.models.MeasurementData;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MeasurementDataRepository extends CrudRepository<MeasurementData, Long> {
    @Query("SELECT md FROM measurement_data md WHERE md.cabinet_id = ?1")
    Iterable<MeasurementData> findByCabinet(String cabinetId);
}

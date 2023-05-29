package com.example.informatika.dao;

import com.example.informatika.models.Cabinet;
import com.example.informatika.models.IntervalData;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.sql.Timestamp;

public interface IntervalDataRepository extends CrudRepository<IntervalData, Long> {
    @Query("SELECT id FROM interval_data it WHERE it.cabinet_id = ?1 AND it.timestamp BETWEEN ?2 AND ?3")
    Iterable<IntervalData> findByCabinetAndTimeStampBetween(Cabinet cabinetId, Timestamp startDate, Timestamp endDate);
}

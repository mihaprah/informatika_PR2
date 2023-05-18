package com.example.informatika.dao;

import com.example.informatika.models.MeasurementData;
import org.springframework.data.repository.CrudRepository;

public interface MeasurementDataRepository extends CrudRepository<MeasurementData, Long> {
    Iterable<MeasurementData> findMeasurementDataBy(String identMM);
}

package com.example.informatika.dao;

import com.example.informatika.models.Cabinet;
import com.example.informatika.models.MeasurementData;
import org.springframework.data.repository.CrudRepository;

public interface CabinetRepository extends CrudRepository<Cabinet, String> {
}

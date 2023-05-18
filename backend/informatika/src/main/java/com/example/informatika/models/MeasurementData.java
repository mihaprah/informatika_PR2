package com.example.informatika.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

//@Entity
@Data
public class MeasurementData {

    //@Id
    //@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime TimeStamp;
    private String identMM;
    private int dis;
    private long aPlus;
    private long aMinus;
    private String statusAplus;
    private String statusAminus;
    private String tovStevStevca;


}

package com.example.informatika.models;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Data
public class Cabinet {

    public Cabinet() {
    }

    public Cabinet(String cabinetId, String cabinetNumber, String energyCompany, String connectionPower, int numberOfPhases, int consumerGroup) {
        this.cabinetId = cabinetId;
        this.cabinetNumber = cabinetNumber;
        this.energyCompany = energyCompany;
        this.connectionPower = connectionPower;
        this.numberOfPhases = numberOfPhases;
        this.consumerGroup = consumerGroup;
    }

    @Id
    private String cabinetId; //5-001

    private String cabinetNumber; // UNKN99999991
    private String energyCompany; //dis
    private String connectionPower; //kW
    private int numberOfPhases;
    private int consumerGroup; //2-5

    //@OneToMany(mappedBy = "cabinet", fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    //Collection<MeasurementData> measurementDataCollection;

}

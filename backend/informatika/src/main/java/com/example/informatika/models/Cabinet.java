package com.example.informatika.models;


import jakarta.persistence.*;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;

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
    private String energyCompany; // dis
    private String connectionPower; //kW
    private int numberOfPhases; // 1-3
    private int consumerGroup; // 2-5
    private double priceBlockOne;
    private double priceBlockTwo;
    private double priceBlockThree;
    private double priceBlockFour;
    private double priceBlockFive;
    private double penaltiesBlockOne;
    private double penaltiesBlockTwo;
    private double penaltiesBlockThree;
    private double penaltiesBlockFour;
    private double penaltiesBlockFive;
    private double agreedPowerOne;
    private double agreedPowerTwo;
    private double agreedPowerThree;
    private double agreedPowerFour;
    private double agreedPowerFive;
    private double highPrice;
    private double lowPrice;
}

package com.example.informatika.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Data
public class MeasurementData {
    public MeasurementData() {
    }
    public MeasurementData(LocalDate date, double usage, Cabinet cabinet) {
        this.date = date;
        this.usage = usage;
        this.cabinet = cabinet;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDate date;
    private double usage; // possibly needs to be BigDecimal type and not double
    private String register; //A+ A- R+ R-
    private boolean filledWithZeros = false; // CASE 1: difference < 2% --> mankajoce dni se zadomesti z 0
    private boolean modifiedWithEvenDatesStrategy = false; // CASE 2: difference > 2% --> pravilo soleznih dni
    private boolean invalidFlag = false; // Sum of interval data > daily value
    private double measuredValue; // Number of interval sum
    private double highUsage = 0; // Amount used in HIGH zone
    private double lowUsage = 0; // Amount used in LOW zone

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinetId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    Cabinet cabinet;

}

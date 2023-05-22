package com.example.informatika.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
public class MeasurementData {
    public MeasurementData() {
    }
    public MeasurementData(Date date, double usage, Cabinet cabinet) {
        this.date = date;
        this.usage = usage;
        this.cabinet = cabinet;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date date;
    private double usage; // possibly needs to be BigDecimal type and not double
    private String register; //A+ A- R+ R-
    private boolean filledWithZeros = false; // CASE 1: difference < 2% --> mankajoce dni se zadomesti z 0
    private boolean modifiedWithEvenDatesStrategy = false; // CASE 2: difference > 2% --> pravilo soleznih dni
    private boolean invalidFlag = false; // Sum of interval data > daily value
    private double measuredValue; // Number of interval sum

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinetId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    Cabinet cabinet;


}

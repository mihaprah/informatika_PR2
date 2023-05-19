package com.example.informatika.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class MeasurementData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDate date;
    private double usage;
    private String register; //A+ A- R+ R-


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinetId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    Cabinet cabinet;


}

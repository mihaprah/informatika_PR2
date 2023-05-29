package com.example.informatika.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Entity
@Data
public class IntervalData {

    public IntervalData() {
    }

    public IntervalData(Timestamp timeStamp, double hourlyUsage, int typeOfDay, int timeBlock, int season, Cabinet cabinet) {
        this.timeStamp = timeStamp;
        this.hourlyUsage = hourlyUsage;
        this.typeOfDay = typeOfDay;
        this.timeBlock = timeBlock;
        this.season = season;
        this.cabinet = cabinet;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Timestamp timeStamp;
    private double hourlyUsage;
    private int typeOfDay; // 0 -> work day, 1 -> work free day
    private int timeBlock; // 1-5
    private int season; // 0 -> high season (nov-feb), 1 -> low season (mar-okt)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinetId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    Cabinet cabinet;

}

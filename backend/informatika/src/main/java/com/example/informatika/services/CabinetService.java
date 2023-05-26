package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.models.Cabinet;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class CabinetService {

    private CabinetRepository cabinetDao;
    public Iterable<Cabinet> getAll() {
        Iterable<Cabinet> cabinets = cabinetDao.findAll();
        Cabinet[] cabinetArray = StreamSupport.stream(cabinets.spliterator(), false)
                .toArray(Cabinet[]::new);

        Arrays.sort(cabinetArray, Comparator.comparingInt(cabinet -> {
            String[] parts = cabinet.getCabinetId().split("-");
            return Integer.parseInt(parts[1]);
        }));

        return Arrays.asList(cabinetArray);
    }
    public Cabinet getById(String id){
        return cabinetDao.findById(id).orElseThrow(() -> new IllegalCallerException("Cabient does not exist"));
    }
    public void addCabinet(Cabinet newCabinet){
        cabinetDao.save(newCabinet);
    }
    public void updateCabinet(Cabinet cabinet){
        Cabinet updatedCabinet = cabinetDao.findById(cabinet.getCabinetId()).orElseThrow(() -> new IllegalCallerException("Cabinet does not exist"));

        updatedCabinet.setCabinetNumber(cabinet.getCabinetNumber());
        updatedCabinet.setConnectionPower(cabinet.getConnectionPower());
        updatedCabinet.setConsumerGroup(cabinet.getConsumerGroup());
        updatedCabinet.setEnergyCompany(cabinet.getEnergyCompany());
        updatedCabinet.setNumberOfPhases(cabinet.getNumberOfPhases());

        cabinetDao.save(updatedCabinet);
    }
    public void deleteCabinet(String id){
        cabinetDao.deleteById(id);
    }
}

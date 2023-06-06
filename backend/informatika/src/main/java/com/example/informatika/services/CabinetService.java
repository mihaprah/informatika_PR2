package com.example.informatika.services;

import com.example.informatika.dao.CabinetRepository;
import com.example.informatika.models.Cabinet;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    public void updateCabinetSettings(Cabinet cabinet) {
        Cabinet updatedCabinet = cabinetDao.findById(cabinet.getCabinetId()).orElseThrow(() -> new IllegalCallerException("Cabinet does not exist"));

        updatedCabinet.setPriceBlockOne(cabinet.getPriceBlockOne());
        updatedCabinet.setPriceBlockTwo(cabinet.getPriceBlockTwo());
        updatedCabinet.setPriceBlockThree(cabinet.getPriceBlockThree());
        updatedCabinet.setPenaltiesBlockFour(cabinet.getPenaltiesBlockFour());
        updatedCabinet.setPriceBlockFive(cabinet.getPriceBlockFive());
        updatedCabinet.setPenaltiesBlockOne(cabinet.getPenaltiesBlockOne());
        updatedCabinet.setPenaltiesBlockTwo(cabinet.getPenaltiesBlockTwo());
        updatedCabinet.setPenaltiesBlockThree(cabinet.getPenaltiesBlockThree());
        updatedCabinet.setPenaltiesBlockFour(cabinet.getPriceBlockFour());
        updatedCabinet.setPenaltiesBlockFive(cabinet.getPenaltiesBlockFive());
        updatedCabinet.setAgreedPowerOne(cabinet.getAgreedPowerOne());
        updatedCabinet.setAgreedPowerTwo(cabinet.getAgreedPowerTwo());
        updatedCabinet.setAgreedPowerThree(cabinet.getAgreedPowerThree());
        updatedCabinet.setAgreedPowerFour(cabinet.getAgreedPowerFour());
        updatedCabinet.setAgreedPowerFive(cabinet.getAgreedPowerFive());
        updatedCabinet.setHighPrice(cabinet.getHighPrice());
        updatedCabinet.setLowPrice(cabinet.getLowPrice());

        cabinetDao.save(updatedCabinet);
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
}

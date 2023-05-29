package com.example.informatika;

import com.example.informatika.services.ReadData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class InformatikaApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(InformatikaApplication.class, args);

        // Obtain an instance of the ReadData class from the application context
        ReadData readData = context.getBean(ReadData.class);

        // Call the read() method
        readData.readCabinet();
        readData.readMerilniPodatki();
        readData.readInterval();

        // Close the application context
        //context.close();
    }
}

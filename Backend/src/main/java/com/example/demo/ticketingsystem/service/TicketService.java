//package com.example.demo.ticketingsystem.service;
//
//import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
//import com.example.demo.ticketingsystem.entity.Ticket;
//import com.example.demo.ticketingsystem.repository.TicketRepository;
//import com.example.demo.ticketingsystem.repository.TicketConfigRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.stereotype.Service;
//
//import java.io.*;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//import java.util.concurrent.atomic.AtomicInteger;
//
//@Service
//public class TicketService {
//
//    private final TicketRepository ticketRepository;
//    private final TicketConfigRepository ticketConfigRepository;
//    private final ObjectMapper objectMapper = new ObjectMapper();
//    private boolean simulationActive = false;
//    private int totalTickets;
//    private int ticketReleaseRate;
//    private int ticketRetrievalRate;
//    private int maxCapacity;
//    private int availableTickets;
//    private static final List<String> ticketLogs = new ArrayList<>();
//
//    private static AtomicInteger ticketIdCounter = new AtomicInteger(0);
//    private static final int VENDOR_COUNT = 5;  // Fixed number of vendors
//    private static final int CUSTOMER_COUNT = 10; // Fixed number of customers
//
//    public TicketService(TicketRepository ticketRepository, TicketConfigRepository ticketConfigRepository) {
//        this.ticketRepository = ticketRepository;
//        this.ticketConfigRepository = ticketConfigRepository;
//    }
//
//    // Save configuration to a JSON file
//    public void saveConfiguration(TicketConfigDTO configuration) {
//        try {
//            // Save the configuration to a JSON file
//            objectMapper.writeValue(new File("configuration.json"), configuration);
//            // Update class variables from configuration
//            this.ticketReleaseRate = configuration.getTicketReleaseRate();
//            this.ticketRetrievalRate = configuration.getTicketRetrievalRate();
//            this.maxCapacity = configuration.getMaxCapacity();
//            this.totalTickets = configuration.getTotalTickets();
//            System.out.println("Configuration saved: " + configuration);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    // Start simulation with vendor and customer threads
//    public void startSimulation() {
//        simulationActive = true;
//
//        // Start vendor threads
//        for (int i = 0; i < VENDOR_COUNT; i++) {
//            new Thread(this::simulateVendors).start();
//        }
//
//        // Start customer threads
//        for (int i = 0; i < CUSTOMER_COUNT; i++) {
//            new Thread(this::simulateCustomers).start();
//        }
//    }
//
//    public void stopSimulation() {
//        simulationActive = false;
//    }
//
//    private void simulateVendors() {
//        while (simulationActive && availableTickets < maxCapacity) {
//            try {
//                addTicket();  // Vendors add tickets to the system
//                Thread.sleep(1000L * ticketReleaseRate);
//            } catch (InterruptedException e) {
//                Thread.currentThread().interrupt();
//            }
//        }
//    }
//
//    private void simulateCustomers() {
//        while (simulationActive && availableTickets > 0) {
//            try {
//                buyTicket();  // Customers buy tickets from the system
//                Thread.sleep(1000L * ticketRetrievalRate);
//            } catch (InterruptedException e) {
//                Thread.currentThread().interrupt();
//            }
//        }
//    }
//
//    // Add a ticket to the system
//    public void addTicket() {
//        if (availableTickets < maxCapacity) {
//            Ticket ticket = new Ticket();
//            ticket.setEventName("Concert");  // Hard-coded event name
//            ticket.setPrice(50);  // Hard-coded ticket price
//            ticket.setAvailable(true);
//            ticket.setId((long) ticketIdCounter.getAndIncrement());  // Increment ticket ID
//            ticketRepository.save(ticket);  // Save ticket to the database
//
//            availableTickets++;  // Increase available tickets
//            totalTickets--;  // Increase total tickets
//
//            // Log the action and update JSON file
//            logTicketAction("Vendor added a ticket: " + ticket.getId());
//            updateTicketDataJson();
//        }
//    }
//
//    // Customer buys a ticket
//    public void buyTicket() {
//        Ticket ticket = ticketRepository.findFirstByAvailableTrue();  // Get the first available ticket
//        if (ticket != null) {
//            ticket.setAvailable(false);  // Mark ticket as sold
//            ticketRepository.save(ticket);  // Save updated ticket to the database
//            availableTickets--;  // Decrease available tickets
//
//            int customerId = (int) (Math.random() * CUSTOMER_COUNT) + 1;  // Random customer ID between 1 and 10
//            logTicketAction(customerId, ticket.getId(), ticket.getEventName(), ticket.getPrice());
//
//            // Update the ticket data in the JSON file
//            updateTicketDataJson();
//        }
//    }
//
//    // Log ticket purchase with customer and ticket details
//    private void logTicketAction(int customerId, int ticketId, String eventName, double price) {
//        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());  // Real-time date and time
//        String logMessage = "CustomerId: " + customerId +
//                " - TicketId: " + ticketId +
//                " - Event: " + eventName +
//                " - Price: " + price +
//                " - Date & Time: " + timeStamp;
//        ticketLogs.add(logMessage);
//        System.out.println(logMessage);
//    }
//
//    // Log action when a vendor adds a ticket
//    private void logTicketAction(String action) {
//        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
//        String logMessage = action + " - Date & Time: " + timeStamp;
//        ticketLogs.add(logMessage);
//        System.out.println(logMessage);
//    }
//
//    // Save the updated ticket data (total and available tickets) to a JSON file
//    private void updateTicketDataJson() {
//        try {
//            TicketData ticketData = new TicketData(totalTickets, availableTickets);
//            objectMapper.writeValue(new File("ticketData.json"), ticketData);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    // Return available tickets count
//    public int getAvailableTickets() {
//        return availableTickets;
//    }
//
//    public int getTotalTickets(){
//        return totalTickets;
//    }

//
//    // Get ticket logs
//    public List<String> getTicketLogs() {
//        return ticketLogs;
//    }
//
//    public TicketConfigRepository getTicketConfigRepository() {
//        return ticketConfigRepository;
//    }
//
//    public static class TicketData {
//        private int totalTickets;
//        private int availableTickets;
//
//        public TicketData(int totalTickets, int availableTickets) {
//            this.totalTickets = totalTickets;
//            this.availableTickets = availableTickets;
//        }
//
//        public int getTotalTickets() {
//            return totalTickets;
//        }
//
//        public void setTotalTickets(int totalTickets) {
//            this.totalTickets = totalTickets;
//        }
//
//        public int getAvailableTickets() {
//            return availableTickets;
//        }
//
//        public void setAvailableTickets(int availableTickets) {
//            this.availableTickets = availableTickets;
//        }
//    }
//}


package com.example.demo.ticketingsystem.service;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import com.example.demo.ticketingsystem.entity.Ticket;
import com.example.demo.ticketingsystem.repository.TicketRepository;
import com.example.demo.ticketingsystem.repository.TicketConfigRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketConfigRepository ticketConfigRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private boolean simulationActive = false;
    private int totalTickets;
    private int ticketReleaseRate;
    private int ticketRetrievalRate;
    private int maxCapacity;
    private int availableTickets;

    private final Queue<Ticket> ticketQueue = new LinkedList<>();
    private static final List<String> ticketLogs = new ArrayList<>();

    private static final AtomicInteger ticketIdCounter = new AtomicInteger(0);
    private static final int VENDOR_COUNT = 5;  // Fixed number of vendors
    private static final int CUSTOMER_COUNT = 10; // Fixed number of customers

    public TicketService(TicketRepository ticketRepository, TicketConfigRepository ticketConfigRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketConfigRepository = ticketConfigRepository;
    }


    private TicketConfigDTO currentConfig;

    // Method to load previous inputs (configuration) from a JSON file
    public TicketConfigDTO loadPreviousConfig() {
        File configFile = new File("configuration.json");
        if (configFile.exists()) {
            try {
                // Reading the JSON file and converting it to TicketConfigDTO
                currentConfig = objectMapper.readValue(configFile, TicketConfigDTO.class);
                System.out.println("Previous configuration loaded successfully.");
                return currentConfig; // Return the loaded configuration
            } catch (IOException e) {
                System.out.println("Error reading the configuration file: " + e.getMessage());
                return null; // Return null in case of error
            }
        } else {
            System.out.println("Configuration file not found. No previous configuration to load.");
            return null; // Return null if the file doesn't exist
        }
    }

    // Save configuration to a JSON file
    public void saveConfiguration(TicketConfigDTO configuration) {
        try {
            objectMapper.writeValue(new File("configuration.json"), configuration);
            this.ticketReleaseRate = configuration.getTicketReleaseRate();
            this.ticketRetrievalRate = configuration.getTicketRetrievalRate();
            this.maxCapacity = configuration.getMaxCapacity();
            this.totalTickets = configuration.getTotalTickets();
            System.out.println("Configuration saved: " + configuration);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Start simulation with vendor and customer threads
    public void startSimulation() {
        simulationActive = true;

        for (int i = 0; i < VENDOR_COUNT; i++) {
            Thread vendorThread = new Thread(this::simulateVendors);
            vendorThread.setName("Vendor-" + i);
            vendorThread.start();
        }

        // Start customer threads
        for (int i = 0; i < CUSTOMER_COUNT; i++) {
            Thread customerThread = new Thread(this::simulateCustomers);
            customerThread.setName("Customer-" + i);
            customerThread.start();
        }
    }

    public void stopSimulation() {
        simulationActive = false;
    }

    private void simulateVendors() {
        while (simulationActive) {
            try {
                synchronized (ticketQueue) {
                    if (ticketQueue.size() < maxCapacity && totalTickets > 0) {
                        addTicket();
                    }
                }
                // Control ticket release rate
                Thread.sleep(1000L * ticketReleaseRate);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private void simulateCustomers() {
        while (simulationActive) {
            try {
                synchronized (ticketQueue) {
                    if (!ticketQueue.isEmpty()) {
                        buyTicket();
                    }
                }
                // Control ticket retrieval rate
                Thread.sleep(1000L * ticketRetrievalRate);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    // Add a ticket to the system
    private void addTicket() {
        if (ticketQueue.size() < maxCapacity && totalTickets > 0) {
            Ticket ticket = new Ticket();
            ticket.setEventName("Concert");
            ticket.setPrice(50);
            ticket.setAvailable(true);
            ticket.setId((long) ticketIdCounter.getAndIncrement());

            ticketQueue.add(ticket);
            ticketRepository.save(ticket);

            totalTickets--;
            availableTickets++;
            logTicketAction("Vendor added ticket: " + ticket.getId());
        }
    }

    // Customer buys a ticket
    private void buyTicket() {
        if (!ticketQueue.isEmpty()) {
            Ticket ticket = ticketQueue.poll();
            if (ticket != null) {
                ticket.setAvailable(false);
                ticketRepository.save(ticket);
                availableTickets--;

                int customerId = (int) (Math.random() * CUSTOMER_COUNT) + 1;
                logTicketAction(customerId, ticket.getId(), ticket.getEventName(), ticket.getPrice());
            }
        }
    }

    // Log ticket purchase with customer and ticket details
    private void logTicketAction(int customerId, long ticketId, String eventName, double price) {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        String logMessage = "CustomerId: " + customerId +
                " - TicketId: " + ticketId +
                " - Event: " + eventName +
                " - Price: " + price +
                " - Date & Time: " + timeStamp;
        ticketLogs.add(logMessage);
        System.out.println(logMessage);
    }


    // Log action when a vendor adds a ticket
    private void logTicketAction(String action) {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        String logMessage = action + " - Date & Time: " + timeStamp;
        ticketLogs.add(logMessage);
        System.out.println(logMessage);
    }

    public void reset() {
        // Stop the simulation if it's running
        stopSimulation();

        // Reset ticket-related variables
        totalTickets = 0;
        availableTickets = 0;
        ticketQueue.clear();


        // Reset logs
        ticketLogs.clear();
        System.out.println("Simulation reset completed. All logs cleared and tickets reset.");

        // Optionally, you can also reset the ticket ID counter if required
        ticketIdCounter.set(0);
    }


    public List<String> getTicketLogs() {
        return ticketLogs;
    }

    // Return available tickets count
    public int getAvailableTickets() {
        return availableTickets;
    }

    public int getTotalTickets(){
        return totalTickets;
    }


    public static class TicketData {
        private int totalTickets;
        private int availableTickets;

        public TicketData(int totalTickets, int availableTickets) {
            this.totalTickets = totalTickets;
            this.availableTickets = availableTickets;
        }

        public int getTotalTickets() {
            return totalTickets;
        }

        public void setTotalTickets(int totalTickets) {
            this.totalTickets = totalTickets;
        }

        public int getAvailableTickets() {
            return availableTickets;
        }

        public void setAvailableTickets(int availableTickets) {
            this.availableTickets = availableTickets;
        }
    }
}


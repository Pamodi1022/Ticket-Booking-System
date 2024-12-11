package com.example.demo.ticketingsystem.service;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import com.example.demo.ticketingsystem.entity.Ticket;
import com.example.demo.ticketingsystem.entity.TicketConfig;
import com.example.demo.ticketingsystem.entity.TicketLog;
import com.example.demo.ticketingsystem.repository.TicketRepository;
import com.example.demo.ticketingsystem.repository.TicketConfigRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
    private static List<String> ticketLogs = new ArrayList<>();

    private static  AtomicInteger ticketIdCounter = new AtomicInteger(0);
    private static final int VENDOR_COUNT = 5;  // Fixed number of vendors
    private static final int CUSTOMER_COUNT = 10; // Fixed number of customers

    public TicketService(TicketRepository ticketRepository, TicketConfigRepository ticketConfigRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketConfigRepository = ticketConfigRepository;
    }

    public void loadConfiguration(String filePath) throws IOException {
        File file = new File(filePath);
        if (file.exists()) {
            TicketConfigDTO config = objectMapper.readValue(file, TicketConfigDTO.class);

            // Save configuration to the database
            TicketConfig ticketConfig = new TicketConfig(
                    config.getTotalTickets(),
                    config.getTicketReleaseRate(),
                    config.getTicketRetrievalRate(),
                    config.getMaxCapacity()
            );
            ticketConfigRepository.save(ticketConfig);

            totalTickets = config.getTotalTickets();
            ticketReleaseRate = config.getTicketReleaseRate();
            ticketRetrievalRate = config.getTicketRetrievalRate();
            maxCapacity = config.getMaxCapacity();
            availableTickets = totalTickets;
        }
    }

    public void startSimulation() {
        simulationActive = true;

        // Create and start fixed number of vendor and customer threads
        for (int i = 0; i < VENDOR_COUNT; i++) {
            new Thread(this::simulateVendors).start();
        }
        for (int i = 0; i < CUSTOMER_COUNT; i++) {
            new Thread(this::simulateCustomers).start();
        }
    }

    public void stopSimulation() {
        simulationActive = false;
    }

    private void simulateVendors() {
        while (simulationActive && availableTickets < maxCapacity) {
            try {
                addTicket();  // Vendors add tickets to the system
                Thread.sleep(1000L * ticketReleaseRate);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private void simulateCustomers() {
        while (simulationActive && availableTickets > 0) {
            try {
                buyTicket();  // Customers buy tickets from the system
                Thread.sleep(1000L * ticketRetrievalRate);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    // Add a ticket to the system
    public void addTicket() {
        if (availableTickets < totalTickets) {
            Ticket ticket = new Ticket();
            ticket.setEventName("Vendor Event");  // Hard-coded event name
            ticket.setPrice(50.0);  // Hard-coded ticket price
            ticket.setAvailable(true);
            ticket.setId((long) ticketIdCounter.getAndIncrement());  // Increment ticket ID
            ticketRepository.save(ticket);  // Save ticket to the database

            availableTickets++;  // Increase available tickets
            totalTickets++;  // Increase total tickets
            logTicketAction("Vendor added a ticket: " + ticket.getId());
        }
    }

    // Customer buys a ticket
    public void buyTicket() {
        Ticket ticket = ticketRepository.findFirstByAvailableTrue();  // Get the first available ticket
        if (ticket != null) {
            ticket.setAvailable(false);  // Mark ticket as sold
            ticketRepository.save(ticket);  // Save updated ticket to the database
            availableTickets--;  // Decrease available tickets

            int customerId = (int) (Math.random() * CUSTOMER_COUNT) + 1;  // Random customer ID between 1 and 10
            logTicketAction(customerId, ticket.getId(), ticket.getEventName(), ticket.getPrice());
        }
    }

    // Log ticket purchase with customer and ticket details
    private void logTicketAction(int customerId, int ticketId, String eventName, double price) {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());  // Real-time date and time
        System.out.println("CustomerId: " + customerId +
                " - TicketId: " + ticketId +
                " - Event: " + eventName +
                " - Price: " + price +
                " - Date & Time: " + timeStamp);
    }

    // Store data to a JSON file
    private void saveDataToJson() {
        try {
            TicketData ticketData = new TicketData(totalTickets, availableTickets);
            objectMapper.writeValue(new File("ticketData.json"), ticketData);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Log actions (e.g., to console or a log file)
    private void logTicketAction(String action) {
        // This could be more advanced logging, but for now, just print to the console
        System.out.println(action);
    }

    // Return available tickets count
    public int getAvailableTickets() {
        return availableTickets;
    }

    // Get ticket logs
    public List<TicketLog> getTicketLogs() {
        // You could extend this by reading logs from a file or a database
        return null;
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

        public void logAction(String message) {
            ticketLogs.add(message);
        }

        public List<String> getTicketLogs(Ticket ticket) {
            return ticketLogs;
        }
    }
}

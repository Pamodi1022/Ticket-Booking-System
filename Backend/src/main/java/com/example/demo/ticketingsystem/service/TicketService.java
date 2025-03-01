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
    private int initialTotalTickets; // New variable to store the initial total tickets
    private int ticketReleaseRate;
    private int ticketRetrievalRate;
    private int maxCapacity;
    private int availableTickets;
    private int soldTickets; // Variable to track sold tickets

    private final Queue<Ticket> ticketQueue = new LinkedList<>();
    private static final List<String> ticketLogs = new ArrayList<>();

    private static final AtomicInteger ticketIdCounter = new AtomicInteger(1);
    private static final int VENDOR_COUNT = 5;  // Fixed number of vendors
    private static final int CUSTOMER_COUNT = 10; // Fixed number of customers

    public TicketService(TicketRepository ticketRepository, TicketConfigRepository ticketConfigRepository) {
        this.ticketRepository = ticketRepository;
        this.ticketConfigRepository = ticketConfigRepository;
    }

    // Save configuration to a JSON file
    public void saveConfiguration(TicketConfigDTO configuration) {
        try {
            objectMapper.writeValue(new File("configuration.json"), configuration);
            this.ticketReleaseRate = configuration.getTicketReleaseRate();
            this.ticketRetrievalRate = configuration.getTicketRetrievalRate();
            this.maxCapacity = configuration.getMaxCapacity();
            this.totalTickets = configuration.getTotalTickets();
            this.initialTotalTickets = configuration.getTotalTickets(); // Set initial total tickets
            this.soldTickets = 0; // Initialize soldTickets to 0
            System.out.println("Configuration saved: " + configuration);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Start simulation with vendor and customer threads
    public void startSimulation() {
        simulationActive = true;

        for (int i = 1; i <= VENDOR_COUNT; i++) {
            Thread vendorThread = new Thread(this::simulateVendors);
            vendorThread.setName("Vendor-" + i);
            vendorThread.start();
        }

        // Start customer threads
        for (int i = 1; i <= CUSTOMER_COUNT; i++) {
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
            ticket.setEventName("Christmas Caroling Party");
            ticket.setPrice(1000);
            ticket.setAvailable(true);
            ticket.setId((long) ticketIdCounter.getAndIncrement());

            ticketQueue.add(ticket);
            ticketRepository.save(ticket);

            totalTickets--;
            availableTickets++;
            logTicketAction("Vendor added Ticket Id: " + ticket.getId());
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
                soldTickets++; // Increment soldTickets when a ticket is sold

                int customerId = (int) (Math.random() * CUSTOMER_COUNT) + 1;
                logTicketAction(customerId, ticket.getId(), ticket.getEventName(), ticket.getPrice());
            }
        }
    }

    // Log ticket purchase with customer and ticket details
    private void logTicketAction(int customerId, long ticketId, String eventName, double price) {
        String timeStamp = new SimpleDateFormat("yyyy-MM-dd  |  HH:mm:ss").format(new Date());
        String logMessage = "Customer Id: " + customerId +
                "   |   Ticket Id: " + ticketId +
                "   |   Event: " + eventName +
                "   |   Price: " + price +
                "   |   " + timeStamp;
        ticketLogs.add(logMessage);
        System.out.println(logMessage);
    }

    // Log action when a vendor adds a ticket
    private void logTicketAction(String action) {
        String timeStamp = new SimpleDateFormat("  |  yyyy-MM-dd  |  HH:mm:ss").format(new Date());
        String logMessage = action + timeStamp;
        ticketLogs.add(logMessage);
        System.out.println(logMessage);
    }

    public void reset() {
        // Stop the simulation if it's running
        stopSimulation();

        // Reset ticket-related variables
        totalTickets = 0; // Reset totalTickets to initial value
        initialTotalTickets = 0; // Reset initialTotalTickets
        availableTickets = 0;
        soldTickets = 0; // Reset soldTickets
        ticketQueue.clear();

        // Reset logs
        ticketLogs.clear();
        System.out.println("Simulation reset completed. All logs cleared and tickets reset.");

        // Reset the ticket ID counter if required
        ticketIdCounter.set(0);
    }

    public void terminateSimulation() {
        // Stop the simulation first
        stopSimulation();
        
        // Reset all values including initialTotalTickets
        totalTickets = 0;
        initialTotalTickets = 0;
        availableTickets = 0;
        soldTickets = 0;
        ticketQueue.clear();
        ticketLogs.clear();
        
        System.out.println("Simulation terminated. All values reset to zero.");
        
        // Reset the ticket ID counter
        ticketIdCounter.set(0);
    }

    public List<String> getTicketLogs() {
        return ticketLogs;
    }

    // Return available tickets count
    public int getAvailableTickets() {
        return availableTickets;
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    // Return initial total tickets count
    public int getInitialTotalTickets() {
        return initialTotalTickets;
    }

    // Return sold tickets count
    public int getSoldTickets() {
        return soldTickets;
    }

    public TicketConfigRepository getTicketConfigRepository() {
        return ticketConfigRepository;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }
}
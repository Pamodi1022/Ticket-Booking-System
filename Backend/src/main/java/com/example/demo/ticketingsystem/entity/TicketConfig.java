package com.example.demo.ticketingsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;

@Entity
public class TicketConfig {

    @Id
    private Long id;
    @Min(value = 1, message = "Total tickets must be greater than 0")
    private int totalTickets;
    @Min(value = 1, message = "Ticket release rate must be greater than 0")
    private int ticketReleaseRate;
    @Min(value = 1, message = "Ticket retrieval rate must be greater than 0")
    private int ticketRetrievalRate;
    @Min(value = 1, message = "Max capacity must be greater than 0")
    private int maxCapacity;

    public TicketConfig() {}

    public TicketConfig(int totalTickets, int ticketReleaseRate, int ticketRetrievalRate, int maxCapacity) {
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.ticketRetrievalRate = ticketRetrievalRate;
        this.maxCapacity = maxCapacity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(int totalTickets) {
        this.totalTickets = totalTickets;
    }

    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    public void setTicketReleaseRate(int ticketReleaseRate) {
        this.ticketReleaseRate = ticketReleaseRate;
    }

    public int getTicketRetrievalRate() {
        return ticketRetrievalRate;
    }

    public void setTicketRetrievalRate(int ticketRetrievalRate) {
        this.ticketRetrievalRate = ticketRetrievalRate;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}

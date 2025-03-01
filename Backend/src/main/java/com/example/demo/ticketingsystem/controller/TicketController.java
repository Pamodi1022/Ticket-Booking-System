package com.example.demo.ticketingsystem.controller;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import com.example.demo.ticketingsystem.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }


    @PostMapping("/submit")
    public String saveConfiguration(@Valid @RequestBody TicketConfigDTO configuration) {
        ticketService.saveConfiguration(configuration);
        return "Configuration saved successfully!";
    }


    @PostMapping("/start")
    public void start() {
        ticketService.startSimulation();
    }

    @PostMapping("/stop")
    public void stop() {
        ticketService.stopSimulation();
    }

    @PostMapping("/reset")
    public void reset() {
        ticketService.reset();
    }

    @GetMapping("/available")
    public int getAvailableTickets() {
        return ticketService.getAvailableTickets();
    }

    @GetMapping("/total")
    public int getTotalTickets() {
        return ticketService.getTotalTickets();
    }

    @GetMapping("/max")
    public int getMaxCapacity() {
        return ticketService.getMaxCapacity();
    }

    @GetMapping("/logs")
    public List<String> getLogs() {
        return ticketService.getTicketLogs();
    }
}

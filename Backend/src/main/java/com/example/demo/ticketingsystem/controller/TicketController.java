package com.example.demo.ticketingsystem.controller;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import com.example.demo.ticketingsystem.service.TicketService;
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
    public String saveConfiguration(@RequestBody TicketConfigDTO configuration) {
        // Call the service method to save configuration to JSON file
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


    @GetMapping("/available")
    public int getAvailableTickets() {
        return ticketService.getAvailableTickets();
    }

    @GetMapping("/logs")
    public List<String> getLogs() {
        return ticketService.getTicketLogs();
    }
}

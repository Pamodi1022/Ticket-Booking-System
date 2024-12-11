package com.example.demo.ticketingsystem.controller;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import com.example.demo.ticketingsystem.entity.TicketLog;
import com.example.demo.ticketingsystem.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
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
    public List<TicketLog> getLogs() {
        return ticketService.getTicketLogs();
    }
}

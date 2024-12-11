package com.example.demo.ticketingsystem.repository;

import com.example.demo.ticketingsystem.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Ticket findFirstByAvailableTrue();

}



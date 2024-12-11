package com.example.demo.ticketingsystem.websocket;

import com.example.demo.ticketingsystem.entity.Ticket;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/tickets")
@Component
public class TicketWebSocketHandler {

    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("WebSocket connection opened: " + session.getId());
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        if ("start".equals(message)) {
            // Start system logic
        } else if ("stop".equals(message)) {
            // Stop system logic
        }
    }


    public static void broadcastTicketData(Ticket ticketData) {
        String ticketDataJson;
        try {
            ticketDataJson = objectMapper.writeValueAsString(ticketData);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        synchronized (sessions) {
            for (Session session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(ticketDataJson);
                    } catch (IOException e) {
                        System.err.println("Error broadcasting ticket data to session " + session.getId() + ": " + e.getMessage());
                    }
                }
            }
        }
    }
}

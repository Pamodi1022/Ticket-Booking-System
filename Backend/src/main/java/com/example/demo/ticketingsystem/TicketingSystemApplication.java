package com.example.demo.ticketingsystem;

import com.example.demo.ticketingsystem.dto.TicketConfigDTO;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableWebSocket
@EnableJpaRepositories(basePackages = "com.example.demo.ticketingsystem.repository")
@EnableConfigurationProperties(TicketConfigDTO.class)
public class TicketingSystemApplication {

	public static void main(String[] args) {

		SpringApplication.run(TicketingSystemApplication.class, args);
	}

}

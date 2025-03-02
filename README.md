# Real Time Ticket Management System  🎫

https://github.com/user-attachments/assets/74e4fbe3-c2f9-4d96-b674-8a2666472f4d

## Introduction
The Ticket Management System is a multi-threaded application designed to simulate a Ticketing System. Vendors add tickets to a shared ticket pool, while customers retrieve tickets based on a defined rate. The system provides a controlled and synchronized environment for managing ticket distribution efficiently. The project includes a Spring Boot backend and a React.js frontend, providing a comprehensive full-stack solution.

## Setup Instructions

### Prerequisites
Before running the application, ensure that you have the following installed:

- Java Development Kit (JDK) version 8 or later.
- Node.js and npm for the React.js frontend.
- A compatible Integrated Development Environment (IDE) such as IntelliJ IDEA, Eclipse, or Visual Studio Code (optional but recommended).

#### Clone the Repository:
```bash
git clone https://github.com/Pamodi1022/Ticket-Booking-System.git
cd Ticket-Booking-System
```

## Usage Instructions

### Configuring the System
Upon starting the backend application, you will be prompted to configure the following parameters via an API or frontend interface:

- **Maximum Capacity for the Ticket Queue**: The maximum number of tickets the pool can hold at any time.
- **Total Tickets for Each Vendor**: The number of tickets all vendors will contribute.
- **Ticket Release Rate (in seconds)**: The rate at which each vendor adds tickets to the pool.
- **Ticket Retrieval Rate (in seconds)**: The rate at which customers retrieve tickets from the pool.

### Starting the System
Once the configuration is complete, the system will:

1. Start vendor threads in the backend to add tickets to the pool at the specified release rate.
2. Start customer threads in the backend to retrieve tickets at the defined retrieval rate.

The frontend application will allow users to view and interact with the ticket management system in real time.

## Explanation of UI Controls
The system includes a web-based user interface built with React.js. Users can:

- Configure Total tickets and Available tickets.
- View the log of the ticket pool in real time.
- Monitor vendor and customer activity.

## Features
- Full-stack implementation with Spring Boot backend and React.js frontend.
- Multi-threaded simulation of vendors and customers interacting with a shared ticket pool.
- Synchronized ticket pool.
- Configurable ticket queue size, ticket release rate, and retrieval rate.
- Error handling to ensure valid user input.
- Real-time updates via the React.js frontend and websockets.




# Hotel Frontend

A modern frontend application for hotel management built with Angular. This application provides role-based dashboards for administrators, managers, receptionists, and users to efficiently manage hotel operations, bookings, and user interactions.

## Features

- **User Authentication**: Secure login and sign-in functionality for different user roles.
- **Role-Based Dashboards**:
  - **Admin Dashboard**: Oversee overall hotel operations and management.
  - **Manager Dashboard**: Handle managerial tasks and oversight.
  - **Reception Dashboard**: Manage check-ins, check-outs, and guest services.
  - **User Dashboard**: Allow guests to view and manage their bookings and profiles.
- **Hotel Listings**: Browse and view available hotels.
- **Room Management**: Display and manage room details and availability.
- **Booking Services**: Handle reservations and booking processes.
- **Profile Management**: User profile updates and password management.
- **Responsive Design**: Optimized for various devices with a clean, intuitive UI.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Angular CLI](https://angular.dev/tools/cli) (version 21 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hotel-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   # or
   ng serve
   ```

2. Open your browser and navigate to `http://localhost:4200/`.

The application will automatically reload when you make changes to the source files.

## Development

### Code Scaffolding

To generate a new component, run:
```bash
ng generate component component-name
```

For a complete list of available schematics, run:
```bash
ng generate --help
```

### Building

To build the project for production, run:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

- **Unit Tests**: Execute unit tests with Vitest:
  ```bash
  ng test
  ```

- **End-to-End Tests**: Run e2e tests (if configured):
  ```bash
  ng e2e
  ```

## Technologies Used

- **Angular**: Framework for building the application.
- **TypeScript**: Programming language.
- **RxJS**: Reactive programming library.
- **Vitest**: Testing framework.
- **Prettier**: Code formatter.


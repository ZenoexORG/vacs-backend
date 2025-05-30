# 🚗 Vehicle Access Control System (VACS) Backend

Backend service built with NestJS for VACS - a system designed to manage and control vehicle access in secured areas at UTB.

## ✅ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (latest stable version)
- Redis (for queue processing and caching)
- Git

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/ZenoexORG/vacs-backend.git
cd vacs-backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create an `.env` file in the project root based on the [`.env.example`](.env.example ) file

```
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=your_db_host.postgres.database.azure.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_strong_password
DB_SSL=true

# Authentication
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRATION=1h
COOKIE_SECRET=your_strong_cookie_secret

# API Keys
DEVICE_API_KEY=your_strong_random_generated_api_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:4200

# Redis Configuration (required for Bull queue processing)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_if_any

# Dwell Time Configuration (in minutes)
DWELL_TIME_DEFAULT_THRESHOLD=1
DWELL_TIME_CACHE_TIMEOUT_MINUTES=120

# Timezone
TIMEZONE=America/Bogota
```

4. Set up Redis
   - Make sure Redis server is running on your system or via Docker:
```bash
# Using Docker
docker run --name redis -p 6379:6379 -d redis:alpine

# Check if Redis is running
docker ps | grep redis
```

## 🚀 Running the Application

### Development

To run the application in development mode:

```bash
npm run start:dev
# or
yarn start:dev
```

### Production

To build and run in production mode:

```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:

```
http://localhost:{PORT}/docs
```

The API is organized around resource-based endpoints:

- `/auth` - Authentication and authorization
- `/employees` - Employee management
- `/users` - User management
- `/roles` - Role management
- `/permissions` - Permission management
- `/vehicles` - Vehicle management
- `/vehicle-types` - Vehicle type management
- `/access-logs` - Access log management
- `/incidents` - Incident management
- `/incident-messages` - Incident message management
- `/reports` - Report generation and management

## 📂 Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── config/           # Application configuration
├── database/         # Database configuration
├── filters/          # Exception filters
├── modules/          # Application modules
│   ├── access_logs/  # Access logs management
│   ├── auth/         # Authentication
│   ├── daily_reports/# Report generation
│   ├── dashboard/    # Dashboard data
│   ├── employees/    # Employee management
│   ├── incident_messages/ # Incident messages
│   ├── incidents/    # Incident management
│   ├── notifications/# Real-time notifications
│   ├── permissions/  # Permission management
│   ├── roles/        # Role management
│   ├── users/        # User management
│   ├── vehicle_types/# Vehicle type management
│   └── vehicles/     # Vehicle management
└── shared/           # Shared resources
    ├── decorators/   # Custom decorators
    ├── dtos/         # Data transfer objects
    ├── enums/        # Enumerations
    ├── guards/       # Authentication guards
    ├── interceptors/ # HTTP interceptors
    ├── interfaces/   # TypeScript interfaces
    ├── services/     # Shared services
    └── utils/        # Utility functions
```

## 🧪 Tests

To run unit tests:

```bash
npm run test
# or
yarn test
```

To run end-to-end tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## ✨ Key Features

- 🚙 Vehicle entry and exit record management
- 🔐 Role and permission-based authentication and authorization
- 📊 Daily and date-range report generation with PDF export
- 📈 Charts and statistics for vehicle traffic analysis
- ⚠️ Incident management system with threaded messages
- 🔔 Real-time notifications via WebSockets
- 🌐 RESTful API with comprehensive Swagger documentation
- 🔄 Automated daily report generation
- 📊 Queue-based background processing with Bull
- 🧩 Modular architecture for easy extensibility

## 🛠️ Technologies

- 🏗️ NestJS - A progressive Node.js framework
- 🗃️ TypeORM - ORM for TypeScript and JavaScript
- 🐘 PostgreSQL - Advanced open source database
- 🔑 JWT - For secure authentication
- 📋 Swagger - For comprehensive API documentation
- 📊 ChartJS - For generating report charts and visualizations
- 📄 PDFKit - For generating PDF reports
- 🔄 Socket.IO - For real-time notifications
- 📬 Bull - For background job processing
- 🧩 Redis - For caching and queue management

## 👨‍💻 Contributors

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <a href="https://github.com/L30N4RD018">
    <img src="https://github.com/L30N4RD018.png" width="60" height="60" alt="Leonardo Mendoza" style="border-radius: 50%;">
    <br>
    <sub><b>Leonardo Mendoza</b></sub>
  </a>
  
  <a href="https://github.com/XNeyMo">
    <img src="https://github.com/XNeyMo.png" width="60" height="60" alt="Neyan Montes" style="border-radius: 50%;">
    <br>
    <sub><b>Neyan Montes</b></sub>
  </a>
  
  <a href="https://github.com/AAlvarinoB">
    <img src="https://github.com/AAlvarinoB.png" width="60" height="60" alt="Alberto Alvarino" style="border-radius: 50%;">
    <br>
    <sub><b>Alberto Alvarino</b></sub>
  </a>
  
  <a href="https://github.com/MichaelTaboada2003">
    <img src="https://github.com/MichaelTaboada2003.png" width="60" height="60" alt="Michael Taboada" style="border-radius: 50%;">
    <br>
    <sub><b>Michael Taboada</b></sub>
  </a>
</div>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
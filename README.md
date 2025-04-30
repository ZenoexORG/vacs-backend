# 🚗 Vehicle Access Control System (VACS) Backend

Backend service built with NestJS for VACS - a system designed to manage and control vehicle access in secured areas at UTB.

## ✅ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (latest stable version)
- Git

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/vacs-backend.git
cd vacs-backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create an `.env` file in the project root based on the `.env.example` file

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
```

4. Run database migrations
```bash
npm run migration:run
# or
yarn migration:run
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
http://localhost:{{PORT}}/docs
```

## 📂 Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── config/           # Application configuration
├── database/         # Database configuration
├── modules/          # Application modules
│   ├── access_logs/  # Access logs management
│   ├── auth/         # Authentication
│   ├── vehicles/     # Vehicle management
│   └── ...
└── shared/           # Shared resources
    ├── decorators/
    ├── dtos/
    ├── enums/
    ├── guards/
    ├── interceptors/
    ├── interfaces/
    ├── services/
    └── utils/
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
- 📊 Daily and date-range report generation
- ⚠️ Incident management
- 📝 API documentation with Swagger

## 🛠️ Technologies

- 🏗️ NestJS - A progressive Node.js framework
- 🗃️ TypeORM - ORM for TypeScript and JavaScript
- 🐘 PostgreSQL - Advanced open source database
- 🔑 JWT - For secure authentication
- 📋 Swagger - For comprehensive API documentation


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
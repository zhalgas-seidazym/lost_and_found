# Lost and Found Platform

Lost and Found Platform is a web application designed to help users report and manage lost and found items. This project provides a backend API for handling user authentication, item management, and administrative controls.

## Features

- **User Management**: Sign up, log in, log out, and profile management.
- **Item Management**: Create, update, search, and delete lost or found items.
- **Email Notifications**: Verification emails and password reset functionality.
- **Admin Controls**: Manage users and oversee the platform's content.
- **API Documentation**: Interactive Swagger-based documentation.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zhalgas-seidazym/lost_and_found.git
   cd lost_and_found
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables. Create a `.env` file in the root directory and provide the following variables:

   ```env
   PORT=8000
   HOST=localhost
   MONGODB_URI=your_mongodb_connection_string
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   REDIS_DB=0
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=1d
   ROOT_EMAIL=your_email@gmail.com
   ROOT_EMAIL_PASS=your_email_password
   GCS_PROJECT_ID=your_google_cloud_project_id
   GCS_BUCKET_NAME=your_bucket_name
   ```

   **Note**: If you modify the `HOST` variable, you must regenerate the Swagger documentation by running `npm run swagger`.

4. Start the services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

5. Alternatively, you can start the development server directly:

   ```bash
   npm start
   ```

   This will launch the server on the port specified in the `.env` file (default: `8000`).

6. Access the application at `http://localhost:8000` (or the configured port).

## Usage

### API Endpoints

The API provides endpoints for managing users, items, and authentication. Full documentation is available at:

```
http://localhost:8000/docs
```

### Generate Swagger Documentation

To regenerate Swagger documentation, run:

   ```bash
   npm run swagger
   ```

This will generate a `swagger_output.json` file with updated API documentation.

### Running Tests

Currently, no tests are provided. To add tests, integrate your preferred testing framework and create test files.

### Key Scripts

- **Start Development Server**: `npm start`
- **Generate Swagger Documentation**: `npm run swagger`

## Tech Stack

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **MongoDB**: Database for storing data
- **Redis**: Cache for sessions and temporary tokens
- **Google Cloud Storage**: File storage
- **Swagger**: API documentation


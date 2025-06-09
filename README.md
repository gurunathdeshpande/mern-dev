# Student Feedback System

A web application for managing student feedback in educational institutions.

## Continuous Integration Status

[![CI](https://github.com/yourusername/student-feedback-devops/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/student-feedback-devops/actions/workflows/ci.yml)

## Setup Instructions

### Prerequisites

- Node.js (v16.x or v18.x)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-feedback-devops.git
cd student-feedback-devops
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Add the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

### Running Tests

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

### Running Linting

```bash
# Run backend linting
cd backend
npm run lint

# Run frontend linting
cd frontend
npm run lint
```

## CI/CD Pipeline

The project uses GitHub Actions for Continuous Integration. The pipeline:

1. Runs on push to main and develop branches
2. Runs on pull requests to main and develop branches
3. Tests against Node.js v16.x and v18.x
4. Performs the following checks:
   - Installs dependencies
   - Runs linting
   - Runs tests
   - Builds the application

### Setting up CI/CD

1. Add the following secrets to your GitHub repository:
   - `JWT_SECRET`: Your JWT secret key
   - `MONGODB_URI`: Your MongoDB connection string

2. The CI pipeline will automatically run on push and pull requests.

## Contributing

1. Create a new branch from develop
2. Make your changes
3. Run tests and linting locally
4. Create a pull request to develop
5. Ensure CI checks pass
6. Request review

## License

MIT 
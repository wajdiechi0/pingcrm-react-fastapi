# PingCRM React FastAPI

A modern CRM application built with React, FastAPI, and Supabase.

## Features

- User authentication and authorization
- Company management
- Contact management
- Modern UI with Material-UI and Tailwind CSS
- TypeScript support
- RESTful API with FastAPI
- Supabase backend for data storage

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Supabase account

## Project Structure

```
.
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript type definitions
│   └── package.json      # Frontend dependencies
│
└── backend/              # FastAPI backend application
    ├── app/             # Application code
    │   ├── api/         # API routes
    │   ├── core/        # Core functionality
    │   ├── schemas/     # Pydantic schemas
    │   └── services/    # Business logic
    ├── requirements.txt # Backend dependencies
    └── main.py         # Application entry point
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment and activate it:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up Supabase:
   - Create a new project in Supabase
   - Copy your project URL and service role key
   - Create a `.env` file in the backend directory:
     ```
     SUPABASE_URL=your_project_url
     SUPABASE_KEY=your_service_role_key
     ```

4. Initialize the database:
   ```bash
   python setup_supabase.py
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Backend API documentation is available at `http://localhost:8000/docs`
- Frontend development server runs at `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy the FastAPI application
3. Run database migrations

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the contents of the `dist` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
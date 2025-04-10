# PingCRM React FastAPI

A modern CRM application built with React, TypeScript, and FastAPI.

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
pingcrm-react-fastapi/
├── frontend/          # React frontend application
└── backend/           # FastAPI backend application
```

## Environment Variables

### Frontend (.env in frontend directory)
```env
VITE_API_URL=http://localhost:8000  # Backend API URL
```

### Backend (.env in backend directory)
```env
# Supabase Database
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key

# JWT Authentication
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://*.vercel.app,https://pingcrm-react-fastapi.vercel.app
```

## Development Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Configure environment variables in Render dashboard (these will be injected at runtime)
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## CI/CD Pipeline (CircleCI)

The project uses CircleCI for continuous integration and deployment of both frontend and backend:

1. Frontend deployment to Vercel
2. Backend deployment to Render

Required CircleCI environment variables:
- `VERCEL_TOKEN`: Vercel deployment token
- `RENDER_API_KEY`: Render API key
- `RENDER_SERVICE_ID`: Render service ID

Note: Backend environment variables are managed through Render's dashboard and injected at runtime.

## Development

- Backend API documentation is available at `http://localhost:8000/docs`
- Frontend development server runs at `http://localhost:5173`


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
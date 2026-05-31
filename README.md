# TaskFlow — MERN Stack Task Manager

A full-stack Task Management Web Application built with MongoDB, Express.js, React.js, and Node.js. Features user authentication, task management with filtering, pagination, and real-time status updates.

## Features

- **User Authentication** — Secure JWT-based registration and login
- **Task CRUD Operations** — Create, read, update, and delete tasks
- **Task Status Management** — Toggle between pending and completed states
- **Priority System** — Three-tier priority levels (High, Medium, Low)
- **Advanced Search** — Search across title and description fields
- **Filtering** — Filter tasks by status (pending/completed) and priority
- **Pagination** — Server-side pagination (8 tasks per page)
- **Form Validation** — Client-side and server-side validation with error messages
- **Responsive Design** — Mobile-friendly UI with Tailwind CSS
- **Dark Theme** — Modern dark interface for comfortable viewing

## Architecture Overview

### Technology Stack

**Frontend:**
- React 19 with Vite for fast development and optimized builds
- Tailwind CSS for utility-first styling
- Axios for HTTP requests with automatic JWT token injection
- React Router for SPA navigation
- React Hot Toast for notifications

**Backend:**
- Express.js for REST API
- MongoDB with Mongoose ODM for data persistence
- JWT (jsonwebtoken) for secure authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Deployment:**
- Vercel for hosting (frontend served through backend)
- MongoDB Atlas for cloud database

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (Vite)                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐│ │
│  │  │ Auth Context │  │ Router       │  │ Components     ││ │
│  │  │ (JWT + User) │  │ (SPA routes) │  │ (UI)           ││ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘│ │
│  │         │                                      │          │ │
│  │         └──────────────┬───────────────────────┘          │ │
│  │                        │                                   │ │
│  │                    Axios API Client                        │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Server                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Routes & Middleware                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ POST /api/auth/register    (Public)            │  │  │
│  │  │ POST /api/auth/login       (Public)            │  │  │
│  │  │ GET  /api/tasks            (Protected)         │  │  │
│  │  │ POST /api/tasks            (Protected)         │  │  │
│  │  │ PUT  /api/tasks/:id        (Protected)         │  │  │
│  │  │ PATCH /api/tasks/:id/toggle (Protected)        │  │  │
│  │  │ DELETE /api/tasks/:id      (Protected)         │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                        │                               │  │
│  │  ┌────────────────────┴───────────────────────────┐  │  │
│  │  │      Express Static Middleware                 │  │  │
│  │  │   (Serves /client/dist for frontend)           │  │  │
│  │  └────────────────────┬───────────────────────────┘  │  │
│  └─────────────────────────┼──────────────────────────────┘  │
│                            │                                  │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │            Authentication Middleware                  │  │
│  │  (JWT verification, user extraction)                 │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                            │                                  │
│  ┌────────────────────────┴──────────────────────────────┐  │
│  │          Mongoose Models & Validation                │  │
│  │  ┌──────────────┐           ┌──────────────┐         │  │
│  │  │ User Model   │           │ Task Model   │         │  │
│  │  │ - name       │           │ - title      │         │  │
│  │  │ - email      │           │ - description│         │  │
│  │  │ - password   │           │ - status     │         │  │
│  │  │ - timestamps │           │ - priority   │         │  │
│  │  │              │           │ - userId     │         │  │
│  │  └──────────────┘           │ - timestamps │         │  │
│  │                             └──────────────┘         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                  │
│                            ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Error Handler Middleware                   │  │
│  │   (Global error responses, logging)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │ MongoDB Connection
                            ▼
                   ┌──────────────────┐
                   │  MongoDB Atlas   │
                   │  - Users         │
                   │  - Tasks         │
                   │  - Indexes       │
                   └──────────────────┘
```

### Data Flow

**Authentication Flow:**
```
1. User submits login/register form
2. Frontend sends request to /api/auth/login or /api/auth/register
3. Backend validates credentials, hashes password (bcryptjs)
4. Backend creates JWT token and returns it
5. Frontend stores token in localStorage
6. Axios interceptor automatically includes JWT in Authorization header
```

**Task Management Flow:**
```
1. Frontend requests GET /api/tasks?page=1&status=pending
2. Backend JWT middleware verifies token
3. Backend queries MongoDB filtered by userId and parameters
4. Backend returns paginated results with total count
5. Frontend updates state and re-renders task list
6. User can create, update, delete, or toggle task status
7. Each change triggers API request with updated data
```

## Project Structure

```
taskflow/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTaskForm.jsx     # Task creation form
│   │   │   ├── TaskCard.jsx        # Individual task display
│   │   │   └── Icons.jsx           # SVG icon components
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main task management page
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance with interceptors
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── App.css                 # Global styles (Tailwind)
│   │   ├── index.css               # Base styles
│   │   └── main.jsx                # React entry point
│   ├── dist/                       # Built frontend (committed for deployment)
│   ├── public/
│   ├── index.html
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   ├── package.json
│   └── .env.production             # Production API URL
│
├── server/                         # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt
│   │   └── Task.js                 # Task schema with validation
│   ├── routes/
│   │   ├── auth.js                 # Auth endpoints (/register, /login)
│   │   └── tasks.js                # Task CRUD endpoints
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   └── taskController.js       # Task logic
│   ├── index.js                    # Express server entry point
│   ├── package.json
│   └── .env                        # Environment variables (production)
│
├── vercel.json                     # Vercel deployment config
├── package.json                    # Root package.json
├── .vercelignore                   # Files to ignore in deployment
├── .gitignore
├── DEPLOYMENT.md                   # Deployment guide
└── README.md                       # This file
```

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **MongoDB Atlas** account ([free tier available](https://www.mongodb.com/cloud/atlas)) or local MongoDB
- **Git** for version control
- **Vercel account** (optional, for deployment)

## Local Setup & Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mahtab-Madni/taskflow.git
cd taskflow
```

### Step 2: Install Dependencies

#### Option A: Install all at once (from root)
```bash
npm install
cd client && npm install && cd ../server && npm install
```

#### Option B: Install separately
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Server Configuration
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskManager?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

To generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**MongoDB Setup:**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free M0 tier is sufficient)
3. Create a database user with password
4. Whitelist your IP address
5. Copy the connection string and replace `username:password` with your credentials
6. Add database name (`taskManager`) to the connection string

#### Client Configuration
Create `client/.env.production`:
```env
VITE_API_URL=http://localhost:5000/api
```

For local development, the client will automatically use `http://localhost:5000/api` as defined in [client/src/utils/api.js](client/src/utils/api.js).

### Step 4: Start the Application

#### Option A: Run both frontend and backend concurrently
```bash
# From root directory
npm run dev
```

#### Option B: Run separately (requires 2 terminals)

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

#### Access the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Production Build

### Build Frontend
```bash
cd client
npm run build
```

This creates an optimized build in `client/dist/` folder.

### Run Server in Production
```bash
cd server
npm start
```

The server will serve the pre-built frontend from `client/dist/`.

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | ❌ No |
| POST | `/api/auth/login` | Authenticate and receive JWT | ❌ No |
| GET | `/api/auth/me` | Get current authenticated user | ✅ Yes |

### Task Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks (paginated) | ✅ Yes |
| POST | `/api/tasks` | Create new task | ✅ Yes |
| GET | `/api/tasks/:id` | Get specific task | ✅ Yes |
| PUT | `/api/tasks/:id` | Update task details | ✅ Yes |
| PATCH | `/api/tasks/:id/toggle` | Toggle task completion status | ✅ Yes |
| DELETE | `/api/tasks/:id` | Delete task | ✅ Yes |

### Query Parameters

**GET /api/tasks** supports the following query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-indexed) | `?page=2` |
| `limit` | number | Tasks per page | `?limit=10` |
| `status` | string | Filter by status: `pending` or `completed` | `?status=completed` |
| `priority` | string | Filter by priority: `low`, `medium`, or `high` | `?priority=high` |
| `search` | string | Search in title and description | `?search=meeting` |
| `sort` | string | Sort field with `-` for descending | `?sort=-createdAt` |

**Example Request:**
```bash
GET /api/tasks?page=1&status=pending&priority=high&search=urgent&sort=-dueDate
Authorization: Bearer <JWT_TOKEN>
```

## Database Schemas

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,           // Required, 2-50 characters
  email: String,          // Required, unique, valid email format
  password: String,       // Required, hashed with bcryptjs (salt rounds: 10)
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  title: String,          // Required, max 100 characters
  description: String,    // Optional, max 500 characters
  status: String,         // Enum: 'pending' (default) | 'completed'
  priority: String,       // Enum: 'low' | 'medium' (default) | 'high'
  dueDate: Date,          // Optional task due date
  dueTime: String,        // Optional time in HH:mm format
  userId: ObjectId,       // Required, reference to User (indexed)
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}

// Indexes:
// - userId: For fast task queries per user
// - createdAt: For date-based sorting
```

## Deployment Guide

### Deploy to Vercel

This project is configured for Vercel deployment with the following approach:

1. **Frontend is pre-built** and committed to `client/dist/`
2. **Express server serves the frontend** as static files
3. **Single Node.js deployment** on Vercel

#### Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Vercel Project:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select your project

3. **Set Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add the following:
     ```
     MONGO_URI=<your_mongodb_atlas_uri>
     JWT_SECRET=<your_jwt_secret>
     CLIENT_URL=<your_vercel_app_url>
     NODE_ENV=production
     ```

4. **Deploy:**
   - Vercel automatically deploys on push to main branch
   - Or manually trigger deployment from Vercel dashboard

5. **Verify Deployment:**
   - Visit your Vercel app URL
   - Test login and task creation
   - Check backend health: `<your-url>/api/health`

#### How Deployment Works
- When code is pushed, Vercel builds and deploys the server
- Pre-built frontend files in `client/dist/` are included
- Express serves frontend files + handles API requests
- Single endpoint handles both UI and API

## Deployment Approach

### Why this architecture?

**Traditional approach (separate builds):**
- Frontend deployed on Vercel static hosting
- Backend deployed on Vercel serverless functions
- Cross-origin (CORS) complexity
- Separate deployment processes

**Our approach (unified deployment):**
- Single Node.js server deployment
- Frontend built locally and committed to git
- Backend serves both API and frontend files
- Simpler configuration and fewer deployment steps
- Better control over full stack

### Build Process

When code is pushed to GitHub:
1. Vercel clones the repository
2. Detects `server/index.js` as the application entry point
3. Installs server dependencies
4. Starts the Express server
5. Express serves pre-built frontend from `client/dist/`

### Local Development vs Production

**Local (`npm run dev`):**
- Frontend runs on `localhost:5173` (Vite dev server)
- Backend runs on `localhost:5000`
- Uses `client/.env` configuration

**Production (Vercel):**
- Frontend built and packaged into `client/dist/`
- Backend serves frontend files + API
- Single URL for entire application
- Uses environment variables from Vercel settings

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct
- Test locally first before deploying

### Frontend Not Loading
- Ensure `client/dist/` exists with built files
- Check Express is serving static files correctly
- Verify routes in `vercel.json`

### API Calls Failing
- Check JWT token in browser localStorage
- Verify `MONGO_URI` environment variable
- Check server logs for error details
- Ensure authentication middleware is working

### CORS Errors
- Frontend and backend are same origin in production
- CORS configuration only needed for local development
- Check `CLIENT_URL` environment variable matches Vercel app URL

## Technologies Used

- **Frontend:** React 19, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Express.js, Node.js, MongoDB, Mongoose, JWT, bcryptjs
- **Deployment:** Vercel, MongoDB Atlas
- **Development:** npm, Git, VS Code

## File Naming Conventions

- **Components:** PascalCase (e.g., `TaskCard.jsx`, `AddTaskForm.jsx`)
- **Utilities:** camelCase (e.g., `api.js`)
- **Styles:** Global CSS or Tailwind utilities
- **Routes:** kebab-case (e.g., `/api/auth`, `/api/tasks`)

## Key Design Decisions

1. **Monorepo Structure:** Both frontend and backend in single repository for easier management
2. **Tailwind CSS:** Utility-first CSS for rapid UI development
3. **Context API:** State management for authentication (no Redux needed)
4. **JWT Authentication:** Stateless, scalable authentication
5. **Server-side Pagination:** Better performance and data management
6. **Axios Interceptors:** Automatic JWT injection and error handling
7. **Error Boundary:** Global error handling middleware on backend
8. **Pre-built Frontend:** Faster deployment and simpler Vercel configuration

## Performance Optimizations

- Vite for faster builds and dev server
- Code splitting in React components
- Server-side pagination (limits data transfer)
- MongoDB indexes on frequently queried fields
- Static file serving for frontend assets
- JWT for stateless authentication (no session store needed)

## Security Measures

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens for secure API authentication
- Protected routes on frontend (React Router)
- Middleware validation on backend
- CORS configured for specific origins
- Environment variables for sensitive data
- MongoDB indexes prevent injection attacks

## Future Enhancements

- Task categories/projects
- Task due dates with notifications
- Recurring tasks
- Team collaboration and task sharing
- Dark/light theme toggle
- Task attachments
- Activity history/audit log
- Email notifications
- Mobile app (React Native)

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open a GitHub issue in the repository.

## Deployment

**Backend** (e.g., Render, Railway):
- Set `NODE_ENV=production`
- Set `MONGO_URI` to your Atlas connection string
- Set a strong `JWT_SECRET`

**Frontend** (e.g., Vercel, Netlify):
- Set `REACT_APP_API_URL` to your deployed backend URL
- Build: `npm run build`

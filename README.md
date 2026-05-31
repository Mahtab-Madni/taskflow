# TaskFlow — MERN Stack Task Manager

A full-stack Task Management Web Application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- **User Authentication** — Register, Login, JWT-based protected routes
- **Task CRUD** — Create, Read, Update, Delete tasks
- **Toggle Status** — Mark tasks as pending or completed
- **Priority Levels** — High, Medium, Low
- **Search & Filter** — Search by title/description, filter by status and priority
- **Pagination** — Server-side pagination (8 tasks per page)
- **Form Validation** — Client-side and server-side validation
- **Responsive UI** — Works on desktop and mobile

## Project Structure

```
task-manager/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── AddTaskForm.js
│       │   └── TaskCard.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Dashboard.js
│       │   ├── Login.js
│       │   └── Register.js
│       ├── utils/
│       │   └── api.js
│       ├── App.js
│       ├── App.css
│       └── index.js
│
├── server/                  # Node.js + Express backend
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

## Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Install all dependencies

```bash
npm run install-all
```

Or manually:

```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure environment variables

**Server** — Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

> For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

**Client** — Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the application

**Run both together (recommended):**

```bash
npm run dev
```

**Or separately:**

```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks (paginated) | Private |
| POST | `/api/tasks` | Create a task | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update a task | Private |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status | Private |
| DELETE | `/api/tasks/:id` | Delete a task | Private |

#### Query Parameters for GET /api/tasks
| Param | Description | Example |
|-------|-------------|---------|
| `page` | Page number | `?page=2` |
| `limit` | Items per page | `?limit=10` |
| `status` | Filter by status | `?status=pending` |
| `priority` | Filter by priority | `?priority=high` |
| `search` | Search title/description | `?search=meeting` |
| `sort` | Sort field | `?sort=-createdAt` |

## Database Schemas

### User Schema
```js
{
  name: String,       // required, 2-50 chars
  email: String,      // required, unique
  password: String,   // hashed with bcrypt
  timestamps: true
}
```

### Task Schema
```js
{
  title: String,       // required, max 100 chars
  description: String, // optional, max 500 chars
  status: String,      // 'pending' | 'completed'
  priority: String,    // 'low' | 'medium' | 'high'
  userId: ObjectId,    // reference to User
  timestamps: true
}
```

## Evaluation Criteria Coverage

| Criteria | Implementation |
|----------|----------------|
| Code Quality | Modular structure, separated concerns, consistent naming |
| UI/UX | Dark theme, responsive layout, smooth animations |
| Functionality | Full CRUD, auth, toggle, search, filter, pagination |
| Error Handling | Server-side validation, global error handler, client toast notifications |
| Creativity | Clean aesthetic, priority badges, stats dashboard |
| Bonus: Search | ✅ Search by title & description |
| Bonus: Pagination | ✅ Server-side pagination |

## Deployment

**Backend** (e.g., Render, Railway):
- Set `NODE_ENV=production`
- Set `MONGO_URI` to your Atlas connection string
- Set a strong `JWT_SECRET`

**Frontend** (e.g., Vercel, Netlify):
- Set `REACT_APP_API_URL` to your deployed backend URL
- Build: `npm run build`

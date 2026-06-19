# KANANK

Track every rupee, master your money.

KANANK is a premium full-stack personal finance management app built with a modern fintech-inspired UI and a scalable backend.

## 🚀 Live Demo

- **Frontend:** https://kanank-finance.vercel.app
- **Backend API:** https://kanank-api.railway.app
- **API Documentation:** https://kanank-api.railway.app/api/docs

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, Framer Motion, Recharts, Lucide React, React Hot Toast, Zustand
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT Authentication

## Structure

- `src/` — frontend (React + Vite)
- `server/` — backend (Express.js)

## Run Locally

```bash
# Install dependencies
npm install
cd src && npm install
cd ../server && npm install

# Start frontend dev server (localhost:5173)
cd src && npm run dev

# In another terminal, start backend (localhost:4000)
cd server && npm run dev
```

## Environment Setup

Create a `.env` file in `server/`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
```

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set build command: `cd src && npm run build`
4. Set output directory: `src/dist`
5. Deploy automatically on push to main

### Backend (Railway)

1. Connect GitHub repository to [Railway](https://railway.app)
2. Add MongoDB service
3. Set environment variables in Railway dashboard:
   - `MONGODB_URI` (from Railway MongoDB)
   - `JWT_SECRET` (generate a secure key)
   - `PORT=4000`
4. Deploy automatically on push to main

### Alternative Backend Hosts
- **Render:** https://render.com (free tier available)
- **Heroku:** https://heroku.com (paid, but reliable)
- **AWS Elastic Beanstalk:** https://aws.amazon.com

## Features

✨ Premium fintech dashboard with:
- Real-time transaction tracking
- Category-wise expense breakdown (ring chart)
- Income vs expense analytics
- Smart insights card with automated calculations
- Glassmorphism UI with smooth animations
- Mobile-responsive design
- JWT-based authentication
- Secure transaction management

## Notes

- Frontend uses Vite and Tailwind.
- Backend uses Express and MongoDB.
- Add a `.env` file in `server/` for `MONGODB_URI` and `JWT_SECRET`.
- Sidebar toggle moved to top-right corner for better mobile UX
- All components use Framer Motion for smooth animations


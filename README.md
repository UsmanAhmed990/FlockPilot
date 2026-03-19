# Home Ziaka - Homemade Food Delivery Platform

A production-level MERN stack food delivery application connecting customers with local home chefs.

## Features

- 🍽️ Browse homemade food from local chefs
- 🥗 Diet-specific meal plans (Keto, Diabetic, Vegan, Desi)
- 🛒 Shopping cart with real-time updates
- 👨‍🍳 Chef dashboard for menu management
- 🔐 Session-based authentication
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

**Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Auth:** Session-based (express-session + connect-mongo)

## Quick Start

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Credentials

The application supports three user roles:
- **Customer** - Browse and order food
- **Chef** - Manage menu and orders
- **Admin** - Platform management

Register via `/signup` and select your role.

## Environment Variables

Create `backend/.env`:
```
PORT=5020
MONGO_URI=mongodb://localhost:27017/FlockPilot
SESSION_SECRET=your_secret_key
```

## API Documentation

See [walkthrough.md](walkthrough.md) for complete API documentation.

## Project Structure

```
├── backend/          # Express API server
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Route handlers
│   ├── routes/       # API routes
│   └── middleware/   # Auth & validation
└── frontend/         # React application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── features/    # Redux slices
    │   └── pages/       # Route pages
```

## License

MIT

---

Built with ❤️ for homemade food lovers

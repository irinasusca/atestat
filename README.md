# Clinicum Center Cluj

A full-stack web application built as my atestat project, serving as both a presentation website and a medical appointment management platform for Clinicum Center Cluj, a dermatology clinic.

<img width="1486" height="762" alt="image" src="https://github.com/user-attachments/assets/01627819-8166-4192-a18d-359023f91add" />

## Why this project?

I could have picked something much easier to do for my atestat, but I have wanted to learn how to properly implement a safe auth system using jwt for a while, and this was the perfect opportunity for me get started with it. 
I also learned a lot about working with a database and about full-stack project architecture.

I chose this theme because I have a friend who owns a dermatology clinic, and upon seeing their website, there were a couple things bugging me about its UI and the user flow. That got me thinking about how 
I would have gone about it, and that got me actually doing it. 

I wanted it to be perfect, so I worked on it until I felt like I would be content with it being used in production, 

## Deployment

If you want to check it out yourself, it is currently being hosted live using the free plan on Render.

Originally I had this accessible on github pages, with only the backend on Render. But, unfortunately, because cross-site cookie restrictions on mobile browsers (Safari ITP and Chrome) are automatically enabled on all phones, the backend didn't work on mobile.

The application is now deployed with *both* frontend and backend served from the same origin on Render, which resolved this issue I had.

- **Live:** https://atestat.onrender.com
- Build: Vite compiles the frontend into `app/dist/`, which Express serves as static files
- The backend handles all `/api/*` routes; everything else is served from the static build

  
## Overview

The platform has two main features: 
- A full presentation website with information about the clinic's services, doctors, pricing and locations;
- An authenticated section for managing medical appointments. Three user roles exist with distinct capabilities, and the entire system is built with security, responsiveness and comprehensible code as my main priorities.

## Tech Stack

![My Skills](https://skillicons.dev/icons?i=ts,vite,tailwind,figma,js,nodejs,expressjs,postgres)

**Frontend**: Figma, Vite, TailwindCSS, Typescript 

**Backend**: Node.js, Express

**Database**: Postgresql, hosted with Neon

**Auth & Security**:
- JWT (JSON Web Tokens) for session management via HttpOnly cookies
- bcrypt for password hashing
- Google OAuth 2.0 for social login
- Input validation with Zod
- Role-based access control on all protected routes

## Features

### Public Website
- Intuitive home page, everything you would need to know structured nicely
- Hero, doctors and review carousels
- Personalized about page
- Presentation pages for all clinic services, each with dedicated detail pages
- Doctor profiles and specializations
- Pricing information
- Clinic locations and weekly schedules
- Fully responsive on mobile and desktop

### Patient
- Register and log in with email/password or Google OAuth 2.0
- Browse available doctors filtered by specialization or location
- Book appointments from a doctor's available time slots
- View current and past appointments
- Cancel upcoming appointments

### Doctor
- View current and past appointments assigned to them
- Manage weekly schedule through an interactive calendar (08:00–18:00)
- Modifying the schedule automatically cancels any existing appointments that fall outside the new availability

### Admin
- Promote any user to doctor or admin role
- Delete users by email

## Project Structure

```
atestat/
├── app/                  # Frontend
│   ├── src/              # TypeScript source files
│   ├── services/         # Individual service detail pages
│   ├── public/           # Static assets
│   └── *.html            # Page templates
└── server/               # Backend
    ├── controllers/      # Route handlers
    ├── services/         # Business logic
    ├── routes/           # Express route definitions
    ├── middlewares/       # Auth and role middleware
    ├── db/               # Database queries and repos
    └── config/           # App configuration
```

## Security Considerations

- Passwords are hashed with bcrypt before storage
- JWT tokens are stored in HttpOnly cookies, preventing javascript access
- `SameSite` and `Secure` cookie flags enforced in production
- All protected API routes require a valid JWT, verified server-side on every request
- Race condtion prevention enforced from both the database and the backend services
- Role-based middleware prevents privilege escalation between patient, doctor and admin roles
- Google OAuth tokens are verified server-side using the official `google-auth-library` before any account action is taken
- Input validated with Zod schemas on the backend


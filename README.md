# E-Commerce Store

A modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a responsive design, real-time cart management, and secure payment processing.

## Features

- 🛍️ **Product Management**
  - Browse products by categories
  - Featured products section
  - Product search and filtering
  - Admin panel for product management

- 🛒 **Shopping Cart**
  - Real-time cart updates
  - Quantity management
  - Persistent cart data
  - Automatic cart cleanup for deleted products

- 📊 **Sales Analytics**
  - Real-time sales dashboard
  - Revenue tracking and reporting

- 💳 **Secure Payments**
  - Stripe integration for secure payments

- 🎟️ **Coupon System**
  - Automatic coupon generation for large purchases

- 👤 **User Features**
  - User authentication and authorization
  - Role-based access control (Admin/Customer)
  - Profile management

## Tech Stack

### Frontend
- React.js
- Zustand (State Management)
- Tailwind CSS
- Framer Motion (Animations)
- Axios (API Client)
- React Router
- React Hot Toast (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB
- Redis (Caching)
- Cloudinary (Image Storage)
- Stripe (Payment Processing)
- JWT (Authentication)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Stripe Account
- Cloudinary Account

## Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/shivam-kanojia-gh/e-commerce-store.git
cd e-commerce-store
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

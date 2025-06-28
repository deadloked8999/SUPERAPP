# 🚀 SUPERAPP

A modern full-stack nightclub management application built with React, TypeScript, Express, and Vite.

## ✨ Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Updates**: WebSocket support for live data
- **Role-based Access**: Multiple user roles (Admin, Dancer, Promoter, etc.)
- **Mobile Responsive**: Optimized for all device sizes
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Authentication**: Secure user authentication system

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript, WebSocket
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: React Query (TanStack Query)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deadloked8999/SUPERAPP.git
   cd SUPERAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with your database configuration
   cp .env.example .env
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:5000

## 📁 Project Structure

```
SUPERAPP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and schemas
└── attached_assets/      # Static assets
```

## 🎯 Available Scripts

- `npm run dev` - Start development server (client + server)
- `npm run client` - Start Vite dev server only
- `npm run server` - Start Express server only
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌐 Deployment

### Replit
This project is optimized for Replit deployment. Simply:
1. Fork this repository
2. Import to Replit
3. Click "Run" to start the application

### Other Platforms
The application can be deployed to any Node.js hosting platform:
- Vercel
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/deadloked8999/SUPERAPP/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ for the nightlife industry** 
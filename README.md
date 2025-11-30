# Open Archive Collective

A movement to liberate information, education, and knowledge for every single soul.

## Overview

The Open Archive Collective is a web application dedicated to the free distribution of knowledge. It serves as a platform to advocate for the liberation of information from paywalls and restrictions, and provides a space for sharing educational resources, books, research papers, and software.

This project is built with modern web technologies, focusing on performance, accessibility, and a clean user experience. It features a full-stack architecture with a React frontend and a Node.js/Express backend connected to MongoDB.

## Features

-   **Manifesto**: A comprehensive declaration of our philosophy regarding the freedom of knowledge.
-   **Library**: A searchable collection of free resources (books, research, software).
-   **Mission**: Detailed information about our core values: Universal Access, Freedom First, Community Driven, and Privacy Respected.
-   **Contribute**: A portal for users to upload and share knowledge with the world.
-   **Responsive Design**: Fully responsive interface built with Tailwind CSS.
-   **Full-Stack API**: Robust backend API for managing resources and user contributions.

## Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Form Handling**: React Hook Form + Zod

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ODM**: [Mongoose](https://mongoosejs.com/)
-   **Authentication**: (Planned/In-progress)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, pnpm, or bun
-   MongoDB (Local instance or Atlas cluster)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd open-archive-collective
    ```

2.  **Frontend Setup**:
    ```bash
    # Install frontend dependencies
    npm install
    ```

3.  **Backend Setup**:
    ```bash
    # Navigate to server directory
    cd server
    
    # Install backend dependencies
    npm install
    ```

### Configuration

1.  **Backend Environment Variables**:
    Create a `.env` file in the `server/` directory based on `.env.example`:
    ```bash
    cp server/.env.example server/.env
    ```
    
    Update `server/.env` with your configuration:
    ```env
    PORT=5001
    MONGODB_URI=mongodb://localhost:27017/open-archive-collective
    ```

### Running the Application

You need to run both the frontend and backend servers.

1.  **Start the Backend**:
    Open a terminal and run:
    ```bash
    cd server
    npm run dev
    ```
    The backend API will run on `http://localhost:5001`.

2.  **Start the Frontend**:
    Open a new terminal and run:
    ```bash
    npm run dev
    ```
    The frontend application will run on `http://localhost:8080`.

### Building for Production

1.  **Frontend**:
    ```bash
    npm run build
    ```

2.  **Backend**:
    The backend is ready to run with `node index.js` (or via a process manager like PM2).

## Project Structure

```
.
├── public/             # Static assets
├── server/             # Backend code
│   ├── index.js        # Entry point
│   ├── package.json    # Backend dependencies
│   └── .env            # Environment variables (not committed)
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # shadcn/ui primitive components
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Manifesto.tsx
│   │   ├── Library.tsx
│   │   └── ...
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Frontend entry point
├── package.json        # Frontend dependencies
└── README.md           # Project documentation
```

## Contributing

We welcome contributions from everyone who believes in the freedom of knowledge.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m "Add some amazing feature"`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

-   Built with [Lovable](https://lovable.dev/)
-   Icons by [Lucide](https://lucide.dev/)
-   UI components by [shadcn/ui](https://ui.shadcn.com/)

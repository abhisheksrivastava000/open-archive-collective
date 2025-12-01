# Open Archive Collective

> "If you have access to books, make copies and release them onto the internet."

The **Open Archive Collective** is a decentralized, peer-to-peer (P2P) platform dedicated to the liberation and free distribution of knowledge. It combines modern web technologies with the BitTorrent protocol to ensure that educational resources, research papers, and software remain accessible, uncensorable, and permanent.

## 🚀 How It Works

The platform operates on a **Hybrid P2P Architecture**:

1.  **Decentralized Distribution**: Files are shared using the [WebTorrent](https://webtorrent.io/) protocol. When a user views a file, they become a "peer," helping to seed that file to others.
2.  **Server-Side Persistence (Hybrid Mode)**: To ensure availability even when no peers are online, the central server acts as a permanent "Super Seeder." It stores uploaded files and seeds them via WebTorrent 24/7.
3.  **Direct Access**: For users behind restrictive firewalls or without P2P capabilities, files are also available via direct HTTP download from the server.

## ✨ Features

- **📚 Knowledge Library**: A searchable, open-access catalog of books, papers, and tools.
- **⚡ P2P Streaming**: Stream video and audio content directly in the browser via WebTorrent.
- **🛡️ Hybrid Seeding**: Files are seeded by both the server and connected clients, maximizing availability and speed.
- **💾 Direct Downloads**: Fallback HTTP download links for instant access.
- **📢 Manifesto**: A declaration of our core values: Universal Access, Freedom First, and Privacy.
- **📤 Contribute**: Easy-to-use interface for uploading and "torrent-izing" content.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **P2P Engine**: [WebTorrent](https://webtorrent.io/) (Browser Client)
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State**: [TanStack Query](https://tanstack.com/query/latest)
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js & Express
- **P2P Engine**: `webtorrent` (Node Client) + `create-torrent`
- **Database**: MongoDB (Metadata & Magnet Links)
- **Storage**: Local filesystem (served statically & seeded)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/open-archive-collective.git
    cd open-archive-collective
    ```

2.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    ```

### Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/open-archive-collective
```

### Running the Application

You need to run both the backend (tracker/seeder) and the frontend.

**1. Start the Backend**

```bash
cd server
npm run dev
# Server runs on http://localhost:5001
# Files are served at http://localhost:5001/uploads/
```

**2. Start the Frontend**

```bash
# In the root directory
npm run dev
# Frontend runs on http://localhost:8080
```

## 📂 Project Structure

```
.
├── server/                 # Backend Node.js Application
│   ├── models/             # Mongoose Schemas (Torrent metadata)
│   ├── routes/             # API Routes (Uploads, Listing)
│   ├── services/           # Seeder Service (WebTorrent logic)
│   ├── uploads/            # Physical file storage
│   └── index.js            # Server entry point
├── src/                    # Frontend React Application
│   ├── components/         # UI Components (TorrentPlayer, etc.)
│   ├── pages/              # Views (Library, Contribute, etc.)
│   └── lib/                # Utilities
└── ...
```

## 🤝 Contributing

We welcome contributions! Whether it's adding new features, fixing bugs, or simply seeding content.

1.  Fork the repo.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push and open a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

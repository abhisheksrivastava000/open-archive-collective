# Open Archive Collective

> "If you have access to books, make copies and release them onto the internet."

The **Open Archive Collective** is a decentralized, peer-to-peer (P2P) platform dedicated to the liberation and free distribution of knowledge. It combines modern web technologies with the BitTorrent protocol to ensure that educational resources, research papers, and software remain accessible, uncensorable, and permanent.

## 🚀 How It Works

The platform operates on a **Pure P2P Architecture** (similar to The Pirate Bay):

1.  **Client-Side Seeding**: Files are never uploaded to the server. Instead, they reside on the uploader's device. The uploader's browser acts as the initial "seed".
2.  **Metadata Indexing**: The central server acts only as a directory. It stores the **Magnet Link**, **Info Hash**, and metadata (title, description), but not the file itself.
3.  **Decentralized Distribution**: When a user wants a file, their browser connects directly to the uploader (and other peers) via [WebTorrent](https://webtorrent.io/) over WebRTC to download the content.

## ✨ Features

- **📚 Knowledge Library**: A searchable, open-access catalog of books, papers, and tools.
- **⚡ P2P Streaming**: Stream video and audio content directly in the browser via WebTorrent.
- **🌐 True Decentralization**: Content is hosted by the community. If the server goes down, the files still exist on user devices.
- **🚫 Zero-Knowledge Server**: The server has no knowledge of the file contents, only their cryptographic hashes.
- **📢 Manifesto**: A declaration of our core values: Universal Access, Freedom First, and Privacy.
- **📤 Contribute**: Contribute by seeding files directly from your browser. Keep the tab open to keep the file alive!

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **P2P Engine**: [WebTorrent](https://webtorrent.io/) (Browser Client)
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State**: [TanStack Query](https://tanstack.com/query/latest)
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js & Express
- **Database**: MongoDB (Metadata & Magnet Links)
- **Architecture**: Lightweight REST API (No file storage)

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
PORT=3001
MONGODB_URI=mongodb://localhost:27017/open-archive-collective
```

### Running the Application

You need to run both the backend (tracker/seeder) and the frontend.

**1. Start the Backend**

```bash
cd server
npm run dev
# Server runs on http://localhost:3001
# Acts as a metadata index only
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

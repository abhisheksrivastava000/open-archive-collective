# Features

This document outlines the key features of the Open Archive Collective platform.

## 1. Core Features

### 1.1. File Upload and Torrent Creation
*   **Client-Side Torrenting:** Users can select a file from their local machine, and the torrent will be created directly in their browser. This reduces server load and enhances user privacy.
*   **Metadata:** Users can add a title and description to their uploads to provide context for other users.
*   **Initial Seeding:** The uploader's browser will act as the first seeder for the file.

### 1.2. Decentralized File Sharing
*   **Peer-to-Peer:** Files are transferred directly between users' browsers (peers) using WebTorrent.
*   **Redundancy:** As more users download and seed a file, the network becomes more robust, ensuring the file remains available even if the original seeder goes offline.

### 1.3. Torrent Library
*   **Browse Content:** Users can view a library of all available torrents.
*   **Torrent Details:** Each entry in the library will display the torrent's title, description, file size, and the number of seeders and leechers.

### 1.4. In-Browser Downloading and Streaming
*   **One-Click Download:** Users can start downloading a file with a single click.
*   **Streaming:** For supported file types (e.g., video and audio), the content can be streamed directly in the browser as it downloads.
*   **Automatic Seeding:** Once a user starts downloading a file, they will automatically begin seeding it to other peers.

## 2. Technical Features

### 2.1. Real-Time Updates
*   **Live Stats:** The number of seeders and leechers for each torrent will be updated in real-time using WebSockets (`socket.io`).
*   **Instantaneous Library Updates:** New torrents will appear in the library as soon as they are added.

### 2.2. Responsive Design
*   **Mobile-Friendly:** The user interface will be fully responsive and accessible on a wide range of devices, from desktops to mobile phones.

## 3. Future Features (Out of Scope for Initial Implementation)

*   **User Authentication:** Allow users to create accounts to manage their uploads.
*   **Search and Filtering:** Implement search functionality to allow users to easily find specific torrents. Add options to filter torrents by category, size, or other criteria.
*   **Commenting and Rating:** Allow users to comment on and rate torrents.
*   **Private Torrents:** Add the ability to create private torrents that are only accessible to specific users.
*   **Advanced Torrent Controls:** Give users more control over their torrents, such as the ability to pause, resume, and set bandwidth limits.

# Project Overview: Open Archive Collective

## 1. Introduction

The Open Archive Collective is a decentralized, peer-to-peer (P2P) file-sharing platform built on WebTorrent technology. It empowers users to create a censorship-resistant, community-driven library of digital content. Users can upload files, which are converted into torrents and shared across a network of peers. This ensures that content remains accessible without relying on centralized servers for distribution.

The project is comprised of two main components:
1.  **A React/Vite frontend:** A modern, responsive user interface for uploading, browsing, and downloading content.
2.  **A Node.js/Express backend:** A lightweight server responsible for managing torrent metadata, and acting as an initial seeder and a WebTorrent tracker.

## 2. Core Concepts

### 2.1. WebTorrent
The platform leverages **WebTorrent**, a streaming torrent client for Node.js and the browser. Unlike traditional BitTorrent clients, WebTorrent uses WebRTC for P2P transport, allowing it to work in web browsers without any plugins or extensions. This enables users to download and seed content directly from their browsers.

### 2.2. Decentralized by Design
Once a file is uploaded and becomes a torrent, it is no longer solely dependent on the original uploader or the central server. As more users download the file, they also become seeders, strengthening the network and increasing the availability and download speed of the content.

### 2.3. The Role of the Server
The server plays a few key roles:
*   **Metadata Storage:** It stores information about the torrents (title, description, info hash, etc.) in a MongoDB database, making it easy to browse the library of available content.
*   **Tracker:** The server can help peers find each other, though the use of public trackers means the network is not solely reliant on this server. It does *not* store physical files or act as an initial seeder.

## 3. User Flow

1.  **Contribute:** A user visits the "Contribute" page and selects a file to share. They provide a title and description for the file.
2.  **Torrent Creation:** The browser creates a torrent from the selected file and generates a magnet URI. The user's browser begins to seed the file.
3.  **Metadata Upload:** The magnet URI and the file's metadata are sent to the server and stored in the database. The server acts as a metadata store only.
4.  **Library:** The new torrent appears in the "Library" page, where all users can see it.
5.  **Download & Seeding:** When another user clicks on a torrent in the library, their browser starts downloading the file using the magnet URI. Once the download is complete (or even while it's in progress), their browser also begins to seed the file to other peers.

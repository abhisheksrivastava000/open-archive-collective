# Implementation Plan

This document provides a step-by-step plan for implementing the features of the Open Archive Collective.

## Phase 1: Backend Development

### Step 1.1: Refine the Torrent Model
*   **File:** `server/models/Torrent.js`
*   **Task:** Ensure the Mongoose schema matches the data we need to store, including fields for `title`, `description`, `infoHash`, `magnetURI`, `fileName`, `fileSize`, `category`, and `uploadedBy`. The current model is already very close to what is needed.

### Step 1.2: Update the Upload Route (Zero-Knowledge Server)
*   **File:** `server/routes/torrentRoutes.js`
*   **Task:** Modify the `POST /api/torrents/upload` endpoint to *only* handle metadata sent from the client. The client will create the torrent, generate the magnet link, and extract necessary metadata (magnetURI, infoHash, fileName, fileSize, title, description, category). The server will then receive this metadata (as JSON, not a file upload) and save it to the database. The server will *not* receive or store the physical file, nor will it act as a seeder.

### Step 1.3: Enhance Real-time Communication
*   **File:** `server/index.js`, `server/routes/torrentRoutes.js`
*   **Task:**
    *   Integrate `socket.io` into the upload route.
    *   When a new torrent's metadata is successfully saved, emit a `torrent:new` event to all connected clients with the new torrent's data.
    *   (Removed: Server no longer tracks or emits `torrent:update` for seeder/leecher counts directly.)

## Phase 2: Frontend Development

### Step 2.1: Create the Contribution Page
*   **File:** `src/pages/Contribute.tsx`
*   **Task:**
    *   Build a form with fields for `title`, `description`, and a file input.
    *   Use the `useWebTorrent` hook to get a WebTorrent client instance.
    *   On form submission:
        1.  Create a torrent from the selected file using `client.seed()`.
        2.  Once the torrent is created, extract the `magnetURI`, `infoHash`, `name` (for `fileName`), and `length` (for `fileSize`).
        3.  Construct a JSON object with the extracted metadata (`title`, `description`, `magnetURI`, `infoHash`, `fileName`, `fileSize`, `category`).
        4.  Make a `POST` request to the `/api/torrents/upload` endpoint with the JSON metadata (not `FormData` with a file).
        5.  Display progress and success/error messages to the user.

### Step 2.2: Build the Library Page
*   **File:** `src/pages/Library.tsx`
*   **Task:**
    *   Use `@tanstack/react-query` to fetch the list of torrents from the `/api/torrents` endpoint.
    *   Display the torrents in a grid or list format. Each item should show the title, description, file size, and dynamic seeder/leecher counts (these counts will be observed client-side for active torrents, or remain 0 if not actively being downloaded by the current client).
    *   Implement a WebSocket listener to handle the `torrent:new` and `torrent:update` events and update the torrent list in real-time.
    *   Add a "Download" button to each torrent.

### Step 2.3: Implement Downloading and Streaming
*   **File:** `src/components/TorrentPlayer.tsx`
*   **Task:**
    *   When a user clicks the "Download" button on a torrent in the library:
        1.  Pass the `magnetURI` to a dedicated component or view, such as `TorrentPlayer.tsx`.
        2.  Use the `useWebTorrent` hook to get the client instance.
        3.  Use `client.add()` with the `magnetURI` to start downloading the torrent.
        4.  Listen for the `torrent.on('done', ...)` event to know when the download is complete.
        5.  For video/audio files, append the file to a `<video>` or `<audio>` element to enable streaming while the download is in progress.
        6.  Provide a button to save the file to the user's local machine using `file.getBlobURL()` or a similar method.

## Phase 3: Testing and Refinement

### Step 3.1: Frontend Testing
*   **Task:**
    *   Test the file upload and torrent creation process thoroughly (ensuring only metadata is sent to server).
    *   Verify that the library page displays all torrents correctly and updates in real-time.
    *   Test the download and streaming functionality with various file types.
    *   Ensure the UI is responsive and works well on different screen sizes.

### Step 3.2: Backend Testing (Metadata Only)
*   **Task:**
    *   Write unit tests for the API endpoints (if time permits), focusing on metadata storage and retrieval.
    *   Verify that the WebSocket `torrent:new` events are being emitted correctly upon metadata submission.
    *   (Removed: Server-side seeding and torrent restoration tests are no longer applicable.)

### Step 3.3: End-to-End Testing
*   **Task:**
    *   Perform end-to-end tests of the entire user flow, from uploading a file (client-side seeding and metadata submission) to downloading it on another client.
    *   Test with multiple clients to ensure the P2P network is working as expected (client-to-client file transfer).

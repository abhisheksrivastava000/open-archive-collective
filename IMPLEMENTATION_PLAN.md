# Implementation Plan

This document provides a step-by-step plan for implementing the features of the Open Archive Collective.

## Phase 1: Backend Development

### Step 1.1: Refine the Torrent Model
*   **File:** `server/models/Torrent.js`
*   **Task:** Ensure the Mongoose schema matches the data we need to store, including fields for `title`, `description`, `infoHash`, `magnetURI`, `fileName`, `fileSize`, `category`, and `uploadedBy`. The current model is already very close to what is needed.

### Step 1.2: Update the Upload Route
*   **File:** `server/routes/torrentRoutes.js`
*   **Task:** Modify the `POST /api/torrents/upload` endpoint to handle the metadata sent from the client. The client will create the torrent and magnet link, and the server will receive the metadata and the file. The server will then save the metadata to the database and start seeding the file.

### Step 1.3: Enhance Real-time Communication
*   **File:** `server/index.js`, `server/routes/torrentRoutes.js`
*   **Task:**
    *   Integrate `socket.io` into the upload route.
    *   When a new torrent is created, emit a `torrent:new` event to all connected clients with the new torrent's data.
    *   In the `torrentHealth.js` service, when the number of seeders or leechers for a torrent changes, emit a `torrent:update` event.

## Phase 2: Frontend Development

### Step 2.1: Create the Contribution Page
*   **File:** `src/pages/Contribute.tsx`
*   **Task:**
    *   Build a form with fields for `title`, `description`, and a file input.
    *   Use the `useWebTorrent` hook to get a WebTorrent client instance.
    *   On form submission:
        1.  Create a torrent from the selected file using `client.seed()`.
        2.  Once the torrent is created, extract the `magnetURI`, `infoHash`, `name` (for `fileName`), and `length` (for `fileSize`).
        3.  Create a `FormData` object and append the file and the metadata.
        4.  Make a `POST` request to the `/api/torrents/upload` endpoint with the `FormData`.
        5.  Display progress and success/error messages to the user.

### Step 2.2: Build the Library Page
*   **File:** `src/pages/Library.tsx`
*   **Task:**
    *   Use `@tanstack/react-query` to fetch the list of torrents from the `/api/torrents` endpoint.
    *   Display the torrents in a grid or list format. Each item should show the title, description, file size, and the number of seeders and leechers.
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
    *   Test the file upload and torrent creation process thoroughly.
    *   Verify that the library page displays all torrents correctly and updates in real-time.
    *   Test the download and streaming functionality with various file types.
    *   Ensure the UI is responsive and works well on different screen sizes.

### Step 3.2: Backend Testing
*   **Task:**
    *   Write unit tests for the API endpoints (if time permits).
    *   Test the server's seeding and torrent restoration functionality.
    *   Verify that the WebSocket events are being emitted correctly.

### Step 3.3: End-to-End Testing
*   **Task:**
    *   Perform end-to-end tests of the entire user flow, from uploading a file to downloading it on another client.
    *   Test with multiple clients to ensure the P2P network is working as expected.

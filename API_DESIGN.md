# API Design

This document outlines the design of the API for the Open Archive Collective.

## 1. Base URL

The API will be available at `/api`.

## 2. Endpoints

### 2.1. Torrents

#### `GET /api/torrents`

*   **Description:** Retrieves a list of all torrents in the library.
*   **Response:**
    *   `200 OK`: An array of torrent objects.
    *   `500 Internal Server Error`: If there is an error fetching the torrents.
*   **Example Response:**
    ```json
    [
      {
        "_id": "60c72b2f9b1d8c001f8e4c8b",
        "title": "Example Torrent 1",
        "description": "This is the first example torrent.",
        "infoHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4",
        "magnetURI": "magnet:?xt=urn:btih:e3b0c44298fc1c149afbf4c8996fb92427ae41e4",
        "fileName": "example1.txt",
        "fileSize": 12345,
        "seeders": 10,
        "leechers": 5,
        "category": "documents",
        "uploadedBy": "anonymous",
        "createdAt": "2023-01-01T12:00:00.000Z"
      },
      ...
    ]
    ```

#### `GET /api/torrents/:id`

*   **Description:** Retrieves a single torrent by its ID.
*   **Parameters:**
    *   `id` (string): The ID of the torrent to retrieve.
*   **Response:**
    *   `200 OK`: The torrent object.
    *   `404 Not Found`: If the torrent is not found.
    *   `500 Internal Server Error`: If there is an error fetching the torrent.

#### `POST /api/torrents/upload`

*   **Description:** This endpoint is for uploading both a file for server-side seeding and the torrent metadata created on the client-side. The client will create the torrent and magnet link, then send the metadata along with the raw file to this endpoint. The server will then begin seeding the file to the network, making it more resilient.
*   **Request Body:** `multipart/form-data`
    *   `file`: The file to be uploaded and seeded by the server.
    *   `title` (string): The title of the torrent.
    *   `description` (string): The description of the torrent.
    *   `category` (string): The category of the torrent.
    *   `magnetURI` (string): The magnet URI of the torrent.
    *   `infoHash` (string): The info hash of the torrent.
    *   `fileName` (string): The name of the file.
    *   `fileSize` (number): The size of the file in bytes.
*   **Response:**
    *   `201 Created`: The newly created torrent object.
    *   `400 Bad Request`: If any of the required fields are missing.
    *   `500 Internal Server Error`: If there is an error creating the torrent.
*   **Example Request Body:**
    ```
    (multipart/form-data)
    file: <file data>
    title: "My New Torrent"
    description: "This is a new torrent."
    magnetURI": "magnet:?xt=urn:btih:..."
    infoHash": "..."
    fileName": "my-file.zip"
    fileSize": 12345678
    ```
*  **Example Response:**
    ```json
    {
      "message": "Torrent uploaded and seeding initiated",
      "torrent": {
        "_id": "60c72b2f9b1d8c001f8e4c8c",
        "title": "My New Torrent",
        ...
      }
    }
    ```

## 3. WebSocket Events

The server will use WebSockets (`socket.io`) to send real-time updates to the clients.

### 3.1. Server to Client

#### `torrent:update`

*   **Description:** Sent to all clients when a torrent's information (like the number of seeders or leechers) is updated.
*   **Payload:** The updated torrent object.

#### `torrent:new`

*   **Description:** Sent to all clients when a new torrent is added to the library.
*   **Payload:** The new torrent object.

### 3.2. Client to Server

There are no client-to-server WebSocket events planned for the initial implementation.

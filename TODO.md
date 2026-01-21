# Project TODOs

## Priority Improvements

- [ ] **Authentication**: Implement user registration and login (JWT) to secure uploads.
- [ ] **Search & Filtering**: Add search functionality to the frontend and backend to filter torrents by title, category, or tags.
- [ ] **Pagination**: Implement pagination for the torrent list to improve performance with large datasets.
- [ ] **Validation**: Add stricter validation for magnet URIs and metadata on the backend.
- [ ] **Testing**: Add unit and integration tests for both frontend (Vitest) and backend (Jest/Supertest).

## P2P & Backend

- [ ] **WebTorrent Hybrid**: Implement `webtorrent-hybrid` in the backend to allow the server to act as a permanent seed for uploaded content.
- [ ] **Trackers**: Run a dedicated `bittorrent-tracker` instance for better privacy, reliability, and faster peer discovery.
- [ ] **File Uploads**: Consider adding direct file upload support (to S3/MinIO or local storage) and automatically generating web seeds.

## Production Readiness

- [ ] **CI/CD**: Setup GitHub Actions for automated testing and deployment.
- [ ] **Docker Optimization**: Optimize Dockerfiles for production (multi-stage builds).
- [ ] **Error Handling**: Improve error boundaries and user feedback (toast notifications) across the app.

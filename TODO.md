# Project TODOs

## Production Readiness

- [ ] **Web Seed URL**: In `server/routes/torrentRoutes.js`, change `http://localhost:5001` to your production domain/IP.
- [ ] **Storage**: Currently files are stored in `server/uploads`. Ensure this directory is persistent (e.g., Docker volume).
- [ ] **Cleanup**: Implement a cron job to clean up old files if storage is limited, or implement a quota system.
- [ ] **Security**: Add authentication for uploads. Currently, anyone can upload.
- [ ] **Validation**: Add file type and size validation in `multer` configuration.

## P2P Improvements

- [ ] **WebTorrent Hybrid**: Investigate using `webtorrent-hybrid` in the backend to allow direct WebRTC connections between server and browser peers, reducing reliance on web seeds.
- [ ] **Trackers**: Run your own `bittorrent-tracker` instance for better privacy and reliability.

## Frontend

- [ ] **Streaming Player**: Implement a video player using `webtorrent` client-side to stream video content directly in the browser.
- [ ] **Download Progress**: Show download progress when a user clicks "Download" (if using client-side download).

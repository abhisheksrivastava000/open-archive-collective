
const start = async () => {
    try {
        console.log('Attempting to import bittorrent-tracker/server...');
        const { default: TrackerServer } = await import('bittorrent-tracker/server');
        console.log('Import successful. Type:', typeof TrackerServer);

        const tracker = new TrackerServer({
            udp: false,
            http: true,
            ws: true,
            stats: true,
        });
        console.log('Tracker instance created successfully');

        tracker.on('error', (err) => console.log('Tracker error:', err.message));
        tracker.on('warning', (err) => console.log('Tracker warning:', err.message));

        console.log('Test complete. Tracker can be initialized.');
    } catch (err) {
        console.error('TEST FAILED:', err);
    }
};

start();

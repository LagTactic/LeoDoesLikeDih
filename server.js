const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Enhanced Unblocker configuration for streaming sites
const unblocker = new Unblocker({
    prefix: '/proxy/',
    requestMiddleware: [
        // Force identity encoding for better compatibility
        (proxyReq) => {
            proxyReq.headers['accept-encoding'] = 'identity';
            
            // Mimic a real browser for TikTok and YouTube
            proxyReq.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            
            // Remove Cloudflare headers that might cause issues
            delete proxyReq.headers['cf-connecting-ip'];
            delete proxyReq.headers['cf-ipcountry'];
            delete proxyReq.headers['cf-ray'];
            delete proxyReq.headers['cf-visitor'];
        }
    ],
    // Enable compression for better performance
    compressor: true,
    // Set higher timeout for video streaming
    requestTimeout: 30000, // 30 seconds
});

// Apply proxy middleware
app.use(unblocker);

// Serve static files
app.use(express.static('public'));

// Special route for YouTube videos
app.get('/youtube/*', (req, res) => {
    const videoId = req.params[0];
    res.redirect(`/proxy/https://www.youtube.com/watch?v=${videoId}`);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Proxy error occurred');
});

app.listen(PORT, () => {
    console.log(`Yllx Proxy running at http://localhost:${PORT}`);
});

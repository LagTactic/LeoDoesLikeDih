const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure the proxy to work with YouTube & TikTok
const unblocker = new Unblocker({
    prefix: '/proxy/',
    requestMiddleware: [
        (proxyReq) => {
            // Spoof headers to look like a real browser
            proxyReq.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
            proxyReq.headers['accept-language'] = 'en-US,en;q=0.9';
            proxyReq.headers['accept-encoding'] = 'identity';
            
            // Clean headers that might reveal this is a proxy
            delete proxyReq.headers['cf-connecting-ip'];
            delete proxyReq.headers['cf-ray'];
        }
    ]
});

// Apply the proxy middleware
app.use(unblocker);

// Serve the Yllx UI
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Yllx Proxy is running on port ${PORT}`);
});

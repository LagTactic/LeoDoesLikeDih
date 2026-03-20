const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure proxy for YouTube/TikTok
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

// Apply proxy middleware ONLY to /proxy/ routes
app.use('/proxy', unblocker);

// FIX: Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Keep-alive mechanism to prevent Render spin-down
const keepAlive = () => {
    const url = `https://${process.env.RENDER_EXTERNAL_URL}/` || `http://localhost:${PORT}/`;
    
    setInterval(async () => {
        try {
            const response = await axios.get(url);
            console.log(`✅ Keep-alive ping sent at ${new Date().toISOString()}`);
        } catch (error) {
            console.error(`❌ Keep-alive failed: ${error.message}`);
        }
    }, 14 * 60 * 1000); // Every 14 minutes
};

app.listen(PORT, () => {
    console.log(`Yllx Proxy is running on port ${PORT}`);
    keepAlive();
});

const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure Proxy for YouTube/TikTok
const unblocker = new Unblocker({
    prefix: '/proxy/',
    requestMiddleware: [
        (proxyReq) => {
            proxyReq.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
            proxyReq.headers['accept-language'] = 'en-US,en;q=0.9';
            proxyReq.headers['accept-encoding'] = 'identity';
            delete proxyReq.headers['cf-connecting-ip'];
            delete proxyReq.headers['cf-ray'];
        }
    ]
});

app.use(unblocker);

// FIX: Serve index.html directly from the main folder
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log('Yllx Proxy is running!');
});

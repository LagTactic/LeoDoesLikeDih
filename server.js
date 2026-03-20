const express = require('express');
const Unblocker = require('unblocker');
const path = require('path');
const axios = require('axios'); // Add this at the top

const app = express();
const PORT = process.env.PORT || 8080;

// ... your existing Unblocker configuration ...

// Keep-Alive Mechanism (Prevents Render from spinning down)
const keepAlive = () => {
    const url = `https://${process.env.RENDER_EXTERNAL_URL}/` || `http://localhost:${PORT}/`;
    
    // Ping every 14 minutes (Render spins down after 15 min of inactivity)
    setInterval(async () => {
        try {
            const response = await axios.get(url);
            console.log(`✅ Keep-alive ping sent at ${new Date().toISOString()}`);
        } catch (error) {
            console.error(`❌ Keep-alive failed: ${error.message}`);
        }
    }, 14 * 60 * 1000); // 14 minutes in milliseconds
};

// ... rest of your existing code ...

// Start keep-alive when server starts
app.listen(PORT, () => {
    console.log(`Yllx Proxy is running on port ${PORT}`);
    keepAlive(); // Start the keep-alive mechanism
});

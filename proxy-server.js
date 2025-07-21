const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());

// Proxy middleware - DON'T strip /api prefix
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.log('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy error' });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode}`);
  }
});

// Use the proxy for all API routes
app.use(apiProxy);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Proxy server running', target: 'http://127.0.0.1:8000' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Use this URL in your app: http://10.0.2.57:${PORT}`);
});
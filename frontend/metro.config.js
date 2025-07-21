const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add proxy configuration
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        // Proxy API requests to Django backend
        const { createProxyMiddleware } = require('http-proxy-middleware');
        const proxy = createProxyMiddleware({
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          logLevel: 'debug'
        });
        return proxy(req, res, next);
      }
      return middleware(req, res, next);
    };
  }
};

module.exports = config;
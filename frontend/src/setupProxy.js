// Source - https://stackoverflow.com/a
// Posted by andria_girl
// Retrieved 2026-01-06, License - CC BY-SA 4.0

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
            followRedirects: true
        })
    );
};

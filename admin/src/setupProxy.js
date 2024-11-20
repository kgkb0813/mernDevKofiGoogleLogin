const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 이 경로로 시작하는 요청은 프록시된다. /api/bookings, /api/bookings/:id 등 모두 포함됨
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
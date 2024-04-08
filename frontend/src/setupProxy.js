const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://172.98.2.185:8080',
            changeOrigin: true,
        })
    )
}

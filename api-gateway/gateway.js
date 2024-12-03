import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 4000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(
    '/api/auth',
    proxy(process.env.AUTH_SERVICE_URL, {
        proxyReqPathResolver: (req) => {
            return `/api/auth${req.url}`;
        },
    })
);

app.listen(PORT, () => console.log(`API Gateway running on http://localhost:${PORT}`));

import http from 'http';

const PORT = 3000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log("Request received", req.url);
    res.end('Hello from server.ts');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 
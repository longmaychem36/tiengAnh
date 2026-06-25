const http = require('http');
const app = require('../src/app');

const path = '/api/v1/collections/submissions';

const server = app.listen(0, '127.0.0.1', () => {
  const { port } = server.address();

  const req = http.get({ host: '127.0.0.1', port, path }, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      server.close(() => {
        if (res.statusCode === 404) {
          console.error(`${path} is not mounted. Response: ${body}`);
          process.exit(1);
        }

        console.log(`${path} is mounted. Status without token: ${res.statusCode}`);
        process.exit(0);
      });
    });
  });

  req.on('error', (err) => {
    server.close(() => {
      console.error(err.message);
      process.exit(1);
    });
  });
});

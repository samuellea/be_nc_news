// process.env.NODE_ENV = 'development'; // <-- comment out to work with dev data on nodemon.

const app = require('./app');

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

const express = require('express');
const { port, googleClientId } = require('./config');

const app = express();

app.use(
    express.json() 
);

app.listen(port, () => {
});

console.log('Listening on port', port)

app.get('/', (req, res) => {
    res.sendStatus(200)
})
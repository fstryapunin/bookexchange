const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT
app.use(
    express.json() 
);

app.listen(PORT, () => {
});

console.log('Listening on port', PORT)
console.log('Test', process.env.TEST_VAR)

app.get('/', (req, res) => {
    res.sendStatus(200)
})
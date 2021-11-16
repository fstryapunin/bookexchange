const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    express.json() 
);

app.listen(PORT, () => {
});

console.log('Listening on port', PORT)

app.get('/', (req, res) => {
    res.sendStatus(200)
})
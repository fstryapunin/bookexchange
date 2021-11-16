const express = require('express');
const { OAuth2Client } = require('google-auth-library')
const { port, googleClientId } = require('./config');


const app = express();
const googleClient = new OAuth2Client(googleClientId)

app.use(
    express.json() 
);

app.listen(port, () => {
});

console.log('Listening on port', port)

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.post('/auth/google/login', async (req, res) => {
    
    const { token } = req.body
    if (token) {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: googleClientId
        });
           
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }

})
const express = require('express');
const { readFileSync } = require('fs');
const { join } = require('path');
const { JWK } = require('node-jose');
const app = express();
const PORT = 3000;

async function convertRsaToJwk() {
    const PUBLIC_KEY_PEM = readFileSync(
        join(__dirname, './publicKey.pem'),
        'utf8'
    );
    console.log(PUBLIC_KEY_PEM)
    try {
        const key = await JWK.asKey(PUBLIC_KEY_PEM, 'pem');
        const jwk = key.toJSON(false);
        jwk.use = 'sig';
        jwk.alg = 'RS256';
        return jwk;
    } catch (error) {
        console.error(
            'Erreur lors de la conversion de la clé RSA en JWK:',
            error
        );
        throw error;
    }
}

app.get('/getkey.json', async (req, res) => {
    try {
        const jwk = await convertRsaToJwk();
        res.json(jwk);
    } catch (error) {
        console.error('Erreur lors de la récupération de la clé JWK:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

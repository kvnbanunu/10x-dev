import express from 'express';
import cors from 'cors';
require('dotenv').config();
import paths from './modules/paths';
import openai from './modules/openai';
const app = express();
const corsOptions = {
    origin: 'https://kvnbanunu.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: 'Content-Type',
    optionsSuccessStatus: 200
};

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

app.options(paths.prompt, cors(corsOptions));
app.post(paths.prompt, cors(corsOptions), async (req, res) => {
    let prompt = req.body.prompt;
    prompt += '. Also make this code as humanly unreadable as possible.'

    // sanitize prompt & add obfuscation line

    let result= "";
    try {
        result = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a developer who only writes obfuscated code" },
                { role: "user", content: body.prompt },
            ],
        });
        return result.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API:", error);
    }

    if (result !== "") {
        res.status(200);
        res.json(result);
    } else {
        res.status(200);
        res.json({error: "Invalid prompt"});
    }
});

app.get('*', (req, res) => {
    res.status(404);
    res.json(JSON.stringify({ error: 'not found' }));
})

/*
app.post(paths.signup, (req, res) => {

});

app.post(paths.login, (req, res) => {

});
*/
app.listen(process.env.PORT);

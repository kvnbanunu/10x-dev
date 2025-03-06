import express from 'express';
import cors from 'cors';
require('dotenv').config();
import paths from './modules/paths';
import openai from './modules/openai';
const app = express();
const corsOptions = {
    origin: 'https://kvnbanunu.github.io/10x-dev',
    optionsSuccessStatus: 200
}

app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.post(paths.prompt, async (req, res) => {
    const prompt = req.body.prompt;
    let result= "";
    try {
        result = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a developer who only writes obfuscated code" },
                { role: "user", content: prompt },
            ],
        });
        return result.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API:", error);
    }

    if (result !== "") {
        res.json(result);
    } else {
        res.json({error: "Invalid prompt"});
    }
});

/*
app.post(paths.signup, (req, res) => {

});

app.post(paths.login, (req, res) => {

});
*/
app.listen(process.env.PORT);

import OpenAI from 'openai';
import dotenv from 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const generateObfuscatedCode = async (program, language) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates code. When asked to write a program, you will write the most obfuscated, packed, and hard-to-read version that still functions correctly. Provide only the code without explanation.'
                },
                {
                    role: 'user',
                    content: `Write ${program} in ${language}. Make it as obfuscated and packed as possible while ensuring it still works correctly.`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to generate code');
    }
};

export default openai;

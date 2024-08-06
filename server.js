const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');  // Import body-parser
const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));  // Middleware untuk x-www-form-urlencoded

// Membaca artikel dari file
const readArticle = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('artikel.txt', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Endpoint untuk pencarian kata
app.post('/count', async (req, res) => {
    const { word } = req.body;
    if (typeof word !== 'string' || word.trim() === '') {
        return res.status(400).json({ error: 'Invalid word input' });
    }

    try {
        const article = await readArticle();
        if (!article) {
            return res.status(500).json({ error: 'Article is empty or cannot be read' });
        }

        const countWordOccurrences = (text, word) => {
            const words = text.toLowerCase().split(/\s+/);
            const count = words.filter(w => w === word.toLowerCase()).length;
            return count;
        };
        const count = countWordOccurrences(article, word);
        res.json({ word, count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk penggantian kata
app.post('/replace', async (req, res) => {
    const { oldWord, newWord } = req.body;
    if (typeof oldWord !== 'string' || oldWord.trim() === '' || typeof newWord !== 'string' || newWord.trim() === '') {
        return res.status(400).json({ error: 'Invalid oldWord or newWord input' });
    }

    try {
        const article = await readArticle();
        if (!article) {
            return res.status(500).json({ error: 'Article is empty or cannot be read' });
        }

        const replaceWord = (text, oldWord, newWord) => {
            const regex = new RegExp(`\\b${oldWord}\\b`, 'gi');
            return text.replace(regex, newWord);
        };
        const replacedText = replaceWord(article, oldWord, newWord);
        res.json({ replacedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk pengurutan kata
app.get('/sort', async (req, res) => {
    try {
        const article = await readArticle();
        if (!article) {
            return res.status(500).json({ error: 'Article is empty or cannot be read' });
        }

        const sortWordsAlphabetically = (text) => {
            const words = text.toLowerCase().match(/\b\w+\b/g);
            const uniqueWords = [...new Set(words)];
            uniqueWords.sort();
            return uniqueWords;
        };
        const sortedWords = sortWordsAlphabetically(article);
        res.json({ sortedWords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});

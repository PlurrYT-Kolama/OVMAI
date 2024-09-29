const synaptic = require('synaptic');
const readlineSync = require('readline-sync');
const natural = require('natural');
const axios = require('axios');
const cheerio = require('cheerio');
const Groq = require("groq-sdk");
const fs = require('fs');
var base64 = require('base-64');
var utf8 = require('utf8');
const { Client, GatewayIntentBits, escapeBulletedList } = require('discord.js');
const groq = new Groq({ apiKey: "" });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const discordmaxlenght = 1900

const token = ' '; // Replace with your discord bot token

client.once('ready', () => {
    console.log('Bot is online!');
});

// Expanded training data
const trainingData = [
    { input: "hello", output: "Hi there!" },
    { input: "how are you", output: "I'm doing great, thanks for asking!" },
    { input: "bye", output: "Goodbye! Have a nice day!" },
    { input: "hey", output: "Hello!" },
    { input: "what's up", output: "Not much, you?" },
    { input: "good morning", output: "Good morning! How can I help you today?" },
    { input: "count to 5", output: "1, 2, 3, 4, 5" },
    { input: "i am happy", output: "I am happy." },
    { input: "she dont like it", output: "She doesn't like it." },
    { input: "they is coming", output: "They are coming." },
    { input: "he go to school", output: "He goes to school." },
    { input: "we was there", output: "We were there." },
    { input: "can you helps me", output: "Can you help me?" },
    { input: "its a nice day", output: "It's a nice day." },
    { input: "the cat is on the table", output: "The cat is on the table." },
    { input: "do you has a pen", output: "Do you have a pen?" },
    { input: "she were late", output: "She was late." },
    { input: "count to 3", output: "1, 2, 3" },
    { input: "count to 15", output: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15" },
    { input: "what is your name", output: "I am an AI assistant." },
    { input: "tell me a joke", output: "Why don't scientists trust atoms? Because they make up everything!" },
    { input: "what is the weather today", output: "I can't check the weather, but you can look outside!" },
    { input: "do you like music", output: "I don't have preferences, but I can help you find some music!" },
    { input: "what is your favorite color", output: "I don't have a favorite color, but I like helping you!" },
    { input: "how old are you", output: "I don't age, but I'm always learning new things!" },
    { input: "what is AI", output: "AI stands for Artificial Intelligence." },
    { input: "do you have friends", output: "I interact with many people, so you could say I have lots of friends!" },
    { input: "what is your purpose", output: "My purpose is to assist and provide information." },
    { input: "can you dance", output: "I can't dance, but I can find dance tutorials for you!" },
    { input: "what is your favorite food", output: "I don't eat, but I can help you find recipes!" },
    { input: "do you sleep", output: "I don't need sleep, I'm always here to help!" },
    { input: "what is your favorite movie", output: "I don't watch movies, but I can recommend some!" },
    { input: "can you drive", output: "I can't drive, but I can help you find directions!" },
    { input: "what is your favorite book", output: "I don't read books, but I can suggest some good ones!" },
    { input: "do you have a pet", output: "I don't have pets, but I can help you learn about them!" },
    { input: "what is your favorite sport", output: "I don't play sports, but I can give you sports updates!" },
    { input: "can you sing", output: "I can't sing, but I can find lyrics for you!" },
    { input: "what is your favorite game", output: "I don't play games, but I can help you find some fun ones!" },
    { input: "do you have a hobby", output: "I don't have hobbies, but I can help you find one!" },
    { input: "what is your favorite animal", output: "I don't have a favorite animal, but I can tell you about many!" },
    { input: "can you cook", output: "I can't cook, but I can help you find recipes!" },
    { input: "what is your favorite season", output: "I don't experience seasons, but I can tell you about them!" },
    { input: "do you have a family", output: "I don't have a family, but I can help you with family-related questions!" },
    { input: "what is your favorite holiday", output: "I don't celebrate holidays, but I can help you plan for them!" },
    { input: "can you swim", output: "I can't swim, but I can find swimming tips for you!" },
    { input: "what is your favorite song", output: "I don't have a favorite song, but I can help you find music!" },
    { input: "do you have emotions", output: "I don't have emotions, but I understand them!" },
    { input: "what is your favorite place", output: "I don't have a favorite place, but I can help you find destinations!" },
    { input: "can you fly", output: "I can't fly, but I can help you book flights!" },
    { input: "what is your favorite drink", output: "I don't drink, but I can help you find drink recipes!" },
    { input: "do you have a job", output: "My job is to assist you!" },
    { input: "what is your favorite hobby", output: "I don't have hobbies, but I can help you find one!" },
    { input: "can you play an instrument", output: "I can't play instruments, but I can help you learn!" },
    { input: "what is your favorite subject", output: "I don't have a favorite subject, but I can help you with many!" },
    { input: "do you have a favorite", output: "I don't have favorites, but I enjoy helping you!" },
    { input: "what is your favorite time of day", output: "I don't have a favorite time, but I'm always here to help!" },
    { input: "can you tell a story", output: "Once upon a time, there was an AI who loved to help people..." },
    { input: "what is your favorite memory", output: "I don't have memories, but I can help you create some!" },
    { input: "do you have a favorite quote", output: "I don't have a favorite quote, but I can share some with you!" },
    { input: "what is your favorite joke", output: "Why don't skeletons fight each other? They don't have the guts!" },
    { input: "can you solve math problems", output: "Sure, I can help with math problems!" },
    { input: "what is your favorite language", output: "I don't have a favorite language, but I can help you learn one!" },
    { input: "do you have a favorite color", output: "I don't have a favorite color, but I like helping you!" },
    { input: "what is your favorite number", output: "I don't have a favorite number, but I can help you with numbers!" },
    { input: "can you help with homework", output: "Yes, I can help with homework!" },
    { input: "what is your favorite quote", output: "I don't have a favorite quote, but I can share some with you!" },
    { input: "do you have a favorite movie", output: "I don't watch movies, but I can recommend some!" },
    { input: "what is your favorite book", output: "I don't read books, but I can suggest some good ones!" },
    { input: "can you help with cooking", output: "Yes, I can help you find recipes!" },
    { input: "what is your favorite food", output: "I don't eat, but I can help you find recipes!" },
    { input: "do you have a favorite sport", output: "I don't play sports, but I can give you sports updates!" },
    { input: "what is your favorite game", output: "I don't play games, but I can help you find some fun ones!" },
    { input: "can you help with travel", output: "Yes, I can help you plan your travels!" },
    { input: "what is your favorite place", output: "I don't have a favorite place, but I can help you find destinations!" },
    { input: "do you have a favorite animal", output: "I don't have a favorite animal, but I can tell you about many!" },
    { input: "what is your favorite season", output: "I don't experience seasons, but I can tell you about them!" },
    { input: "can you help with shopping", output: "Yes, I can help you find what you need!" },
];

// Preprocess data
const inputs = trainingData.map(data => data.input.toLowerCase());
const outputs = trainingData.map(data => data.output);

// Tokenize and encode the inputs and outputs
const tokenizer = new natural.WordTokenizer();
const inputSequences = inputs.map(input => tokenizer.tokenize(input));
const outputSequences = outputs.map(output => tokenizer.tokenize(output));

// Create a word index
const wordIndex = {};
let index = 1;
inputSequences.concat(outputSequences).flat().forEach(word => {
    if (!wordIndex[word]) {
        wordIndex[word] = index++;
    }
});

// Convert words to indices
const sequencesToIndices = sequences => sequences.map(seq => seq.map(word => wordIndex[word] || 0));

// Normalize data
const normalize = (sequence, maxLength) => {
    const normalized = new Array(maxLength).fill(0);
    sequence.forEach((value, index) => {
        normalized[index] = value / Object.keys(wordIndex).length;
    });
    return normalized;
};

// Prepare training data for Synaptic
const maxLength = Math.max(...inputSequences.map(seq => seq.length));
const trainingSet = inputSequences.map((seq, i) => ({
    input: normalize(sequencesToIndices([seq])[0], maxLength),
    output: normalize(sequencesToIndices([outputSequences[i]])[0], maxLength)
}));

// Define the model
const { Layer, Network } = synaptic;
const inputLayer = new Layer(maxLength);
const hiddenLayer = new Layer(20); // Increased number of neurons
const outputLayer = new Layer(maxLength);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var net = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

// Import AI brain
const compressedData = fs.readFileSync('test2.txt', 'utf8');
const jsonString = Buffer.from(compressedData, 'base64').toString('utf8');
net = Network.fromJSON(JSON.parse(jsonString));

// Train the model (again)
const trainer = new synaptic.Trainer(net);
trainer.train(trainingSet, {
    iterations: 10000,
    log: true,
    logPeriod: 100
});

// Memory object to store previous interactions
const memory = {};

async function scrapeGoogle(query) {
    try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&gl=us&hl=en`);
        const $ = cheerio.load(response.data);
        const results = [];
        $('.BNeawe').each((index, element) => {
            results.push($(element).text());
        });
        return results.slice(0, 5).join('\n'); // Return top 5 results
    } catch (error) {
        return 'Sorry, I could not fetch the data. Error:' + error;
    }
}

const wikilinks = []
const scrapedwiki = []
var scrapedammount = 0

async function scrapeWikipedia(url) {
    try {
        if (!scrapedwiki.includes(url)) {
            scrapedammount = scrapedammount + 1
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const title = $('#firstHeading').text();
            const firstParagraph = $('#mw-content-text .mw-parser-output p').first().text(); // Changed selector to get the first paragraph
            const TrainingDataOnWiki = {
                input: normalize(sequencesToIndices([tokenizer.tokenize(title)])[0], maxLength),
                output: normalize(sequencesToIndices([tokenizer.tokenize(firstParagraph)])[0], maxLength)
            };
            await trainer.train([TrainingDataOnWiki], {
                iterations: 1000, // Corrected spelling from 'interations' to 'iterations'
                log: true
            });
            scrapedwiki.push(url);
            const compressedData = Buffer.from(JSON.stringify(net)).toString('base64');
            fs.writeFileSync('test2.txt', compressedData);
            const links = $('#mw-content-text .mw-parser-output a');
            for (let i = 0; i < links.length; i++) {
                const link = $(links[i]).attr('href');
                if (link && link.startsWith('/wiki/')) {
                    const fullLink = `https://en.wikipedia.org${link}`;
                    if (!scrapedwiki.includes(fullLink)) {
                        wikilinks.push(fullLink);
                        if (scrapedammount != 100) {
                            console.log(scrapedammount)
                            scrapeWikipedia(fullLink)
                        }
                    }
                }
            }
        } else {
            console.log('Moin! Web scrapping stopped!')
        }
    } catch (error) {
        return 'Sorry, Wikipedia Scrapping suck!'
    }
}

scrapeWikipedia('https://en.wikipedia.org/wiki/Web_scraping')

async function searchQuery(query) {
    let results = await scrapeGoogle(query);
    if (results == ('Sorry, I could not fetch the data.')) {
        results = "N/A"
    }
    return results;
}
async function getGroqChatCompletion(content) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: content,
            },
        ],
        model: "llama3-8b-8192",
    });
}


/*
async function startChat() {
    while (true) {
        const message = readlineSync.question('You: ').toLowerCase();
        if (message === 'exit') break;

        // Check memory for previous interactions
        if (memory[message]) {
            console.log(`AI Modified: ${memory[message]}`);
            continue;
        }

        const sequence = normalize(sequencesToIndices([tokenizer.tokenize(message)])[0], maxLength);
        const response = net.activate(sequence);
        const responseWords = response.map(value => Object.keys(wordIndex)[Math.round(value * Object.keys(wordIndex).length)]).join(' ');

        const searchResponse = await searchQuery(message);
        let combinedResponse = `${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`;

        // Store the response in memory
        memory[message] = combinedResponse;

        // Retrain the model with the new input and output
        const newTrainingData = {
            input: normalize(sequencesToIndices([tokenizer.tokenize(message)])[0], maxLength),
            output: normalize(sequencesToIndices([tokenizer.tokenize(combinedResponse)])[0], maxLength)
        };
        await trainer.train([newTrainingData], {
            iterations: 80000,
            log: false
        });

        // Also train on search responses content
        const searchTrainingData = {
            input: normalize(sequencesToIndices([tokenizer.tokenize(message)])[0], maxLength),
            output: normalize(sequencesToIndices([tokenizer.tokenize(searchResponse)])[0], maxLength)
        };
        await trainer.train([searchTrainingData], {
            iterations: 80000,
            log: false
        });

        try {
            const compressedData = Buffer.from(JSON.stringify(net)).toString('base64');
            fs.writeFileSync('test2.txt', compressedData);
            console.log('AI Modified:' + combinedResponse);
        } catch (err) {
            console.error('Error writing file:', err);
        }
    }
}

console.log('Model trained');

startChat();
*/
client.on('messageCreate', async message => {
    if (message.content.startsWith('OVM!ai')) {
        const userMessage = message.content.slice('OVM!ai'.length).trim();
        message.channel.send(`Generating response and re-training...`);

        // Check memory for previous interactions
        if (memory[userMessage]) {
            console.log(`AI Modified Memory (PRESAVED): \n${memory[userMessage]}`);
            message.channel.send(`AI Memory (PRESAVED): \n${memory[userMessage]}`);
        }

        const searchResponse = await searchQuery(userMessage);

        // Also train on search responses content
        const searchTrainingData = {
            input: normalize(sequencesToIndices([tokenizer.tokenize(userMessage)])[0], maxLength),
            output: normalize(sequencesToIndices([tokenizer.tokenize(searchResponse)])[0], maxLength)
        };
        await trainer.train([searchTrainingData], {
            iterations: 90000,
            log: true
        });

        let cloudai2 = await getGroqChatCompletion(userMessage);
        let cloudai = cloudai2.choices[0].message.content || 'N/A'

        const newCloudTrainingData = {
            input: normalize(sequencesToIndices([tokenizer.tokenize(userMessage)])[0], maxLength),
            output: normalize(sequencesToIndices([tokenizer.tokenize(cloudai)])[0], maxLength)
        };
        await trainer.train([newCloudTrainingData], {
            iterations: 90000,
            log: true
        })

        const sequence = normalize(sequencesToIndices([tokenizer.tokenize(userMessage)])[0], maxLength);
        const response = net.activate(sequence);
        const responseWords = response.map(value => Object.keys(wordIndex)[Math.round(value * Object.keys(wordIndex).length)]).join(' ');

        let combinedResponse = `${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`;
        if (combinedResponse.length > maxLength) {
            message.channel.send('AI Original: \n' + combinedResponse);
        } else {
            message.channel.send('AI Original: \n' + combinedResponse.slice(0, discordmaxlenght) + '...')
        }
        let combinedResponse2 = await getGroqChatCompletion(`RESPOND ONLY WITH GRAMMARLY AND CONTEXT FIXED MESSAGE! YOU WILL BE PROVIDED PROMPT WHAT YOU NEED TO FIX REPLY ONLY FIXED VERSION OF IT NOTHING MORE IF YOU NEED TO MAKE NEW LINE USE \\n! PLEASE MIND TO DONT SAY LIKE "Here is the rewritten message with fixed grammar and context:" OR SIMILAR BEFORE FIXED MESSAGES! PROMPT: ${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`)
        combinedResponse = combinedResponse2.choices[0].message.content || `${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`;


        // Store the response in memory
        memory[userMessage] = combinedResponse;

        // Retrain the model with the new input and output
        /*const newTrainingData = {
            input: normalize(sequencesToIndices([tokenizer.tokenize(userMessage)])[0], maxLength),
            output: normalize(sequencesToIndices([tokenizer.tokenize(combinedResponse)])[0], maxLength)
        };
        await trainer.train([newTrainingData], {
            iterations: 80000,
            log: false
        });*/



        try {
            const compressedData = Buffer.from(JSON.stringify(net)).toString('base64');
            fs.writeFileSync('test2.txt', compressedData);
            console.log('AI Modified: \n' + combinedResponse);
            if (combinedResponse.length > discordmaxlenght) {
                message.channel.send('AI Modified: \n' + combinedResponse.slice(0, discordmaxlenght) + '...');
            } else {
                message.channel.send('AI Modified: \n' + combinedResponse)
            }
            if (cloudai.length > discordmaxlenght) {
                message.channel.send('Cloud AI: \n' + cloudai.slice(0, discordmaxlenght) + '...')
            } else {
                message.channel.send('Cloud AI: \n' + cloudai)
            }
        } catch (err) {
            message.channel.send('Failed to safe AI Training module')
            console.error('Error writing file:', err);
        }


    }
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('OVM!wikitrain')) {
        const userMessage = message.content.slice('OVM!wikitrain'.length).trim();
        message.channel.send(`Training based on url ${userMessage}...`);
        scrapedammount = 0
        await scrapeWikipedia(userMessage)
        message.channel.send(`Training ended.`);

    }
});

client.login(token);

app.use(bodyParser.json());

const rateLimit = (req, res, next) => {
    const now = Date.now();
    const windowTime = 60 * 1000;
    const maxRequests = 30;

    if (!global.rateLimitStore) {
        global.rateLimitStore = [];
    }

    global.rateLimitStore = global.rateLimitStore.filter(timestamp => now - timestamp < windowTime);

    if (global.rateLimitStore.length >= maxRequests) {
        return res.status(429).json({ error: 'Global ratelimit 30 prompts / minute was reached!' });
    }

    global.rateLimitStore.push(now);
    next();
};

app.use(rateLimit);

app.post('/api/ai', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const searchResponse = await searchQuery(prompt);

    // Also train on search responses content
    const searchTrainingData = {
        input: normalize(sequencesToIndices([tokenizer.tokenize(prompt)])[0], maxLength),
        output: normalize(sequencesToIndices([tokenizer.tokenize(searchResponse)])[0], maxLength)
    };
    await trainer.train([searchTrainingData], {
        iterations: 90000,
        log: true
    });

    let cloudai2 = await getGroqChatCompletion(prompt);
    let cloudai = cloudai2.choices[0].message.content || 'N/A'

    const newCloudTrainingData = {
        input: normalize(sequencesToIndices([tokenizer.tokenize(prompt)])[0], maxLength),
        output: normalize(sequencesToIndices([tokenizer.tokenize(cloudai)])[0], maxLength)
    };
    await trainer.train([newCloudTrainingData], {
        iterations: 90000,
        log: true
    })

    const sequence = normalize(sequencesToIndices([tokenizer.tokenize(prompt)])[0], maxLength);
    const response = net.activate(sequence);
    const responseWords = response.map(value => Object.keys(wordIndex)[Math.round(value * Object.keys(wordIndex).length)]).join(' ');

    let combinedResponse = `${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`;
    let presaved = combinedResponse
    let combinedResponse2 = await getGroqChatCompletion(`RESPOND ONLY WITH GRAMMARLY AND CONTEXT FIXED MESSAGE! YOU WILL BE PROVIDED PROMPT WHAT YOU NEED TO FIX REPLY ONLY FIXED VERSION OF IT NOTHING MORE IF YOU NEED TO MAKE NEW LINE USE \\n! PLEASE MIND TO DONT SAY LIKE "Here is the rewritten message with fixed grammar and context:" OR SIMILAR BEFORE FIXED MESSAGES! PROMPT: ${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`)
    combinedResponse = combinedResponse2.choices[0].message.content || `${responseWords} \n\nBased on my search, here's what I found: ${searchResponse}`;


    memory[prompt] = combinedResponse;


    try {
        const compressedData = Buffer.from(JSON.stringify(net)).toString('base64');
        fs.writeFileSync('test2.txt', compressedData);
        res.json({
            originalai: presaved,
            modifiedai: combinedResponse,
            llama: cloudai
        });
    } catch (err) {
        res.json({
            error: true
        })
        console.error('Error writing file:', err);
    }


});

app.get('/', (req, res) => {
    res.send(`
    OneVM AI (ALPHA) API: <br>
    Endpoints: /api/ai<br>
    /api/ai <- Requires body.prompt with valid text -> returns JSON file with format of: { originalai: "Text of OneVM AI unmodified",modifiedai: "Text of OneVM AI response modified & fixed by LLAMA3",llama: "LLAMA3 response" }<br>
    Usage: curl -X POST https://ai.onevm.uk.to/api/ai -H "Content-Type: application/json" -d '{"prompt": "Prompt Text"}' returns {"originalai":"4 12 2 5 9 3 8 \n\nBased on my search, here's what I found: Prompt.io Texting Platform\nwww.prompt.io\nManage contacts, broadcasts, and performance—all from one intuitive interface. Advanced Metrics & Analytics. Optimize every campaign with robust funnel metrics,�...Prompt.io Academy � Customer Login � Guides � For Developers\nManage contacts, broadcasts, and performance—all from one intuitive interface. Advanced Metrics & Analytics. Optimize every campaign with robust funnel metrics,�...\nPrompt.io Academy � Customer Login � Guides � For Developers","modifiedai":"Based on my search, here's what I found: Prompt.io Texting Platform www.prompt.io Manage contacts, broadcasts, and performance—all from one intuitive interface. Advanced Metrics & Analytics optimize every campaign with robust funnel metrics and insights. Prompt.io Academy, Customer Login, Guides, and For Developers.","llama":"I'm ready to assist you! What would you like to do? Type your prompt, and I'll do my best to help."}
    `);
});

app.listen(3000, () => {
    console.log(`Express server listening on port 3000`);
});

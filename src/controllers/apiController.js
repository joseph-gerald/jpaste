const path = require('path');

const { mongoose } = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const Paste = require('../models/Paste');
const fs = require('fs');

require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

const client = new MongoClient(mongoURI);

client.connect();
mongoose.connect(mongoURI);

exports.createPaste = async (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const { content, title, author, read_key, edit_key, syntax, max_reads } = req.body;

    if (!content || !title || !author || !syntax || !max_reads) return res.status(400).send("fields missing");

    console.log(req.body);

    // 26^4 = 456,976
    const code = [...Array(4)].map(i => (Math.floor(10 + Math.random() * 26)).toString(36)).join('').toUpperCase();

    // pray that not all 456,976 codes are taken
    if (await Paste.findOne({ code})) return exports.createPaste(req, res);

    const paste = new Paste({
        code,
        content,
        title,
        author,
        read_key,
        edit_key,
        syntax,
        max_reads
    });

    await paste.save();

    res.status(200).send("user created");
}

exports.viewPaste = async (req, res) => {
    const code = req.params.code;

    const paste = await Paste.findOne({ code });

    if (!paste) return res.sendFile(path.join(__dirname, '..', 'public', 'error/paste', '404.html'));
    
    if (paste.max_reads != -1) {
        if (paste.reads >= paste.max_reads) return res.status(403).send("max reads reached");
    }
    

    const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'paste', 'view.html'), 'utf8');

    const protected = paste.read_key != null || paste.max_reads != -1;

    const data = protected ? {
        max_reads: paste.max_reads,
        reads: paste.reads,
        protected
    } : {
        title: paste.title,
        author: paste.author,
        content: paste.content,
        syntax: paste.syntax,
        max_reads: paste.max_reads,
        reads: paste.reads,
        protected
    };

    res.send(html.replaceAll("%data%", JSON.stringify(data)));
}

exports.viewProtectedPaste = async (req, res) => {
    const code = req.params.code;
    const key = req.body.key;

    const paste = await Paste.findOne({ code });

    if (!paste) return res.status(404).send({error: "paste not found"});
    if (paste.read_key != key) return res.status(403).send({error: "invalid key"});

    return res.status(200).send({
        title: paste.title,
        author: paste.author,
        content: paste.content,
        syntax: paste.syntax,
        max_reads: paste.max_reads,
        reads: paste.reads
    });
}

exports.ping = (req, res) => {
    res.send('pong');
};

exports.getRobots = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'robot/robots.txt'));
};

exports.getRobotsMinified = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'robot/robots.min.txt'));
};

exports.query = async (req, res) => {
    console.log(req.body);
    const query_url = `https://api.jooo.tech/encode?input=${encodeURI(req.query.query_text)}`;
    const response = await fetch(query_url);
    const output = await response.json();
    res.send(output.Output);
};
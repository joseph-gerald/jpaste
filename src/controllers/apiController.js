const path = require('path');

exports.ping = (req, res) => {
    res.send('pong');
};

exports.getIndex = async (req, res) => {
    res.status(503).sendFile(path.join(__dirname, '..', 'public', '503.html'));
}

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
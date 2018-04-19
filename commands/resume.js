const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.serverQueue;
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send(`**${song.title}** Resumed!!`);
    }
    return message.channel.send('There is nothing paused!!');
}

exports.help = {
    name: 'resume'
}
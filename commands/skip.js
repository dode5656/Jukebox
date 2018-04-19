const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.serverQueue;
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (!serverQueue) return message.channel.send('Nothing to skip!!');
    serverQueue.connection.dispatcher.end();
    message.channel.send(`Skipped **${song.title}**`);
    return;
}

exports.help = {
    name: 'skip'
}
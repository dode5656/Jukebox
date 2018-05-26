const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (!serverQueue) return message.channel.send('Nothing to skip!!');
    message.channel.send(`Skipped **${serverQueue.songs[0].title}**`);
    serverQueue.connection.dispatcher.end();
    return;
}

exports.help = {
    name: 'skip'
}
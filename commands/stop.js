const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (!serverQueue) return message.channel.send('Nothing to stop!!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send(`Queue Cleared and stopped!`);
    message.member.voiceChannel.leave();
}

exports.help = {
    name: 'stop'
}
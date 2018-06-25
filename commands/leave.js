const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (serverQueue) {
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      message.member.voiceChannel.leave();
      return message.channel.send('Queue cleared and leaving!');
    }
    message.member.voiceChannel.leave();
    message.channel.send(`Leaving!`);
}

exports.help = {
    name: 'leave'
}
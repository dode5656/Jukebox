const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js')

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.serverQueue;
    if (!serverQueue) return message.channel.send('Nothing is playing!!');
    return message.channel.send(`Now Playing: **${serverQueue.songs[0].title}**!`);
}

exports.help = {
    name: 'nowplaying',
    aliases: ['np', 'nowp', 'nplaying']
}
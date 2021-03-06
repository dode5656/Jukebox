const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);

    if (serverQueue && serverQueue.playing) {
        serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false;
        return message.channel.send(`**${serverQueue.songs[0].title}** Paused!!`);
    }
    return message.channel.send('Nothing is playing!!');
}

exports.help = {
    name: 'pause'
}
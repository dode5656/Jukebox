const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send(`**${serverQueue.songs[0].title}** Resumed!!`);
    }
    return message.channel.send('There is nothing paused!!');
}

exports.help = {
    name: 'resume'
}

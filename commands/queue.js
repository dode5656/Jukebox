const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.serverQueue;

    if (!serverQueue) return message.channel.send('Nothing in queue!!');
    let sQueue = serverQueue.songs.slice(1).map(song => `**${song.title}**`).join('\n');
    let embed = new RichEmbed()
        .setColor('BLUE')
        .setTitle('**Song Queue**')
        .addField('Now Playing:', serverQueue.songs[0].title)
        .addField('Queue', sQueue, true);
    return message.channel.send(embed);
}

exports.help = {
    name: 'queue'
}
const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');
const { song } = require('./play.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);

    if (!serverQueue) return message.channel.send('Nothing in queue!!');
    if (serverQueue.songs.length == 1) return message.channel.send(`Queue is empty, but there is a song playing:\nNow Playing: **${serverQueue.songs[0].title}**!`);
    let sQueue = serverQueue.songs.slice(1).map(song => `**${song.title}**`).join('\n');
    let embed = new Discord.RichEmbed()
        .setColor('BLUE')
        .setTitle('**Song Queue**')
        .addField('Now Playing:', serverQueue.songs[0].title)
        .addField('Queue', sQueue, true);
    return message.channel.send(embed);
}

exports.help = {
    name: 'queue'
}
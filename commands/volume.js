const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('Nothing is playing!!');
    if (!args.length) return message.channel.send(`The current volume is: ${serverQueue.volume}!`);
    if (isNaN(args[0])) return message.channel.send("That is not a number!!")
    if (0 > parseInt(args[0]) || parseInt(args[0]) > 100) return message.channel.send("Please provide a number between 0 - 100!!");
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    serverQueue.volume = args[0];
    return message.channel.send(`Volume set to: ${args[0]}!`);
}

exports.help = {
    name: 'volume',
    aliases: ['vol']
}
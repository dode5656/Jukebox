const Discord = require('discord.js');
const musicUtil = require('../utilities/musicUtil.js');

exports.run = async (bot, message, args) => {
    const serverQueue = musicUtil.queue.get(message.guild.id);
    
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (!serverQueue) return message.channel.send('Nothing to remove!');
	if (isNaN(args[0])) return message.channel.send('Please provide a number!')
	if (1 > parseInt(args[0]) || parseInt(args[0]) > serverQueue.songs.length-1) return message.channel.send(`Please provide a number between 1 and ${serverQueue.songs.length-1}`)
	message.channel.send(`Removed **${serverQueue.songs[args[0]].title}**`)
	serverQueue.songs.splice(args[0], 1)
}

exports.help = {
    name: 'remove'
}
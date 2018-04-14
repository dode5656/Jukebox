const { Client } = require('discord.js');
const botconfig = require('./botconfig.json');
const ytdl = require('ytdl-core');

const bot = new Client({ disableEveryone: true });

bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity('music!', { type: "LISTENING" });
});

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}play`)) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send('I cannot join to your voice channel. Make sure I have proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in your channel. Make sure I have proper permissions!');
        }

        try {
            var connection = await voiceChannel.join();
        } catch (error) {
            console.error(error);
            return message.channel.send("I couldn't join your voice channel. Something went wrong!!");
        }

        const dispatcher = connection.playStream(ytdl(args[0], { filter: "audioonly" }))
            .on('end', () => {
                voiceChannel.leave();
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(5 / 5);
    } else if (message.content.startsWith(`${prefix}stop`)) {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        dispatcher.end();
        message.member.voiceChannel.leave();
    }

});

bot.login(process.env.TOKEN);
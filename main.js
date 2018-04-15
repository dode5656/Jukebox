const { Client } = require('discord.js');
const botconfig = require('./botconfig.json');
const ytdl = require('ytdl-core');

const bot = new Client({ disableEveryone: true });

const queue = new Map();

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
    const serverQueue = queue.get(message.guild.id);

    if (!message.content.startsWith(prefix)) return;

    if (cmd === `${prefix}play`) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send('I cannot join to your voice channel. Make sure I have proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in your channel. Make sure I have proper permissions!');
        }

        const songInfo = ytdl.getInfo(args[0]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        };

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            queue.set(message.guild.id, queueConstruct);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(error);
                queue.delete(message.guild.id);
                return message.channel.send("I couldn't join your voice channel. Something went wrong!!");
            }

        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** has been added to the queue!`);
        }

    } else if (cmd === `${prefix}skip`) {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        if (!serverQueue) return message.channel.send('Nothing to skip!!');
        serverQueue.connection.dispatcher.end();
        return;
    } else if (cmd === `${prefix}stop`) {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        if (!serverQueue) return message.channel.send('Nothing to stop!!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.member.voiceChannel.leave();
    }

    return;
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { filter: "audioonly" }))
        .on('end', () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0])
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

bot.login(process.env.TOKEN);
const { Client, RichEmbed, Util } = require('discord.js');
const botconfig = require('./botconfig.json');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');

const bot = new Client({ disableEveryone: true });

const youtube = new Youtube(process.env.YTAPIKEY);

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
    const searchString = args.join(" ");
    const url = args[0].replace(/<(.+)>/g, '$1');
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


        try {
            var video = youtube.getVideo(url);
        } catch (err) {
            try {
                var videos = youtube.searchVideos(searchString, 1);
                var video = await youtube.getVideoByID(videos[0].id);
            } catch (error) {
                console.error(error)
                message.channel.send("I couldn't obtain any results.");
            }
        }
        const song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 100,
                playing: true
            };

            queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(error);
                queue.delete(message.guild.id);
                serverQueue.voiceChannel.leave();
                return message.channel.send("Something went wrong!!");
            }

        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** has been added to the queue!`);
        }

    } else if (cmd === `${prefix}skip`) {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        if (!serverQueue) return message.channel.send('Nothing to skip!!');
        serverQueue.connection.dispatcher.end();
        message.channel.send(`Skipped the song!`);
        return;
    } else if (cmd === `${prefix}stop`) {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        if (!serverQueue) return message.channel.send('Nothing to stop!!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.channel.send(`Queue Cleared and stopped!`);
        message.member.voiceChannel.leave();
    } else if (cmd === `${prefix}volume`) {
        if (!serverQueue) return message.channel.send('Nothing is playing!!');
        if (!args.length) return message.channel.send(`The current volume is: ${serverQueue.volume}!`);
        if (isNaN(args[0])) return message.channel.send("That is not a number!!")
        if (100 > parseInt(args[0])) return message.channel.send("Please provide a number between 0 - 100!!");
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
        serverQueue.volume = args[0];
        return message.channel.send(`Volume set to: ${args[0]}!`);
    } else if (cmd === `${prefix}np`) {
        if (!serverQueue) return message.channel.send('Nothing is playing!!');
        return message.channel.send(`Now Playing: **${serverQueue.songs[0].title}**!`);
    } else if (cmd === `${prefix}queue`) {
        if (!serverQueue) return message.channel.send('Nothing in queue!!');
        let sQueue = serverQueue.songs.map(song => `**${song.title}**`).join('\n');
        let embed = new Discord.RichEmbed()
            .setColor('BLUE')
            .setTitle('**Song Queue**')
            .addField('Now Playing:', serverQueue.songs[0])
            .addField('Queue', queue, true);
        return message.channel.send(embed);
    } else if (cmd === `${prefix}pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.connection.dispatcher.pause();
            serverQueue.playing = false;
            return message.channel.send(`**${song.title}** Paused!!`);
        }
        return message.channel.send('Nothing is playing!!');
    } else if (cmd === `${prefix}resume`) {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(`**${song.title}** Resumed!!`);
        }
        return message.channel.send('There is nothing paused!!');

    }

    return;
});

exports.play = function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { filter: "audioonly" }))
        .on('end', () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send(`Started Playing: **${song.title}**!`);
}

bot.login(process.env.TOKEN);
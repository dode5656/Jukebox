const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube(process.env.YTAPIKEY);
const Discord = require('discord.js');
const { song } = require('../commands/play.js');

exports.queue = new Map();

exports.play = (guild, song) => {
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

exports.serverQueue = queue.get(message.guild.id);


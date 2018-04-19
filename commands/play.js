const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const musicUtil = require('../utilities/musicUtil.js');
const youtube = new Youtube(process.env.YTAPIKEY);

exports.run = async (bot, message, args) => {
    const searchString = args.join(" ");
    const queue = musicUtil.queue;
    const serverQueue = musicUtil.serverQueue;

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        return message.channel.send('I cannot join to your voice channel. Make sure I have proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in your channel. Make sure I have proper permissions!');
    }
    if (!args.length) {
        return message.channel.send('Please provide a youtube link or song name!!');
    }


    if (/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(args[0])) {
        var video = youtube.getVideo(args[0]);
        return;
    }
    try {
        var videos = await youtube.searchVideos(args[0], 1);
        var video = await youtube.getVideoByID(videos[0].id);
    } catch (error) {
        console.error(error)
        message.channel.send("I couldn't obtain any results.");
    }

    exports.song = {
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: message.member.voiceChannel,
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
            musicUtil.play(message.guild, queueConstruct.songs[0]);
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

}

exports.help = {
    name: 'play'
}
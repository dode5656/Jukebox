const Discord = require('discord.js');
const main =  require('../main.js');

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
        .setDescription('All Commands Reloaded!')
        .setColor('#ff871e');

    message.channel.send(embed);
    main.loadCmds();
}

module.exports.help = {
    name: 'reload'
}
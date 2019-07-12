const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const fs = require('fs');

const bot = new Discord.Client({ disableEveryone: true });

const youtube = new Youtube(botconfig.YTAPI);

const botCommands = new Discord.Collection();
const botAliases = new Discord.Collection();

function loadCmds() {
    fs.readdir("./commands/", (err, files) => {

        if(err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === 'js');
        if(jsfile.length <= 0){
            console.log("Couldn't find commands.");
            return;
        }

        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(`./commands/${f}`)];
            let props = require(`./commands/${f}`);
            console.log(`${f} loaded!`);
            botCommands.set(props.help.name, props);
            if (props.conf) {
        		if (props.conf.aliases) props.conf.aliases.forEach(alias => {
            	    if (botAliases.get(alias)) return console.log(`Problem with alias: ${alias}`);
            	    botAliases.set(alias, props);
            	});
            }
        });
    });
}

bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity('music!', { type: "LISTENING" });
});

loadCmds();

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;
    if (cmd === `${prefix}reload`) {
        let embed = new Discord.RichEmbed()
            .setDescription('All Commands Reloaded!')
            .setColor('#ff871e');

        await loadCmds();
        message.channel.send(embed);
    }
    let commandfile = botAliases.get(cmd.slice(prefix.length)) || botCommands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
});

bot.login(botconfig.YTAPI);

module.exports = {
  loadCmds
}

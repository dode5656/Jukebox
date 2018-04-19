const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const fs = require('fs');

const bot = new Discord.Client({ disableEveryone: true });

const youtube = new Youtube(process.env.YTAPIKEY);

botCommands = new Discord.Collection();

exports.loadCmds = () => {
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
            if (props.help.aliases) props.help.aliases.forEach(alias => {
                if (botCommands.get(alias)) return console.log(`Problem with alias: ${alias}`);
                botCommands.set(alias, props);
            });
        });
    });
}


bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity('music!', { type: "LISTENING" });
});

exports.loadCmds();

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    

    if (!message.content.startsWith(prefix)) return;

    let commandfile = botCommands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
});

bot.login(process.env.TOKEN);

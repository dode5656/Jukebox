exports.run = async (bot, message, args) => {
  if (message.author.id != 236379670961061889) return message.channel.send('Only the `Bot Owner` has permissions to do this command!');
  await message.channel.send("Restarting the bot.")
  console.log('Going down');
  process.exit(0);
}

exports.help = {
  name: 'restart',
  neededRole: 'none'
}
require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const banWords = /(j'|J'|Je|Timmy|Olivier|Slime|Auchakama|Aucha).*(offre|paye|donne|apporte).*(pains? ?au ?chocolat|chocolatine|croissant)/i;

let activated = true;

const prefix = process.env.PREFIX || 'dinoshield';

client.once('ready', () => {
  console.log('DinoShield bot initiated');
  client.user.setActivity('Shielding ' + (activated ? 'ON' : 'OFF'));
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (activated && banWords.test(message.content)) {
    console.log('Banned words detected: ' + message.content);
    const m = message.channel.send('Warning! Banned words detected! Shielding.');
    message.delete();
    m.then(_message => {
      setTimeout(() => _message.delete(), 3000);
    });
    return;
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.split(' ');

  const method = args.splice(0, 1)[0].substr(prefix.length);

  switch (method) {
    case 'off': case 'OFF':
      activated = false;
      client.user.setActivity('Shielding OFF');
      break;
    case 'on': case 'ON':
      activated = true;
      client.user.setActivity('Shielding ON');
      break;
    default:
      message.channel.send('Error! Wrong Command.');
  }
});

client.login(process.env.TOKEN);

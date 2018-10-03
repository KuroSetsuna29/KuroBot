const Discord = require('discord.js');
const logger = require('winston');
require('winston-daily-rotate-file');
const auth = require('./auth.json');
const Hangups = require('hangupsjs');
const Q = require('q');



// Configure Hangouts
const hangouts = new Hangups();
const hangoutsCreds = () => {
    return {
        cookies: [
            'NID=140=V3uB2-bntBb4roh3JyCK-8pCscm_By30Vfgr-A1MX_znLSaPbuXlmgnOA5xnC9cLXtAlgH1wKwPIcoyTbIdY4gPF6BcB5B1akSEzxIzEzug8XNoXq6h40_ImSC97Hzx7XUGkkgAmgqkgVSLMot8coQ6mbYwFIUHYtTX9V_T1oelX8O57m3JsgeDUzA76vvCSlTzLO65Mig; Expires=Tue, 02 Apr 2019 05:08:44 GMT; Domain=google.com; Path=/; HttpOnly',
            'SID=jAYQuX7jRWyS-jNYDY3xNkkBR_WhK3ydr8Zyf7oQDk62PRfosStOLJMhGhDy_SYjQUrJNw.; Expires=Wed, 30 Sep 2020 05:08:21 GMT; Domain=google.com; Path=/',
            'HSID=AaTURGa-rCaQkHNL3; Expires=Wed, 30 Sep 2020 05:08:21 GMT; Domain=google.com; Path=/; HttpOnly; Priority=HIGH',
            'SSID=ASGYsRBCSEC1s91-Y; Expires=Wed, 30 Sep 2020 05:08:21 GMT; Domain=google.com; Path=/; Secure; HttpOnly; Priority=HIGH',
            'APISID=2tMfyBLMhDwwKZ6s/A1wbTQcFVynZkmfOU; Expires=Wed, 30 Sep 2020 05:08:21 GMT; Domain=google.com; Path=/; Priority=HIGH',
            'SAPISID=zEcGpOheVUNohN2a/AmjxKe-fZ48rQ7Hmy; Expires=Wed, 30 Sep 2020 05:08:21 GMT; Domain=google.com; Path=/; Secure; Priority=HIGH'
        ]
    };
};
// set more verbose logging
hangouts.loglevel('info');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.add(new logger.transports.DailyRotateFile({
    filename: 'bot-%DATE%.log',
    dirname: 'logs/bot'
}));
logger.level = 'debug';

// Initialize Discord Bot
var discord = new Discord.Client();

var hangoutsReconnect = function() {
    hangouts.connect(hangoutsCreds).then(function() {
        // we are now connected. a `connected`
        // event was emitted.
    });
};
 
// whenever it fails, we try again
hangouts.on('connect_failed', function() {
    Q.Promise(function(rs) {
        // backoff for 3 seconds
        setTimeout(rs,3000);
    }).then(hangoutsReconnect);
});

discord.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(discord.user.username + ' - (' + discord.user.id + ')');

    // start hangouts connection
    hangoutsReconnect();
});

discord.on('message', message => {
	if (message.channel.id == "496175385998786570") {
		logger.debug(`message: ${JSON.stringify(message.content)}`);
	}
	// Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	if (message.content.substring(0, 1) == '!') {
		logger.debug(`Received: ${message.content}`);

		var args = message.content.substring(1).split(' ');
		var cmd = args[0];
	
		args = args.splice(1);
		switch(cmd) {
			case '':
			break;
			// Just add any case commands if you want to..
		}
	} else if (/(kuro|<@280562430633836544>)/i.test(message.content)) {
		const builder = new Hangups.MessageBuilder();
		const nice_message = message.content.replace(/<@!?([0-9]+)>/g, (match, user_id) => { return `@${message.mentions.users.get(user_id).username}`}).replace(/<@&([0-9]+)>/g, (match, role_id) => { return `@${message.mentions.roles.get(role_id).name}`});

		segments = builder.bold(`${message.guild.name} (#${message.channel.name})`).linebreak().bold(message.createdAt.toLocaleString('en-US', {timeZone: 'America/Toronto'})).linebreak().bold(message.author.username).linebreak().text(nice_message).toSegments();
		hangouts.sendchatmessage('Ugz_UcDODOqHt5O-s9p4AaABAagBrI-CBQ', segments);
	}
});

discord.login(auth.token);


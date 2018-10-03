const Discord = require('discord.js');
const auth = require('./auth.json');

// This is going to be setup as an AWS Lambda
// And scheduled using AWS CloudWatch Schedule expression
// cron(0 0 ? * SAT *)

exports.handler = (event, context, callback) => {
	// Initialize Discord Bot
	var discord = new Discord.Client();

	discord.on('ready', function (evt) {
		console.log('Connected');
		console.log('Logged in as: ');
		console.log(discord.user.username + ' - (' + discord.user.id + ')');
		
		discord.channels.get(event != null && event.channel != null ? event.channel : '367863498774151170').send('@everyone Nanman started')
		.then(message => console.log(`Sent message: ${message.content}`))
		.catch(console.error)
		.then(() => {
			discord.destroy();
			callback();
		});
	});

	discord.login(auth.token);
}

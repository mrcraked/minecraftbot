const express = require('express')();
express.get('/', (req, res) => res.send('<!-- auto-pinging 525316393768452098 -->'))
express.listen(3000);
const armorManager = require('mineflayer-armor-manager')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
var mineflayer = require('mineflayer')
const deathEvent = require("mineflayer-death-event")
const ip = process.env['ip']
const ping = require('minecraft-server-util')
const {
  Client,
  Intents,
  RichEmbed
} = require('discord.js')
// Create Discord intentions, required in v13
const intents = new Intents(['GUILDS', 'GUILD_MESSAGES'])
// Create Discord client
const client = new Client({
  intents: intents
})

let channel = process.env['channel']
var bot = mineflayer.createBot({
  host: process.env['ip'],
  username: process.env['username'],
  version: process.env['ver'],
  port:52017,
})
bot.on('login', async () => {
    console.log(`bot is on ${ip}`)
})
client.on('ready', () => {
  console.log(`The discord bot logged in! Username: ${client.user.username}!`)
  // Find the Discord channel messages will be sent to
  channel = client.channels.cache.get(channel)
  if (!channel) {
    console.log(`I could not find the channel ${process.env['3']}`)
    process.exit(1)
  }
})
client.on('message', message =>{
 
    let args = message.content.substring(PREFIX.length).split(' ')
    let ip = process.env['ip']
    let port = process.env['port']
    
    switch(args[0]){
        case 'mc':
            ping(ip, parseInt(port), (error, reponse) =>{
                if(error) throw error
                const Embed = new RichEmbed()
                .setTitle('Server Status')
                .addField('Server IP', reponse.host)
                .addField('Server Version', reponse.version)
                .addField('Online Players', reponse.onlinePlayers)
                .addField('Max Players', reponse.maxPlayers)
                
                message.channel.send(Embed)
            })
        break
 
    }
 
})

bot.on('chat', (username, message) => {
  if (message === 'halo') {
    bot.chat(`hello` )
    return
  }
})
bot.on('kicked', console.log)
bot.on('error', console.log)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

bot.on('chat', (username, message) => {
  if (message === 'lawan aku') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("Lu dimana ??.")
      return
    }

    bot.pvp.attack(player.entity)
  }

  if (message === 'stop') {
    bot.pvp.stop()
  }
})

bot.loadPlugin(armorManager);
bot.armorManager.equipAll()
bot.on('chat', (username, message) => {
  if (message === 'fitur bot') {
    bot.chat(`ketik lawan aku untuk pvp udh itu aja ` )
  }
})
client.on('messageCreate', message => {
  // Only handle messages in specified channel
  if (message.channel.id !== channel.id) return
  // Ignore messages from the bot itself
  if (message.author.id === client.user.id) return
  bot.chat(` ${message.content}`)
})

// Redirect in-game messages to Discord channel
bot.on('chat', (username, message) => {
  // Ignore messages from the bot itself
  if (username === bot.username) return

  channel.send(`${username}: ${message}`)
})

// Login Discord bot
client.login(process.env['TOKEN'])


const express = require('express');
const cors = require('cors');
const Discord = require("discord.js");
const client = new Discord.Client();

const app = express();


const PORT = 8080;


app.use(cors());


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})




app.get('/', (req, res) => {
  res.send('ONLINE');
});

app.post('/sendMessage', (req,res) => {
  try{
    if(req.query.msg.lenght < 0){
      res.status(200)
    }
    if(req.query.channelid.length < 0){
      res.status(200)
    }
    const channelObj = client.channels.cache.get(req.query.channelid);
    channelObj.send(req.query.msg)
    res.status(200)
  }catch(error){
    res.status(404)
    console.log(error)
  }
})

app.get('/serverList', (req,res) => {
  try{
    const serverList = []
    client.guilds.cache.forEach(guild => {
      serverList.push({servername: guild.name, serverid: guild.id})
    })
    res.send(JSON.stringify(serverList))
  }catch(error){
    console.log(error)
  }
})

app.get('/channelList', (req,res) => {
  try{
    var serverid = req.query.serverid
    var channelList = []
    var guild = client.guilds.cache.get(serverid)
    guild.channels.cache.forEach((channels) => {
      if(channels.parent){
        if(channels.type != "voice"){
          channelList.push({channelname: channels.name, channelid: channels.id})
        }
      }
    })
    console.log(channelList)
    res.send(JSON.stringify(channelList))
  }catch(error){
    res.send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});


client.login('PUT TOKEN HERE')
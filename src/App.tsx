import React, { useEffect, useState } from 'react';
import {Button, Dropdown, Form, Grid, Input, Segment} from 'semantic-ui-react'
import axios from 'axios'
import './App.css';


interface serverListInt {
  servername: string,
  serverid: number,
}
interface channelListInt {
  channelname: string,
  channelid: number,
}


const App = () => {
  




  const [serverList, setServerList] = useState<serverListInt[]>([])
  const [channelList, setChannelList] = useState([])
  const [selectedServer, setSelectedServer] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [result, setResult] = useState("")


  const sendInfo = () => {
    console.log(`selected server ${selectedServer} and selected channel ${selectedChannel} and text is ${userMessage}`)

    axios.post('http://localhost:8080/sendMessage',{}, {params: {channelid: selectedChannel, msg: userMessage}})

  }

  useEffect(() => {
    const serverArray:any = []
    const fetchServers = async () =>{
      const result:serverListInt[] = await axios.get('http://localhost:8080/serverList').then(res => res.data)
      result.map((server) => serverArray.push({key: server.servername, text: server.servername, value: server.serverid}))
      setServerList(serverArray)      
    }
    const getStatus = async () => {
      const status = await axios.get("http://localhost:8080/").then(res => res.data)
      setResult(status)
    }
    getStatus()
    fetchServers()
  }, [])

  useEffect(() => {
    const channelArray:any = []
    const fetchChannels = async () =>{
      try{
        const result:channelListInt[] = await axios.get('http://localhost:8080/channelList', {params: {serverid: selectedServer}}).then(res => res.data)
        result.map((channel) => channelArray.push({key: channel.channelname, text: channel.channelname, value: channel.channelid}))
        setChannelList(channelArray)
      }catch(error){
        console.log(result)
      }
    }


    fetchChannels()
  }, [selectedServer])

  return (
    <div>
      <br></br>
      <Grid centered padded><h1>dot.</h1></Grid>
      <Grid centered padded>
          <Segment padded>
            <Form>
              <Form.Field>
                <Dropdown placeholder="Server" options={serverList}  fluid selection onChange={(e:any,data:any) => setSelectedServer(data.value)}/>
              </Form.Field>
              <Form.Field>
                <Dropdown placeholder="Channel" fluid selection options={channelList} onChange={(e:any,data:any) => setSelectedChannel(data.value)}/>
              </Form.Field>
              <Form.Field>
                <Input placeholder="Message..." onChange={event => setUserMessage(event.target.value)} value={userMessage} onKeyDown={(e:any) => e.key === 'Enter' ? sendInfo() : null}/>
              </Form.Field>
              <Form.Field>
                <Button color='green' onClick={() => sendInfo()}>Send Message</Button>
                <h6>Server status: {result}</h6>
              </Form.Field>
            </Form>
          </Segment>
      </Grid>
    </div>
  );
}

export default App;

import React from "react";
import Codemirror from "react-codemirror";
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/hint/javascript-hint');
import {showHint} from "codemirror/addon/hint/show-hint";

export default class Home extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      Name:"",
      Message:"",
      Color:"#20deee",
      Messages:[]
    };

    this.sendMessage = () => {
      let {Name,Message,Color} = this.state;
      let urls = this.urlify(Message);
      if(urls){
        urls.forEach((url)=>{
          if(url.includes("youtube")){
            let video_id = url.split('v=')[1];
            let ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
              video_id = video_id.substring(0, ampersandPosition);
            }
            let video = `<video>${url}</video>`;
            //let video = `<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/${video_id}" frameborder="0"></iframe>`;
            Message = Message.replace(url, video);
          }

        });
      }
      let Msg = {IsMessage:true,Name,Message,Color,TimeStamp:new Date()};
      this.state.ws.send(JSON.stringify(Msg));
      let Messages = this.state.Messages;
      Messages.push(Msg);
      this.setState({Messages},()=>{
        var chat = document.getElementById("Chat");
        if(chat.children)
          chat.children[chat.children.length - 1].scrollIntoView();
          var sound = document.getElementById("sound1");
          sound.volume = 0.1;
          sound.src = "/sound.mp3";
          sound.play();
      });
    }

    this.updateName = (Name) => {
      this.setState({Name});
    }

    this.updateMessage = (Message) => {
      this.setState({Message});
    }

    this.updateColor = (Color) => {
      this.setState({Color});
    }

    this.urlify = (text) => {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex, function(url) {
          return url;
      })
    }

  }

  componentWillReceiveProps(p){
    console.log(p);
    alert("here");
  }

  componentDidMount(){
    var ws = new WebSocket('ws://tim.local.boptown.com:8082');


    ws.onopen = () => {
      ws.send(JSON.stringify({GetMessages:true}));
    };

    ws.onclose = () => {

      var timeout = () => {
        setTimeout(()=>{
          let ws = new WebSocket('ws://tim.local.boptown.com:8082')
          if(ws.readyState != 1)
            timeout();
          else
            this.setState({ws:ws});
        },2000);
      };
      timeout();
    }

    ws.onmessage = (data, flags) => {
      let obj = JSON.parse(data.data);
      if(obj){
          let Messages = this.state.Messages;
          if(obj.IsMessage){
            Messages.push(obj);
          }
          if(obj.GetMessages){
            Messages = obj.Messages;
          }

          this.setState({Messages},()=>{
            var chat = document.getElementById("Chat");
            if(chat.children)
              chat.children[chat.children.length - 1].scrollIntoView();
              var sound = document.getElementById("sound1");
              sound.volume = 0.1;
              sound.src = "/sound.mp3";
              sound.play();
          });
      }
      // flags.binary will be set if a binary data is received.
      // flags.masked will be set if the data was masked.
    };
    this.setState({ws:ws});
  }

  render(){
    let {Name,Message,Messages,Color} = this.state;
    return (
      <div className="row" id="test">
        <ul className="Chat" id="Chat" style={{maxHeight:"600px",overflow:"auto"}}>
          {Messages.map((message)=>{
            let Msg = message.Message;
            let Videos = [];
            if(message.Message){
              let videos = message.Message.match(/<video>(.*?)<\/video>/g);
              if(videos){
                videos = videos.map(function(val){
                   return val.replace(/<\/?video>/g,'');
                });
                Msg = message.Message.replace(/<\/?[^>]+(>|$)/g, "");
                videos.forEach((url)=>{
                  if(url.includes("youtube")){
                    let video_id = url.split('v=')[1];
                    let ampersandPosition = video_id.indexOf('&');
                    if(ampersandPosition != -1) {
                      video_id = video_id.substring(0, ampersandPosition);
                    }
                    let video = (<iframe id="ytplayer" type="text/html" width="640" height="360" src={"https://www.youtube.com/embed/" + video_id} style={{border:0}}></iframe>);
                    Videos.push(video);
                  }
                });
              }
            }

            let date = new Date(message.TimeStamp);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;
            let time = `${hours}:${minutes}:${seconds} ${ampm}`;
            return <li><span style={{marginRight: "10px",fontSize: "9px"}}>{time}</span><span className="from" style={{color:message.Color}}>{message.Name}</span><span>{" : "}</span><span>{Msg}</span><br />{Videos}</li>
          })}
        </ul>
        <div className="input-group">
          <label className="input-group-label">Name</label>
          <input className="input-group-field" type="text" value={Name} onChange={(e)=>{this.updateName(e.target.value)}} />
          <div className="input-group-button">
            <input type="color" style={{width:"50px",height:"100%",borderLeft:0,background:"#e6e6e6"}} value={Color} onChange={(e)=>{this.updateColor(e.target.value)}} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-group-label">Message</label>
          <input className="input-group-field" type="text" value={Message} onChange={(e)=>{this.updateMessage(e.target.value)}} />
        </div>
        <button className="button" onClick={this.sendMessage}>Send</button>
      </div>
    )
  }
}

import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/shared/models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketstompService {
 private url = '//sl-dev-backend-7ab91220ba93.herokuapp.com/chat-socket';
  private stompclient: any;
  private roomID = '';
  getMacAddresses() {


  }
  initconnectionSocket(roomId:string) {
    console.log("::::::::::::Conectando al websocket", this.url);
    this.roomID = roomId;
  }

  joinRoom() {
    // this.initconnectionSocket();
    const socket = new SockJS(this.url);
    this.stompclient = Stomp.over(socket);
    this.stompclient.connect({}, () => {
      console.log("::::::::::::Conectado al websocket en el room", this.roomID);
      this.stompclient.subscribe(`/topic/${this.roomID}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        console.log("DATA", messageContent);
      })
    });
    this.stompclient.disconnect(() => {
      console.log("::::::::::::Desconectado del websocket en el room", this.roomID);
    }, { debug: true });
  }

  sendMessage(roomId: string, chatmessage: ChatMessage) {
    this.stompclient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatmessage));
  }
}

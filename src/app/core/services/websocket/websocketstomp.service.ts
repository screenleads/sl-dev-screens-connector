import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/shared/models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketstompService {

  private stompclient: any;

  constructor() {
    this.getMacAddresses();
    this.initconnectionSocket();
  }
  getMacAddresses() {


  }
  initconnectionSocket() {
    const url = '//localhost:3000/chat-socket';
    const socket = new SockJS(url);
    this.stompclient = Stomp.over(socket);
  }

  joinRoom(roomId: string) {
    this.stompclient.connect({}, () => {
      this.stompclient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        console.log("DATA", messageContent);
      })
    })
  }

  sendMessage(roomId: string, chatmessage: ChatMessage) {
    this.stompclient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatmessage));
  }
}

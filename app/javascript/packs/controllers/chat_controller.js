import { Controller } from "stimulus"
import createChannel from "../cable";

const handlebars = require('handlebars');

var user_name = "";
var color_code = "";

export default class extends Controller {
  static targets = ["input", "conversation", "template", "stemplate"];

  connect() {
    if (!user_name) {
      user_name = this.getRandomUserName();
      color_code = this.getRandomColor();
    }
    let context = this;

    this.chatChannel = createChannel( "ChatChannel", {
      connected() {
        console.log("LIVE");
      },
      received(data) {
        context.addMessage(data);
      }
    });
  }

  sendMessage() {
    if(this.inputTarget.value) {
      var data =
      { message: this.inputTarget.value,
        user_name: user_name,
        color_code: color_code
      };

      this.chatChannel.perform("emit", data);
      this.inputTarget.value = '';
    }
  }

  sendThroughEnter(event) {
    if (event.which == 13){
      event.preventDefault();
      return this.sendMessage();
    }
  }

  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element.getAttribute("content");
  }

  addMessage(data) {
    var message_template = this.getMessageTemplate(data.user_name);
    var context = {
      name: data.user_name,
      message: data.message,
      color: data.color_code,
      time: this.getCurrentTime()
    };

    this.conversationTarget.innerHTML += message_template(context);
    this.conversationTarget.scrollIntoView(false);
  }

  getMessageTemplate(name) {
    if(name === user_name) {
      return handlebars.compile(this.templateTarget.innerHTML);
    } else {
      return handlebars.compile(this.stemplateTarget.innerHTML);
    }
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomUserName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  }


}
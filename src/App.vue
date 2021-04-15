<template>
<div>
  <div class="loging" v-if="username === '' || username === null">
    <div class="row">
      <div class="column1">
        <img src="./assets/img/bg2.jpg" alt="">
      </div>
      <div class="column2">
        <div class="inputs">
          <div class="app-name">
            <h1>ChitChat</h1>
          </div>
          <form @submit.prevent="login()">
            <div class="username-input">
              <input type="text" name="username" id="" v-model="inputUserName" placeholder="Enter your username..">
            </div>
            <div class="login-btn">
              <input type="submit" value="LOG IN">
            </div>
          </form>
        </div>  
      </div>
    </div>
  </div>
  <div class="chat-box" v-else>
      <div class="nav">
        <input type="checkbox" id="nav-check">
        <div class="nav-header">
          <div class="nav-title">
            Welcome, {{username}}
          </div>
        </div>
        <div class="nav-links">
          <a v-on:click="logout()">Logout</a>
        </div>
      </div>
      <div class="chat">
         <div v-for="message in messages" :key="message.key" :class="(message.username==username ? 'message current-user' : 'message')">
           <div class="content">{{message.content}}</div>
         </div>
      </div>
      <footer>
        <form class="message-form" @submit.prevent="sendMessage()">
          <div class="row1">
            <div class="col1">
              <input type="text" v-model="inputMessage" placeholder="Type here..">
            </div>
            <div class="col2">
              <input type="submit" value="Send">
            </div>
          </div>
        </form>
      </footer>
    </div>
</div>
</template>

<script>
import db from './db';

export default {
  data () {
    return {
      username:'',
      messages:[],
      inputUserName:'',
      inputMessage:''
    }
  },
  mounted() {
    const messageRef=db.database().ref("messages");
    messageRef.on('value',snapshot=>{
      const data=snapshot.val();
      let allmessages=[];
      Object.keys(data).forEach(key=>{
        allmessages.push({
          id:key,
          username:data[key].username,
          content:data[key].content
        });
      });
      this.messages=allmessages;
    });
  }
  ,
  methods:{
    login () {
      if(this.inputUserName!="" || this.inputUserName!=null){
        this.username=this.inputUserName;
        this.inputUserName="";
      }
    },
    sendMessage(){
      const messageRef=db.database().ref('messages');
      if(this.inputMessage=="" || this.inputMessage==null){
        return;
      }
      const message={
        username:this.username,
        content:this.inputMessage
      }

      messageRef.push(message);
      this.inputMessage="";
    },
    logout () {
      if(this.inputUserName!="" || this.inputUserName!=null){
        this.username="";
      }
    }
  }

}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body{
    margin: 0;
    background-image: linear-gradient(rgb(255, 255, 255), rgb(255, 180, 180));
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
  }

  .loging{
    width: 70%;
    margin: auto;
    transform: translate(0, 30%);
    box-shadow: 0px 0px 10px -2px #ffffff;
  }

  .column1,.column2 {
    float: left;
    width: 50%;
    height: 500px;
  }

  .column2{
    padding: 2rem;
    background-color: rgb(255, 180, 180);
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

.row1:after {
    content: "";
    display: table;
    clear: both;
  }

  .col1 {
    float: left;
    width: 80%;
  }

  .col2 {
    padding: 5px;
    float: left;
    width: 20%;
  }

  img{
    width: 100%;
    height: 100%;
  }

  .app-name,.username-input,.login-btn{
    float: left;
    width: 100%;
  }

  .app-name{
    text-align: center;
    font-size: 150%;
    font-family: 'Brush Script MT', cursive;
  }

  .inputs::after{
    content: "";
    display: table;
    clear: both;
  }

  input[type=text]{
    width: 100%;
    padding: 13px;
    outline: none;
    border-radius: 3px;
    font-size: 110%;
    margin: 1rem 0rem 0.5rem 0rem;
    border: none;
  }

  .login-btn input[type=submit]{
    width: 100%;
    padding: 10px;
    outline: none;
    border-radius: 3px;
    transition: 0.5s;
    font-size: 120%;
    margin: 1rem 0rem 0.5rem 0rem;
    color: white;
    border: none;
    background-color: rgb(255, 55, 55);
    border: 2px solid rgb(255, 55, 55);
  }

  .message-form input[type=submit]{
    width: 100%;
    padding: 10px;
    outline: none;
    transition: 0.5s;
    font-size: 120%;
    color: white;
    border: none;
    background-color: rgb(255, 55, 55);
    border: 2px solid rgb(255, 55, 55);
  }


  .login-btn input[type=submit]:hover{
    padding-left: 30px;
    border: 2px solid white;
    background-color: rgb(192, 0, 0);
  }

  .message-form input[type=submit]:hover{
    background-color: rgb(192, 0, 0);
  }

  .chat-box{
    width: 80%;
    height: 700px;
    margin: auto;
    transform: translate(0, 10%);
    box-shadow: 0px 0px 10px -2px #ffffff;
    background-color: white;
  }

  .nav {
    height: 70px;
    width: 100%;
    background-color: rgb(255, 180, 180);
    position: relative;
  }

  .nav > .nav-header {
    display: inline;
  }

  .nav > .nav-header > .nav-title {
    display: inline-block;
    font-size: 250%;
    color: rgb(0, 0, 0);
    /* font-family: 'Brush Script MT', cursive; */
    padding: 10px 10px 10px 10px;
  }

  .nav > .nav-btn {
    display: none;
  }

  .nav > .nav-links {
    display: inline;
    float: right;
    font-size: 25px;
    /* font-family: 'Brush Script MT', cursive; */
  }

  .nav > .nav-links > a {
    display: inline-block;
    padding: 13px 10px 13px 10px;
    text-decoration: none;
    color: black;
  }

  .nav > .nav-links > a:hover {
    color: rgba(0, 0, 0, 0.3);
  }

  .nav > #nav-check {
    display: none;
  }

  .message{
    text-align: left;
    font-size: 150%;
    background-color: rgb(255, 180, 180);
    margin: 0.5rem;
    padding: 5px;
    border-radius: 5px;
  }

  .current-user{
    text-align: right;
    background-color: rgb(229, 186, 186);
  }

  footer{
    width: 100%;
    position: fixed;
    bottom: 0;
  }

  @media (max-width:600px) {
    .nav > .nav-btn {
      display: inline-block;
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .nav > .nav-btn > label {
      display: inline-block;
      width: 50px;
      height: 50px;
      padding: 13px;
    }
    .nav > .nav-btn > label:hover,.nav  #nav-check:checked ~ .nav-btn > label {
      background-color: rgba(0, 0, 0, 0.3);
    }
    .nav > .nav-btn > label > span {
      display: block;
      width: 25px;
      height: 10px;
      border-top: 2px solid #eee;
    }
    .nav > .nav-links {
      position: absolute;
      display: block;
      width: 100%;
      background-color: #333;
      height: 0px;
      transition: all 0.3s ease-in;
      overflow-y: hidden;
      top: 50px;
      left: 0px;
    }
    .nav > .nav-links > a {
      display: block;
      width: 100%;
    }
    .nav > #nav-check:not(:checked) ~ .nav-links {
      height: 0px;
    }
    .nav > #nav-check:checked ~ .nav-links {
      height: calc(100vh - 50px);
      overflow-y: auto;
    }
  }
</style>

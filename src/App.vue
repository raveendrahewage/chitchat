<template>
<div>
  <div class="loging" v-if="username === '' || username === null || nickname==='' || nickname===null">
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
              <input type="text" name="nickname" v-model="inputName" placeholder="Enter your nickname..">
              <input type="text" name="username" v-model="inputUserName" placeholder="Enter your username..">
            </div>
            <div class="login-btn">
              <input type="submit" value="LOG IN">
            </div>
          </form>
        </div>  
      </div>
    </div>
  </div>
  <div class="chats" v-else>
    <div class="row">
      <div class="col1">
        <div class="chat-list" >
          <div class="nav">
            <input type="checkbox" id="nav-check">
            <div class="nav-header">
              <div class="nav-title welcome-user">
                ChitChat
              </div>
            </div>
          </div>
          <section class="users">
            <div class="row">
              <div class="search">
                <input type="search" class="searchbar" v-model="userSearch" name="searchuser" placeholder="Search..." v-on:keyup="searchUser()">
              </div>
              <div v-if="searchResults.length!=0 && userSearch != '' && userSearch != null">
                <div v-for="user in  searchResults" :key="user.key" class="user" v-on:click="viewChat(user.username,user.name)">
                  <div class="row">
                    <div class="colu1">
                      <div class="pro-img">
                        <img src="./assets/img/user.png" alt="" srcset="">
                      </div>
                    </div>
                  <div class="colu2">
                    {{user.name}}
                  </div>
                </div>
              </div>
            </div>
            </div>
            <main class="user-chats">
              <div class="row">
                <div v-for="user in users" :key="user.key" class="user" v-on:click="viewChat(user.username,user.name)">
                  <div class="row">
                    <div class="colu1">
                      <div class="pro-img">
                        <img src="./assets/img/user.png" alt="" srcset="">
                      </div>
                    </div>
                    <div class="colu2">
                      {{user.name}}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </section>
        </div>
      </div>
      <div class="col2">
        <div class="chat-box" >
          <div class="nav">
            <input type="checkbox" id="nav-check">
            <div class="nav-header">
              <div class="nav-title user-name" v-if="otherUsername!='undefined'">
                {{otherNickname}}
              </div>
            </div>
            <div class="nav-links">
              <a v-on:click="logout()">{{username}}:Logout</a>
            </div>
          </div>
          <section class="msger" id="msger">
            <main class="msger-chat">
              <div v-for="message in messages" :key="message.key" :class="(message.username==username ? 'msg right-msg' : 'msg left-msg')" class="message">
                <div class="msg-bubble">
                  <div class="msg-info">
                    <div class="msg-info-name">{{message.date}}</div>
                    <div class="msg-info-time">{{message.time}}</div>
                  </div>
                  <div class="msg-text">
                    {{message.content}}
                  </div>
                </div>
              </div>
            </main>
          </section>
          <footer v-if="otherUsername != '' || otherUsername != null || otherUsername != 'undefined'">
            <form class="msger-inputarea" @submit.prevent="sendMessage()">
              <input type="text" v-model="inputMessage" class="msger-input" placeholder="Type here...">
              <button type="submit" class="msger-send-btn">Send</button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import db from './db';

export default {
  data () {
    return {
      username:'',
      nickname:'',
      messages:[],
      inputName:'',
      inputUserName:'',
      inputMessage:'',
      users:[],
      otherUsername:'',
      otherNickname:'',
      userSearch:'',
      searchResults:[],
      time:'',
      date:'',
      msgcount:0

    }
  },
  methods:{
    scrollToEnd() {
      // document.getElementById("otheruser").innerText=this.otherUsername;
			var container = document.querySelector(".msger-chat");
			var scrollHeight = container.scrollHeight;
			container.scrollTop = scrollHeight;
		},
    login () {
      this.getDate();
      sessionStorage.setItem("username", this.inputUserName);
      sessionStorage.setItem("nickname", this.inputName);
      this.username=sessionStorage.getItem("username");
      this.nickname=sessionStorage.getItem("nickname");
      if(this.nickname!=='' && this.nickname!==null){
        if(this.username!=='' && this.username!==null){
          this.inputUserName="";
          this.inputName="";
          const messageRef=db.database().ref("users");
        
          messageRef.orderByChild("username").equalTo(sessionStorage.getItem("username")).on('value',snapshot=>{
            const data=snapshot.val();
            if(data){
              // this.getMessages();
              this.getUsers();
            }else{
              const messageRef=db.database().ref("users");
              const user={
                name:this.nickname,
                username:this.username,
              }
              messageRef.push(user);
              // this.getMessages();
              this.getUsers();
            }
          });
        }
      }
    },
    sendMessage(){
      this.username=sessionStorage.getItem("username");
      let count=sessionStorage.getItem("messagecount");
      const messageRef=db.database().ref(this.username);
      if(this.inputMessage=="" || this.inputMessage==null){
        return;
      }else{
        this.getTime();
        this.getDate();
        const message={
          msgcount:parseInt(count)+1,
          otheruser:this.otherUsername,
          username:sessionStorage.getItem("username"),
          content:this.inputMessage,
          time:this.time,
          date:this.date
        }
        messageRef.push(message);
        this.inputMessage="";
        this.getMessages();
        var elem = document.getElementById('msger');
        elem.scrollTop = elem.scrollHeight;
      }
    },
    viewChat(otherUser,otherNickName){
      this.messages=[];
      this.otherUsername=otherUser;
      this.otherNickname=otherNickName;
      sessionStorage.setItem("otheruser", otherUser);
      setInterval(()=>{
        this.getMessages();
      },1000)
      // this.getMessages();
    },
    getTime(){
      var today = new Date();
      if(today.getHours()>12){
        this.time = (today.getHours()-12) + ":" + today.getMinutes()+" pm";
      }else{
        this.time = today.getHours() + ":" + today.getMinutes()+" am";
      }
    },
    getDate(){
      var today = new Date();
      this.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    },
    searchUser(){
      if(this.userSearch.length!=0 && this.userSearch!=this.username){
        const messageRef=db.database().ref("users");
      
        messageRef.orderByChild("name").equalTo(this.userSearch).on('value',snapshot=>{
          const data=snapshot.val();
          if(data.length!=0){
            let searchresults=[];
            Object.keys(data).forEach(key=>{
                searchresults.push({
                username:data[key].username,
                name:data[key].name
              });
            });
            this.searchResults=searchresults;
          }else{
            return;
          }
        });
      }else{
        return;
      }
    }
    ,
    getUsers(){
      const messageRef=db.database().ref("users");
      
      messageRef.orderByChild("name").on('value',snapshot=>{
        const data=snapshot.val();
        let allusers=[];
        Object.keys(data).forEach(key=>{
          if(data[key].name!=this.nickname && data[key].name!=""){
              allusers.push({
              username:data[key].username,
              name:data[key].name,
            });
          }
        });
        this.users=allusers;
      });
    },
    getMessages(){
      this.username=sessionStorage.getItem("username");
      this.otherUsername=sessionStorage.getItem("otheruser");
      const messageRef1=db.database().ref(this.username);
      var allmessages=[];
      
      messageRef1.orderByChild("otheruser").equalTo(this.otherUsername).on('value',snapshot=>{
        const data=snapshot.val();
        Object.keys(data).forEach(key=>{
          if(data[key].username==sessionStorage.getItem("username")){
              allmessages.push({
              id:key,
              msgcount:data[key].msgcount,
              username:data[key].username,
              content:data[key].content,
              time:data[key].time,
              date:data[key].date
            });
          }
        });
      });

      const messageRef2=db.database().ref(this.otherUsername);
      
      messageRef2.orderByChild("otheruser").equalTo(this.username).on('value',snapshot=>{
        const data=snapshot.val();
        Object.keys(data).forEach(key=>{
          if(data[key].username==this.otherUsername){
              allmessages.push({
              id:key,
              msgcount:data[key].msgcount,
              username:data[key].username,
              content:data[key].content,
              time:data[key].time,
              date:data[key].date
            });
          }
        });
      });
      this.messages=allmessages.sort((a, b) => {
      return a.msgcount - b.msgcount;
    });

      allmessages=[];
      sessionStorage.setItem("messagecount",this.messages.length);
    },
    sortMessages(a,b){
      const bandA = a.msgcount;
      const bandB = b.msgcount;

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    ,
    logout () {
      if(this.inputUserName!="" || this.inputUserName!=null){
        this.username="";
        this.messages=[];
        this.otherUsername='';
        sessionStorage.clear();
      }
    }
  },
  updated(){
    if(this.msgcount!=sessionStorage.getItem("messagecount")){
      this.msgcount=sessionStorage.getItem("messagecount");
      this.scrollToEnd();
    }
  },
  created(){
    this.getMessages();
    this.getUsers();
  }

}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body{
    margin: 0;
    background-color: rgb(0, 146, 139);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
  }

  .loging{
    width: 1200px;
    margin: auto;
    transform: translate(0, 20%);
    box-shadow: 10px 15px 15px -5px rgba(0, 0, 0, 0.2);
  }

  .column1,.column2 {
    float: left;
    width: 50%;
    height: 500px;
  }

  .column2{
    color: white;
    padding: 2rem;
    background-color: rgb(37, 168, 162);
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  .pro-img{
    width: 80%;
  }

  .col1{
    float: left;
    width: 30%;
    height: 600px;
    border-right: 1px solid rgb(190, 190, 190);
  }

  .col2{
    float: left;
    width: 70%;
    height: 600px;
  }

  .colu1{
    float: left;
    width: 20%;
  }

  .search{
    float: left;
    width: 100%;
    padding: 0.5rem;
    border-bottom: 1px solid rgb(231, 231, 231);
  }

  .searchbar{
    width: 100%;
    padding: 10px;
    border-radius: 25px;
    border: 1px solid rgb(175, 175, 175);
    outline: none;
    background-color: rgb(245, 245, 245);
  }

  .colu2{
    padding-top: 1.1rem;
    padding-bottom: 1.5rem;
    float: left;
    width: 80%;
    font-family: Comic Sans MS, Comic Sans, cursive;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .colu1 img{
    margin-top: 0.5rem;
  }

  .user{
    float: left;
    width: 100%;
    padding: 0.5rem;
    font-size: 150%;
    cursor: pointer;
    /* border: 1px solid rgb(238, 238, 238); */
    font-family: "Lucida Console", "Courier New", monospace;
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

  .chats{
    width: 1400px;
    height: 600px;
    margin: auto;
    transform: translate(0, 10%);
    box-shadow: 10px 15px 15px -5px rgba(0, 0, 0, 0.2);
    background-color: white;
  }

  .chat-box{
    width: 100%;
    height: 600px;
    transform: translate(0, 0);
    /* box-shadow: 10px 15px 15px -5px rgba(0, 0, 0, 0.2); */
    background-color: white;
  }

  .chat-list{
    width: 100%;
    height: 600px;
    transform: translate(0, 0);
    /* box-shadow: 10px 15px 15px -5px rgba(0, 0, 0, 0.2); */
    background-color: rgb(255, 255, 255);
    /* background-color: white; */
  }

  .nav {
    height: 70px;
    width: 100%;
    background-color: rgb(37, 168, 162);
    position: relative;
  }

  .nav .nav-header {
    display: inline;
  }

  .nav .nav-header .nav-title {
    display: inline-block;
    color: rgb(255, 255, 255);
    padding: 10px 10px 10px 10px;
  }

  .welcome-user{
    font-size: 250%;
    font-family: 'Brush Script MT', cursive;
  }

  .user-name{
    margin-top: 0.75rem;
    font-size: 150%;
    font-family: "Lucida Console", "Courier New", monospace;
  }

  .nav .nav-btn {
    display: none;
  }

  .nav .nav-links {
    display: inline;
    float: right;
    font-size: 20px;
    padding-top: 10px;
    font-family: "Lucida Console", "Courier New", monospace;
  }

  .nav .nav-links a {
    display: inline-block;
    padding: 13px 10px 13px 10px;
    text-decoration: none;
    cursor: pointer;
    color: rgb(255, 255, 255);
  }

  .nav #nav-check {
    display: none;
  }

  .message{
    margin-top: 1rem;
		margin-bottom: auto;
		margin-left: 10px;
		border-radius: 25px;
    font-size: 120%;
		padding: 10px;
  }

  .send{
    float: right;
    padding: 10px;
    border-radius: 20px;
    background-color: #82ccdd;
  }

  .received{
    float: left;
    padding: 10px;
    border-radius: 20px;
    background-color: rgb(0, 202, 192);
  }

  .current-user{
    text-align: right;
  }

  footer{
    width: 100%;
    position: fixed;
    bottom: 0;
  }

  @media (max-width:600px) {
    .nav .nav-btn {
      display: inline-block;
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .nav .nav-btn > label {
      display: inline-block;
      width: 50px;
      height: 50px;
      padding: 13px;
    }
    .nav .nav-btn label:hover,.nav  #nav-check:checked ~ .nav-btn > label {
      background-color: rgba(0, 0, 0, 0.3);
    }
    .nav .nav-btn label > span {
      display: block;
      width: 25px;
      height: 10px;
      border-top: 2px solid #eee;
    }
    .nav .nav-links {
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
    .nav .nav-links > a {
      display: block;
      width: 100%;
    }
    .nav #nav-check:not(:checked) ~ .nav-links {
      height: 0px;
    }
    .nav #nav-check:checked ~ .nav-links {
      height: calc(100vh - 50px);
      overflow-y: auto;
    }
  }

  /* -------------------- */
  :root {
  --body-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --msger-bg: #fff;
  --border: 2px solid #ddd;
  --left-msg-bg: #e2e2e2;
  --right-msg-bg: #579ffb;
}

.users {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  /* margin: 25px 10px; */
  height: calc(88%);
  /* border-radius: 5px; */
  background-color: rgb(255, 255, 255);
  /* background: var(--msger-bg); */
}

.msger {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  /* margin: 25px 10px; */
  height: calc(73%);
  /* border-radius: 5px; */
  background: var(--msger-bg);
}

.user-chats {
  flex: 1;
  overflow-y: auto;
}
.user-chats::-webkit-scrollbar {
  width: 6px;
}
.user-chats::-webkit-scrollbar-track {
  background: #ddd;
}
.user-chats::-webkit-scrollbar-thumb {
  background: #bdbdbd;
}

.msger-chat {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.msger-chat::-webkit-scrollbar {
  width: 6px;
}
.msger-chat::-webkit-scrollbar-track {
  background: #ddd;
}
.msger-chat::-webkit-scrollbar-thumb {
  background: #bdbdbd;
}

.msg {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}
.msg:last-of-type {
  margin: 0;
}

.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: var(--left-msg-bg);
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-size: 0.85em;
}
.msg-info-time {
  font-size: 0.85em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  background: var(--right-msg-bg);
  color: #fff;
  border-bottom-right-radius: 0;
}
.right-msg .msg-img {
  margin: 0 0 0 10px;
}

.msger-inputarea {
  display: flex;
  padding: 10px;
  border-top: var(--border);
  background: #eee;
}
.msger-inputarea * {
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 1em;
}
.msger-input {
  flex: 1;
  background: #ddd;
}
.msger-send-btn {
  margin-left: 10px;
  background: rgb(0, 196, 65);
  color: #fff;
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 11px;
  cursor: pointer;
  outline: none;
  transition: background 0.23s;
}
.msger-send-btn:hover {
  background: rgb(0, 180, 50);
}

.msger-chat {
  background-color: #fcfcfe;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23dddddd' fill-opacity='0.4'%3E%3Cpath d='M24.37 16c.2.65.39 1.32.54 2H21.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06A5 5 0 0 1-17.45 28v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H-20a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1L.9 19.22a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0L2.26 23h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM-13.82 27l16.37 4.91L18.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H-13.1z'/%3E%3Cpath id='path6_fill-copy' d='M284.37 16c.2.65.39 1.32.54 2H281.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06a5 5 0 0 1-2.24-8.94v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H240a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM246.18 27l16.37 4.91L278.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H246.9z'/%3E%3Cpath d='M159.5 21.02A9 9 0 0 0 151 15h-42a9 9 0 0 0-8.5 6.02 6 6 0 0 0 .02 11.96A8.99 8.99 0 0 0 109 45h42a9 9 0 0 0 8.48-12.02 6 6 0 0 0 .02-11.96zM151 17h-42a7 7 0 0 0-6.33 4h54.66a7 7 0 0 0-6.33-4zm-9.34 26a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-7a7 7 0 1 1 0-14h42a7 7 0 1 1 0 14h-9.34zM109 27a9 9 0 0 0-7.48 4H101a4 4 0 1 1 0-8h58a4 4 0 0 1 0 8h-.52a9 9 0 0 0-7.48-4h-42z'/%3E%3Cpath d='M39 115a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6-8a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-3-29v-2h8v-6H40a4 4 0 0 0-4 4v10H22l-1.33 4-.67 2h2.19L26 130h26l3.81-40H58l-.67-2L56 84H42v-6zm-4-4v10h2V74h8v-2h-8a2 2 0 0 0-2 2zm2 12h14.56l.67 2H22.77l.67-2H40zm13.8 4H24.2l3.62 38h22.36l3.62-38z'/%3E%3Cpath d='M129 92h-6v4h-6v4h-6v14h-3l.24 2 3.76 32h36l3.76-32 .24-2h-3v-14h-6v-4h-6v-4h-8zm18 22v-12h-4v4h3v8h1zm-3 0v-6h-4v6h4zm-6 6v-16h-4v19.17c1.6-.7 2.97-1.8 4-3.17zm-6 3.8V100h-4v23.8a10.04 10.04 0 0 0 4 0zm-6-.63V104h-4v16a10.04 10.04 0 0 0 4 3.17zm-6-9.17v-6h-4v6h4zm-6 0v-8h3v-4h-4v12h1zm27-12v-4h-4v4h3v4h1v-4zm-6 0v-8h-4v4h3v4h1zm-6-4v-4h-4v8h1v-4h3zm-6 4v-4h-4v8h1v-4h3zm7 24a12 12 0 0 0 11.83-10h7.92l-3.53 30h-32.44l-3.53-30h7.92A12 12 0 0 0 130 126z'/%3E%3Cpath d='M212 86v2h-4v-2h4zm4 0h-2v2h2v-2zm-20 0v.1a5 5 0 0 0-.56 9.65l.06.25 1.12 4.48a2 2 0 0 0 1.94 1.52h.01l7.02 24.55a2 2 0 0 0 1.92 1.45h4.98a2 2 0 0 0 1.92-1.45l7.02-24.55a2 2 0 0 0 1.95-1.52L224.5 96l.06-.25a5 5 0 0 0-.56-9.65V86a14 14 0 0 0-28 0zm4 0h6v2h-9a3 3 0 1 0 0 6H223a3 3 0 1 0 0-6H220v-2h2a12 12 0 1 0-24 0h2zm-1.44 14l-1-4h24.88l-1 4h-22.88zm8.95 26l-6.86-24h18.7l-6.86 24h-4.98zM150 242a22 22 0 1 0 0-44 22 22 0 0 0 0 44zm24-22a24 24 0 1 1-48 0 24 24 0 0 1 48 0zm-28.38 17.73l2.04-.87a6 6 0 0 1 4.68 0l2.04.87a2 2 0 0 0 2.5-.82l1.14-1.9a6 6 0 0 1 3.79-2.75l2.15-.5a2 2 0 0 0 1.54-2.12l-.19-2.2a6 6 0 0 1 1.45-4.46l1.45-1.67a2 2 0 0 0 0-2.62l-1.45-1.67a6 6 0 0 1-1.45-4.46l.2-2.2a2 2 0 0 0-1.55-2.13l-2.15-.5a6 6 0 0 1-3.8-2.75l-1.13-1.9a2 2 0 0 0-2.5-.8l-2.04.86a6 6 0 0 1-4.68 0l-2.04-.87a2 2 0 0 0-2.5.82l-1.14 1.9a6 6 0 0 1-3.79 2.75l-2.15.5a2 2 0 0 0-1.54 2.12l.19 2.2a6 6 0 0 1-1.45 4.46l-1.45 1.67a2 2 0 0 0 0 2.62l1.45 1.67a6 6 0 0 1 1.45 4.46l-.2 2.2a2 2 0 0 0 1.55 2.13l2.15.5a6 6 0 0 1 3.8 2.75l1.13 1.9a2 2 0 0 0 2.5.8zm2.82.97a4 4 0 0 1 3.12 0l2.04.87a4 4 0 0 0 4.99-1.62l1.14-1.9a4 4 0 0 1 2.53-1.84l2.15-.5a4 4 0 0 0 3.09-4.24l-.2-2.2a4 4 0 0 1 .97-2.98l1.45-1.67a4 4 0 0 0 0-5.24l-1.45-1.67a4 4 0 0 1-.97-2.97l.2-2.2a4 4 0 0 0-3.09-4.25l-2.15-.5a4 4 0 0 1-2.53-1.84l-1.14-1.9a4 4 0 0 0-5-1.62l-2.03.87a4 4 0 0 1-3.12 0l-2.04-.87a4 4 0 0 0-4.99 1.62l-1.14 1.9a4 4 0 0 1-2.53 1.84l-2.15.5a4 4 0 0 0-3.09 4.24l.2 2.2a4 4 0 0 1-.97 2.98l-1.45 1.67a4 4 0 0 0 0 5.24l1.45 1.67a4 4 0 0 1 .97 2.97l-.2 2.2a4 4 0 0 0 3.09 4.25l2.15.5a4 4 0 0 1 2.53 1.84l1.14 1.9a4 4 0 0 0 5 1.62l2.03-.87zM152 207a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6 2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-11 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-8 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-5-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-24 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm16 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm7-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zm86-29a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1 246 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM275 214a29 29 0 0 0-57.97 0h57.96zM72.33 198.12c-.21-.32-.34-.7-.34-1.12v-12h-2v12a4.01 4.01 0 0 0 7.09 2.54c.57-.69.91-1.57.91-2.54v-12h-2v12a1.99 1.99 0 0 1-2 2 2 2 0 0 1-1.66-.88zM75 176c.38 0 .74-.04 1.1-.12a4 4 0 0 0 6.19 2.4A13.94 13.94 0 0 1 84 185v24a6 6 0 0 1-6 6h-3v9a5 5 0 1 1-10 0v-9h-3a6 6 0 0 1-6-6v-24a14 14 0 0 1 14-14 5 5 0 0 0 5 5zm-17 15v12a1.99 1.99 0 0 0 1.22 1.84 2 2 0 0 0 2.44-.72c.21-.32.34-.7.34-1.12v-12h2v12a3.98 3.98 0 0 1-5.35 3.77 3.98 3.98 0 0 1-.65-.3V209a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-24c.01-1.53-.23-2.88-.72-4.17-.43.1-.87.16-1.28.17a6 6 0 0 1-5.2-3 7 7 0 0 1-6.47-4.88A12 12 0 0 0 58 185v6zm9 24v9a3 3 0 1 0 6 0v-9h-6z'/%3E%3Cpath d='M-17 191a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2H4zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1-14 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM15 214a29 29 0 0 0-57.97 0h57.96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

</style>

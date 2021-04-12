<template>
  <div class="loging">
    <div class="row">
      <div class="column1">
        <img src="./assets/img/bg2.jpg" alt="">
      </div>
      <div class="column2">
        <div class="inputs">
          <div class="app-name">
            <h1>ChitChat</h1>
          </div>
          <div class="username-input">
            <input type="text" name="username" id="" placeholder="Enter your username..">
          </div>
          <div class="login-btn">
            <input type="submit" value="Login">
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import db from './db';

export default {
  setup() {
    return {}
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body{
    margin: 0;
    background-color: rgb(0, 108, 112);
    background-image: linear-gradient(rgb(0, 84, 87), rgb(0, 143, 148));
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
  }

  .loging{
    width: 50%;
    margin: auto;
    transform: translate(0, 40%);
  }

  .column1,.column2 {
    float: left;
    width: 50%;
    height: 450px;
  }

  .column2{
    padding: 2rem;
    background-color: rgb(255, 210, 210);
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
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
  }

  .inputs::after{
    content: "";
    display: table;
    clear: both;
  }

  input[type=text]{
    width: 100%;
    padding: 15px;
    outline: none;
    border-radius: 5px;
    font-size: 120%;
    margin: 1rem 0rem 0.5rem 0rem;
    border: none;
  }

  input[type=submit]{
    width: 100%;
    padding: 10px;
    outline: none;
    border-radius: 5px;
    transition: 0.5s;
    font-size: 120%;
    margin: 1rem 0rem 0.5rem 0rem;
    color: white;
    background-color: rgb(255, 73, 73);
    border: 1.5px solid rgb(255, 73, 73);
  }

  input[type=submit]:hover{
    padding-left: 30px;
    border: 1.5px solid rgb(0, 0, 0);
  }
</style>

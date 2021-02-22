// Wesley Murray
// 2/21/2021
// Define chat app

import React, {useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

//Style
import "./App.css";
import MessageForm from "./Components/MessageForm";
import MessageBoard from "./Components/MessageBoard";

function App() {
  const connection = new signalR.HubConnectionBuilder()
      .withUrl("/hub")
      .build();

  connection.start().catch(err => document.write(err));

  return (
    <div>
      <MessageForm toServerConnection={connection} />
      <MessageBoard toServerConnection={connection} />
    </div>
  );
}

export default App;

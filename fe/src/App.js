import './App.css';
import Lobby from './components/Lobby';
import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import Play from './components/Play';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Error from './components/ErrorPage';


function App() {

  const socketUrl = 'ws://192.168.1.131:8080';
  const [gameStart, setGameStart] = useState(false);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onClose: () => sendJsonMessage({ type: "NOT_READY" }),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    switch (lastJsonMessage?.type) {
      case "START_GAME":
        setGameStart(true);
        break;
      default:
    }
  }, [lastJsonMessage])


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/"  element={!gameStart ? <Lobby sendJsonMessage={sendJsonMessage} gameStart={gameStart} /> : <Navigate to='/play'/>}/>
          <Route exact path='/play' element={<Play lastJsonMessage={lastJsonMessage} sendJsonMessage={sendJsonMessage} />} />
          <Route path="*" element={<Error />} />
        </Routes>
        </BrowserRouter>

      {/*       <Lobby sendJsonMessage={sendJsonMessage} gameStart={gameStart} />
 */}    </div>
  );
}

export default App;

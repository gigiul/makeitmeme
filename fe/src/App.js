import './App.css';
import Lobby from './components/Lobby';
import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import Play from './components/Play';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Error from './components/ErrorPage';
import Vote from './components/Vote';
import Leaderboard from './components/Leaderboard';


function App() {

  const socketUrl = 'ws://' + window.location.hostname + ':8080';
  const [gameStart, setGameStart] = useState(false);
  const [gameStarting, setGameStarting] = useState(1);
  const [src, setSrc] = useState('');
  const [numberPlayersReady, setNumberPlayersReady] = useState(0);
  const [voteMemeObj, setVoteMemeObj] = useState({});
  const [voteMeme, setVoteMeme] = useState(false);
  const [showScore, setShowScore] = useState(false);

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
/*     shouldReconnect: (closeEvent) => true,
 */  });

  useEffect(() => {
    console.log("lastJsonMessage", lastJsonMessage)
    switch (lastJsonMessage?.type) {
      case "START_GAME":
        setGameStart(true);
        setSrc(lastJsonMessage?.payload)
        break;
      case "GAME_STARTS_IN":
        setGameStarting(lastJsonMessage?.payload)
        break;
      case "NUMBER_PLAYERS_READY":
        setNumberPlayersReady(lastJsonMessage?.payload)
        break;
      case "VOTE":
        console.log(lastJsonMessage?.payload)
        setVoteMemeObj(lastJsonMessage?.payload)
        setVoteMeme(true);
        break;
      case "SCORE":
        console.log(lastJsonMessage?.payload)
        setShowScore(true);
        break;
      default:
    }
  }, [lastJsonMessage])


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/"  element={(!gameStart || (gameStarting > 0))  ? <Lobby sendJsonMessage={sendJsonMessage} gameStart={gameStart} gameStarting={gameStarting} numberPlayersReady={numberPlayersReady} /> : <Navigate to='/play'/>}/>
          <Route exact path='/play' element={(!voteMeme) ? <Play lastJsonMessage={lastJsonMessage} sendJsonMessage={sendJsonMessage} src={src}/> : <Navigate to='/vote' /> } />
          <Route exact path='/vote' element={ (!showScore) ? <Vote voteMemeObj={voteMemeObj} lastJsonMessage={lastJsonMessage} /> : <Leaderboard /> } />
          <Route path="*" element={<Error />} />
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

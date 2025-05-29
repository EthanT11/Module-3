import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.js'
import MainMenuScreen from './game/menu/MainMenuScreen'
import CreateGameEnvironment from './game/CreateGameEnvironment'
import { RoomProvider } from './contexts/RoomContext'
import CreateLobby from './game/lobby/CreateLobby'

createRoot(document.getElementById('root')!).render(
  // <StrictMode> | FINDME: Turned off for now since it's causing players to double up
  <RoomProvider>
    <BrowserRouter>
      <Routes>
          <Route index element={<MainMenuScreen />} />
          <Route path="/lobby/:roomId" element={<CreateLobby />} />
          {/* <Route path="/game/:roomId" element={<CreateGameEnvironment /> */}
          {/* TODO: about route */}
      </Routes>
    </BrowserRouter>
  </RoomProvider>
  // </StrictMode>
)

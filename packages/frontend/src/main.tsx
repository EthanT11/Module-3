import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.js'
import MainMenuScreen from './game/menu/MainMenuScreen'
import CreateGameEnvironment from './game/CreateGameEnvironment'
import { RoomProvider } from './context/RoomContext'

createRoot(document.getElementById('root')!).render(
  // <StrictMode> | FINDME: Turned off for now since it's causing players to double up
  <RoomProvider>
    <BrowserRouter>
      <Routes>
          <Route index element={<MainMenuScreen />} />
          <Route path="/lobby/:roomId" element={<CreateGameEnvironment />} />
          {/* TODO: game route */}
          {/* TODO: about route */}
      </Routes>
    </BrowserRouter>
  </RoomProvider>
  // </StrictMode>
)

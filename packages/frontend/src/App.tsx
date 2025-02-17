import CreateEnvironment from "./components/CreateEnvironment";
import "./App.css";
import { useState, useEffect } from "react";
import { Client } from "colyseus.js";

// ROOM SCREEN
// TODO: Create serpate component
// TODO: Fix issue where players are doubling up on join
// TODO: Maybe show full rooms | sometimes it's nice to see activity and will fill out the roomsscreen
// TODO: Make a way for player to join a room by typing in the room id
// TODO: Make a way to create a room and be in a lobby with the friend instead of immediately starting the game
// TODO: Add a way to chat
// TODO: Style

// START SCREEN
// TODO: Create separate component
// TODO: Check if there is a better way to show different screens/pages
// TODO: Cool art or maybe a spinning scene if possible and not too laggy
// TODO: Style


const RoomScreen = () => {
  const [rooms, setRooms] = useState<any[]>([]); // TODO: fix type 
  const [gameStarted, setGameStarted] = useState(false);
  const client = new Client("ws://localhost:2567");

  useEffect(() => {
    const fetchRooms = async () => {
      if (!gameStarted) { // Fetch rooms only if game hasn't started
        try {
          const availableRooms = await client.getAvailableRooms();
          setRooms(availableRooms);
          
          if (availableRooms.length === 0) { // If no rooms are open, create a new room 
            const newRoom = await client.create("my_room"); // FINDME: this is the schema for colyseus, will eventually change the name. Or make this more dynamic.
            console.log("Created new room:", newRoom);
            setGameStarted(true);
          }
        } catch (error) {
          console.error('Error fetching/creating rooms:', error);
        }
      };
      }

      fetchRooms();
      
    // Check for rooms every 5 seconds
    let interval: NodeJS.Timeout;
    if (!gameStarted) {
      interval = setInterval(fetchRooms, 5000);
    }
    
    return () => {
      clearInterval(interval)
    };
  }, [gameStarted]);

  const handleJoinRoom = async (roomId: string) => {
    try {
      const room = await client.joinById(roomId);
      console.log("Joined room:", room);
      setGameStarted(true);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  if (gameStarted) {
    return <CreateEnvironment />;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">Available Rooms</h1>
      <div className="grid">
        {rooms.map((room) => (
          <div key={room.roomId}>
            <h2 className="font-bold">Room ID: {room.roomId}</h2>
            <p className="">Clients: {room.clients}/{room.maxClients}</p>
            <button 
              onClick={() => handleJoinRoom(room.roomId)}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4"
            >
              Join Game
            </button>
          </div>
        ))}
        {rooms.length === 0 && (
          <div>
            <p>Creating new room...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StartScreen = () => {
  const [showRooms, setShowRooms] = useState(false);

  if (showRooms) {
    return <RoomScreen />
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center text-black">Start Screen</h1>
      <button 
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4"
        onClick={() => setShowRooms(true)}
      >
        Start
      </button>
    </div>
  )
};

export default () => {
  return (
    <div>
      <StartScreen />
    </div>
  )
};
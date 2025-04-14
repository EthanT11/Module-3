import { useState, useEffect } from "react";
import { Client, Room, RoomAvailable } from "colyseus.js";
import { BACKEND_URL } from "../../networking/setupMultiplayer";
import CreateGameEnvironment from "../../game/CreateGameEnvironment";
import { PlayerStateManager } from "../../game/player/PlayerState";

// ROOM SCREEN
// TODO: Create serpate component
// TODO: Maybe show full rooms | sometimes it's nice to see activity and will fill out the roomsscreen
// TODO: Make a way for player to join a room by typing in the room id
// TODO: Make a way to create a room and be in a lobby with the friend instead of immediately starting the game
// TODO: Add a way to chat
// TODO: Style

const RoomScreen = () => {
    const [rooms, setRooms] = useState<RoomAvailable[]>([]); // TODO: fix type 
    const [gameStarted, setGameStarted] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room>();
    const [isHost, setIsHost] = useState(false);

    const colyseusClient: Client = new Client(BACKEND_URL); // Colyseus client
    const colyseusRoomSchema: string = "my_room"; // FINDME: this is the schema for colyseus, will eventually change the name. Or make this more dynamic.
  
    useEffect(() => {
      const fetchRooms = async () => {
        if (!gameStarted) { // Fetch rooms only if game hasn't started
          try {
            const availableRooms = await colyseusClient.getAvailableRooms();
            setRooms(availableRooms);
            setIsHost(false);
            
            // NOTE: This is a temporary solution to create a new room if no rooms are open
            // It helps with testing and development to not have to manually create a room
            if (availableRooms.length === 0) { // If no rooms are open, create a new room 
              const newRoom = await colyseusClient.create(colyseusRoomSchema);
              console.log("Created new room. Room ID: ", newRoom.roomId);
              setIsHost(true);
              setCurrentRoom(newRoom);
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
    }, [gameStarted, currentRoom]);
    

    // Join a room
    const handleJoinRoom = async (roomId: string) => {
      if (currentRoom) { 
        await currentRoom.leave(); // Disconnect from the current room before joining a new one
      }
  
      try {
        const room = await colyseusClient.joinById(roomId);
        console.log("Joined room. Room ID: ", room.roomId);
  
        setCurrentRoom(room);
        setGameStarted(true);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    };
    
    // If the game has started and there is a current room, render the game environment
    if (gameStarted && currentRoom) {
      return <CreateGameEnvironment room={currentRoom} isHost={isHost} />;
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

  export default RoomScreen;
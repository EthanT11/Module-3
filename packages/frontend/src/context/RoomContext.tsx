import React, { createContext, useContext, useEffect, useState } from "react";
import { Client, Room, RoomAvailable } from "colyseus.js";
import { BACKEND_URL } from "../networking/setupMultiplayer";

interface RoomContextType {
  room: Room<any> | null;
  isHost: boolean;
  createRoom: () => Promise<Room<any> | null>;
  joinRoom: (roomId: string) => Promise<Room<any> | null>;
  setRoomInfo: (room: Room<any>, isHost: boolean) => void;
  getAvailableRooms: () => Promise<RoomAvailable[]>;
}

const RoomContext = createContext<RoomContextType>({
  room: null,
  isHost: false,
  createRoom: async () => null,
  joinRoom: async () => null,
  setRoomInfo: () => {},
  getAvailableRooms: async () => [],
});

export const useRoomContext = () => useContext(RoomContext);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<Room<any> | null>(null);
  const [isHost, setIsHost] = useState(false);
  const client = new Client(BACKEND_URL);

  // Set the current room and host status
  const setRoomInfo = (room: Room<any>, isHost: boolean) => {
    setRoom(room);
    setIsHost(isHost);
    localStorage.setItem("colyseus_roomId", room.roomId);
  };

  // TODO: Probably need to add a clear room info function when finished a game and going back to the main menu

  const createRoom = async () => {
    try {
      const newRoom = await client.create("my_room");
      setRoomInfo(newRoom, true);
      return newRoom;
    } catch (err) {
      console.error("Failed to create room:", err);
      return null;
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const joinedRoom = await client.joinById(roomId);
      setRoomInfo(joinedRoom, false);
      return joinedRoom;
    } catch (err) {
      console.error("Failed to join room:", err);
      return null;
    }
  };

  const getAvailableRooms = async () => {
    try {
      const availableRooms = await client.getAvailableRooms();
      return availableRooms;
    } catch (err) {
      console.error("Failed to get available rooms:", err);
      return [];
    }
  };

  return (
    <RoomContext.Provider value={{
      room,
      isHost,
      createRoom,
      joinRoom,
      setRoomInfo,
      getAvailableRooms,
    }}>
      {children}
    </RoomContext.Provider>
  );
};
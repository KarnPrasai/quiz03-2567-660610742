import { DB , Database , readDB, Room, User, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { platform } from "os";

export const GET = async () => {
  readDB();
  
  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms:  (<Database>DB).rooms.length
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
 
  const body = await request.json();
  const { roomName } = body;
  readDB();
  const foundRoom = (<Database>DB).rooms.find(
    (x) => x.roomName === roomName
  );
  if(foundRoom)
  {
    return NextResponse.json(
     {
       ok: false,
       message: `Room ${foundRoom.roomName} already exists`,
     },
     { status: 400 }
   );
  }
   
  const roomId = nanoid();
  (<Database>DB).rooms.push(
    {
      roomId,
      roomName,
    }
  );
  //call writeDB after modifying Database
  writeDB();
  

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${body.roomName} has been created`,
  });
};

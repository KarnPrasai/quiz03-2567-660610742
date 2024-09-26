import { DB, Database , readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  
  const roomExist = (<Database>DB).messages.find(
    (x) => x.roomId === roomId
  )
  if(!roomExist)
  {
    return NextResponse.json(
      {
        ok : false,
        message : "Room is not found"
      }
      ,
      { status : 404 }
    );
  }
  
  let filteredMessage = (<Database>DB).messages.filter(
    (x) => x.roomId === roomId
  )
  

  return NextResponse.json(
    {
      ok : true,
      message : filteredMessage
    }
  );
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId , messageText } = body;

  const foundRoom = (<Database>DB).messages.findIndex(
    (x) => x.roomId === roomId
  )

  if(foundRoom === -1)
  {
    return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );
  }

  // 

  const messageId = nanoid();
  (<Database>DB).messages.push(
    {
      roomId,
      messageId,
      messageText,
    }
  );
  writeDB();

  return NextResponse.json({
    ok: true,
    // messageId,
    roomId: roomId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
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

  readDB();
  const body = await request.json();
  const { messageId } = body;

  const foundMessage = (<Database>DB).messages.findIndex(
    (x) => x.messageId === messageId
  )

  if(foundMessage === -1)
  {
    return NextResponse.json(
     {
       ok: false,
       message: "Message is not found",
     },
     { status: 404 }
   );
  }
  (<Database>DB).messages.splice(foundMessage,1);
  writeDB();
  
  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};

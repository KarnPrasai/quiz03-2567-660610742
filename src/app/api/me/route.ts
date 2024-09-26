import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Karn Prasai",
    studentId: "660610742",
  });
};

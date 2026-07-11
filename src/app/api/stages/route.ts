import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const stages = await prisma.educationStage.findMany({
      include: {
        grades: {
          include: {
            subjects: {
              include: {
                books: true,
                lessons: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
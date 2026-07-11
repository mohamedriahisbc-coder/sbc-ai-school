import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const stage = await prisma.educationStage.findUnique({
      where: {
        id,
      },
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

    return NextResponse.json(stage);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
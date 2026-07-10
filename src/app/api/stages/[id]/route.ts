import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    console.log("DEBUG ID:", id);

    const stage = await prisma.stage.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        grades: {
          include: {
            subjects: {
              include: {
                chapters: {
                  include: {
                    lessons: true,
                  },
                },
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
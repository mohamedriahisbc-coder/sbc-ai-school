import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gradeId = Number(id);

    if (isNaN(gradeId)) {
      return NextResponse.json({ error: "Invalid Grade ID" }, { status: 400 });
    }

    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        semesters: {
          include: {
            subjects: true, // جلب المواد التابعة لكل فصل دراسي
          },
        },
      },
    });

    if (!grade) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    return NextResponse.json(grade);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

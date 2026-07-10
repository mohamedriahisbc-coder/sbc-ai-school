import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subjectId = Number(id);

    if (isNaN(subjectId)) {
      return NextResponse.json(
        { error: "Invalid Subject ID" },
        { status: 400 }
      );
    }

    // جلب المادة متضمنة الأبواب (Chapters) وداخل كل باب الدروس (Lessons) التابعة له
    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
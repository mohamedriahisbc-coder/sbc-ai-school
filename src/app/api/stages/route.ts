import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; 

export async function GET() {
  try {
    // جلب الشجرة التعليمية كاملة من المراحل وحتى الدروس لكي لا تنقطع البيانات في الواجهة
    const stages = await prisma.stage.findMany({
      include: {
        tracks: {
          include: {
            grades: {
              include: {
                terms: {
                  include: {
                    subjects: {
                      include: {
                        units: {
                          include: {
                            lessons: true // جلب الدروس بداخل الوحدات
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(stages || []);
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json([]);
  }
}
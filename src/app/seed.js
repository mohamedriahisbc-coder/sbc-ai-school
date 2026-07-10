const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("جاري تنظيف قاعدة البيانات القديمة...");
  await prisma.lesson.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.grade.deleteMany({});
  await prisma.stage.deleteMany({});

  console.log("جاري إدخال البيانات التجريبية الجديدة...");

  // 1. إنشاء المرحلة الثانوية
  const secondaryStage = await prisma.stage.create({
    data: {
      name: "المرحلة الثانوية",
    },
  });

  // 2. إنشاء الصف الأول الثانوي
  const grade1 = await prisma.grade.create({
    data: {
      name: "الصف الأول الثانوي",
      stageId: secondaryStage.id,
    },
  });

  // 3. إنشاء الفصول الدراسية (الترم الأول والثاني)
  const semester1 = await prisma.semester.create({
    data: {
      name: "الفصل الدراسي الأول",
      gradeId: grade1.id,
    },
  });

  // 4. إنشاء مادة تجريبية (مثال: الرياضيات)
  const mathSubject = await prisma.subject.create({
    data: {
      name: "الرياضيات 1-1",
      semesterId: semester1.id,
    },
  });

  // 5. إنشاء وحدة/باب داخل المادة
  const chapter1 = await prisma.chapter.create({
    data: {
      name: "الوحدة الأولى: التبرير والبرهان",
      subjectId: mathSubject.id,
    },
  });

  // 6. إنشاء دروس داخل الوحدة
  await prisma.lesson.createMany({
    data: [
      { name: "الدرس 1-1: التبرير الاستقرائي والتخمين", chapterId: chapter1.id },
      { name: "الدرس 1-2: المنطق", chapterId: chapter1.id },
      { name: "الدرس 1-3: العبارات الشرطية", chapterId: chapter1.id },
    ],
  });

  console.log("✅ تم تغذية قاعدة البيانات بنجاح وظهور أول مسار تعليمي!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
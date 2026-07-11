import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting full Saudi Curriculum seed process...');

  // 1. تنظيف شامل لقاعدة البيانات لضمان عدم تداخل البيانات القديمة
  
  // 1. تنظيف شامل لقاعدة البيانات (بالترتيب الصحيح لتجنب تعارض العلاقات)
await prisma.lesson.deleteMany({});
await prisma.unit.deleteMany({});
await prisma.subject.deleteMany({});
await prisma.term.deleteMany({});
await prisma.grade.deleteMany({});
await prisma.stage.deleteMany({});
await prisma.aiContent.deleteMany({}); // تنظيف النماذج الأخرى إن وجدت
  // ==========================================
  // 1. إنشاء المرحلة الابتدائية وصفوفها
  // ==========================================
  const elementaryStage = await prisma.educationStage.create({
    data: { name: 'المرحلة الابتدائية' },
  });

  const elementaryGrades = [
    'الصف الأول الابتدائي',
    'الصف الثاني الابتدائي',
    'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي',
    'الصف الخامس الابتدائي',
    'الصف السادس الابتدائي',
  ];

  for (const gradeName of elementaryGrades) {
    const grade = await prisma.grade.create({
      data: { name: gradeName, stageId: elementaryStage.id },
    });

    // المواد الرسمية للمرحلة الابتدائية (موزعة على الفصل الأول والثاني)
    const elementarySubjects = [
      'القرآن الكريم والدراسات الإسلامية',
      'اللغة العربية (لغتي)',
      'الرياضيات',
      'العلوم',
      'اللغة الإنجليزية',
      'التربية الفنية',
      'المهارات الحياتية والأسرية',
    ];

    for (const subjectName of elementarySubjects) {
      const subject = await prisma.subject.create({
        data: { name: subjectName, gradeId: grade.id },
      });

      // إدخال كتب الطالب للفصلين الأول والثاني مع أحجامها الافتراضية للـ 50GB
      await prisma.book.createMany({
        data: [
          {
            title: `كتاب ${subjectName} - الفصل الدراسي الأول`,
            term: 'FIRST',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/term1.pdf`,
            fileSizeMb: 35.4,
            subjectId: subject.id,
          },
          {
            title: `كتاب ${subjectName} - الفصل الدراسي الثاني`,
            term: 'SECOND',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/term2.pdf`,
            fileSizeMb: 38.2,
            subjectId: subject.id,
          },
        ],
      });

      // إدخال دروس عينة للفصل الأول والثاني كمثال هيكلي دائم
      await prisma.lesson.createMany({
        data: [
          { title: 'الدرس الأول: التمهيد والتهيئة', term: 'FIRST', subjectId: subject.id },
          { title: 'الدرس الثاني: الأنشطة الأساسية', term: 'FIRST', subjectId: subject.id },
          { title: 'الدرس الثالث: مراجعة واستيعاب', term: 'SECOND', subjectId: subject.id },
          { title: 'الدرس الرابع: التطبيقات المتقدمة', term: 'SECOND', subjectId: subject.id },
        ],
      });
    }
  }

  // ==========================================
  // 2. إنشاء المرحلة المتوسطة وصفوفها
  // ==========================================
  const intermediateStage = await prisma.educationStage.create({
    data: { name: 'المرحلة المتوسطة' },
  });

  const intermediateGrades = [
    'الصف الأول المتوسط',
    'الصف الثاني المتوسط',
    'الصف الثالث المتوسط',
  ];

  for (const gradeName of intermediateGrades) {
    const grade = await prisma.grade.create({
      data: { name: gradeName, stageId: intermediateStage.id },
    });

    // المواد الرسمية للمرحلة المتوسطة للفصل الأول والثاني
    const intermediateSubjects = [
      'القرآن الكريم',
      'الدراسات الإسلامية',
      'اللغة العربية (لغتي الخالدة)',
      'الرياضيات',
      'العلوم',
      'الدراسات الاجتماعية',
      'اللغة الإنجليزية (Super Goal)',
      'المهارات الرقمية',
      'التربية الفنية',
    ];

    for (const subjectName of intermediateSubjects) {
      const subject = await prisma.subject.create({
        data: { name: subjectName, gradeId: grade.id },
      });

      // رفع وتسكين كتب الفصل الأول والثاني للمتوسط
      await prisma.book.createMany({
        data: [
          {
            title: `كتاب ${subjectName} - الطالب - الفصل الأول`,
            term: 'FIRST',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/t1.pdf`,
            fileSizeMb: 52.1,
            subjectId: subject.id,
          },
          {
            title: `كتاب ${subjectName} - الطالب - الفصل الثاني`,
            term: 'SECOND',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/t2.pdf`,
            fileSizeMb: 49.8,
            subjectId: subject.id,
          },
        ],
      });

      await prisma.lesson.createMany({
        data: [
          { title: 'الوحدة الأولى: مدخل ومفاهيم', term: 'FIRST', subjectId: subject.id },
          { title: 'الوحدة الثانية: التحليل والتطبيق', term: 'FIRST', subjectId: subject.id },
          { title: 'الوحدة الثالثة: تعميق المهارات', term: 'SECOND', subjectId: subject.id },
          { title: 'الوحدة الرابعة: التقييم الختامي', term: 'SECOND', subjectId: subject.id },
        ],
      });
    }
  }

  // ==========================================
  // 3. إنشاء المرحلة الثانوية (نظام المسارات الحديث)
  // ==========================================
  const secondaryStage = await prisma.educationStage.create({
    data: { name: 'المرحلة الثانوية' },
  });

  const secondaryGrades = [
    'السنة الأولى المشتركة',
    'مسار العام',
    'مسار الحاسب والهندسة',
    'مسار الصحة والحياة',
    'مسار إدارة الأعمال',
    'المسار الشرعي',
  ];

  for (const gradeName of secondaryGrades) {
    const grade = await prisma.grade.create({
      data: { name: gradeName, stageId: secondaryStage.id },
    });

    // اختيار مواد المسارات الثانوية الرسمية لتوزيعها على الفصول
    let secondarySubjects: string[] = [];
    
    if (gradeName === 'السنة الأولى المشتركة') {
      secondarySubjects = ['الكفايات اللغوية 1', 'الرياضيات 1', 'الفيزياء 1', 'علم البيئة', 'التفكير الناقد', 'اللغة الإنجليزية 1', 'المهارات الرقمية'];
    } else if (gradeName === 'مسار الحاسب والهندسة') {
      secondarySubjects = ['الهندسة الكهربائية', 'الذكاء الاصطناعي', 'التحليل الهندسي', 'الرياضيات المتقدمة', 'الفيزياء المتقدمة'];
    } else {
      secondarySubjects = ['الرياضيات', 'الكيمياء', 'الأحياء', 'اللغة الإنجليزية', 'التاريخ', 'الحاسب الآلي'];
    }

    for (const subjectName of secondarySubjects) {
      const subject = await prisma.subject.create({
        data: { name: subjectName, gradeId: grade.id },
      });

      // إنشاء الهيكل الكامل لكتب ومواد الثانوي للترم الأول والترم الثاني
      await prisma.book.createMany({
        data: [
          {
            title: `كتاب ${subjectName} - مسارات - الفصل الأول`,
            term: 'FIRST',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/secondary-t1.pdf`,
            fileSizeMb: 65.0,
            subjectId: subject.id,
          },
          {
            title: `كتاب ${subjectName} - مسارات - الفصل الثاني`,
            term: 'SECOND',
            fileUrl: `https://storage.sbc-ai-school.com/books/${grade.id}/${subject.id}/secondary-t2.pdf`,
            fileSizeMb: 68.5,
            subjectId: subject.id,
          },
        ],
      });

      await prisma.lesson.createMany({
        data: [
          { title: 'الفصل 1: الأسس النظرية والمفاهيم', term: 'FIRST', subjectId: subject.id },
          { title: 'الفصل 2: التجارب والممارسات', term: 'FIRST', subjectId: subject.id },
          { title: 'الفصل 3: تطبيقات وتطوير', term: 'SECOND', subjectId: subject.id },
          { title: 'الفصل 4: المشاريع النهائية', term: 'SECOND', subjectId: subject.id },
        ],
      });
    }
  }

  console.log('✅ Full Saudi Curriculum Structure (Term 1 & Term 2) successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding curriculum:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import * as fs from 'fs';
import * as path from 'path';

// هذا هو مسارك على الكمبيوتر
const basePath = `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية`;

function parseLocalMناهج(dirPath: string, stageName = "المرحلة الابتدائية") {
  if (!fs.existsSync(dirPath)) {
    console.error("المسار غير موجود، تأكد من كتابته بشكل صحيح!");
    return;
  }

  // 1. قراءة الصفوف (مثل: الصف الأول)
  const grades = fs.readdirSync(dirPath);

  grades.forEach((grade) => {
    const gradePath = path.join(dirPath, grade);
    if (!fs.statSync(gradePath).isDirectory()) return;

    // 2. قراءة الفصول (مثل: الفصل الأول)
    const terms = fs.readdirSync(gradePath);
    terms.forEach((term) => {
      const termPath = path.join(gradePath, term);
      if (!fs.statSync(termPath).isDirectory()) return;

      // 3. قراءة المواد (مثل: العلوم)
      const subjects = fs.readdirSync(termPath);
      subjects.forEach((subject) => {
        const subjectPath = path.join(termPath, subject);
        if (!fs.statSync(subjectPath).isDirectory()) return;

        // 4. قراءة ملفات الدروس الـ PDF
        const files = fs.readdirSync(subjectPath);
        files.forEach((file) => {
          if (path.extname(file).toLowerCase() !== '.pdf') return;

          const fileNameWithoutExt = path.basename(file, '.pdf');
          const parts = fileNameWithoutExt.split('_');
          
          const lessonOrder = parseInt(parts[0]) || 0;
          const lessonTitle = parts.slice(1).join(' ').trim();

          // طباعة الفهرس المستخرج أمامك في الشاشة
          console.log(`[فهرس جاهز] ➔ المرحلة: ${stageName} | الصف: ${grade} | الفصل: ${term} | المادة: ${subject} | درس رقم (${lessonOrder}): ${lessonTitle}`);
        });
      });
    });
  });
}

console.log("جاري قراءة المجلدات محلياً لبناء الفهرس...");
parseLocalMناهج(basePath);
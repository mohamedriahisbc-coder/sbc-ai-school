import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// قراءة ملف الـ env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.GEMINI_API_KEY) {
  console.error("خطأ: لم يتم العثور على GEMINI_API_KEY في ملف الـ .env.local");
  process.exit(1);
}

// تهيئة مكتبة Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const booksToProcess = [
  { subjectName: "التربية الفكرية", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\التربية الفكرية\\التربية الفكرية_01.pdf` },
  { subjectName: "التربية الفنية", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\التربية الفنية 1\\01_التربية الفنية1.pdf` },
  { subjectName: "الدراسات الإسلامية", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\الدراسات الإسلامية 1\\01_الدراسات الإسلامية1 .pdf` },
  { subjectName: "الرياضيات", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\الرياضيات 1\\01_الرياضيات1.pdf` },
  { subjectName: "العلوم", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\العلوم 1\\01_العلوم1.pdf` },
  { subjectName: "المهارات الحياتية والأسرية", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\المهارات الحياتية والأسرية 1\\01_المهارات الحياتية والأسرية1.pdf` },
  { subjectName: "لغتي", path: `C:\\Users\\moham\\OneDrive\\Desktop\\المرحلة الابتدائية\\الصف الأول\\الفصل الأول\\لغتي 1\\01_لغتي1.pdf` }
];

async function processAllBooks() {
  console.log(`🚀 بدء المعالجة بنظام الاستخراج الحر والنموذج المجاني (العدد: ${booksToProcess.length})...\n`);

  for (let i = 0; i < booksToProcess.length; i++) {
    const book = booksToProcess[i];
    console.log(`--------------------------------------------------`);
    console.log(`📚 [${i + 1}/${booksToProcess.length}] جاري العمل على مادة: [ ${book.subjectName} ]`);
    
    if (!fs.existsSync(book.path)) {
      console.error(`❌ خطأ: الملف غير موجود في المسار للمادة! تخطي...`);
      continue;
    }

    let uploadedFile: any = null;
    const tempEnglishPath = path.join(process.cwd(), `temp_book.pdf`);

    try {
      console.log("1. جاري تهيئة نسخة معقمة الاسم...");
      fs.copyFileSync(book.path, tempEnglishPath);

      console.log("2. جاري رفع ملف الـ PDF عبر Files API...");
      uploadedFile = await ai.files.upload({
        file: tempEnglishPath,
        mimeType: 'application/pdf',
      });
      console.log(`   تم الرفع المؤقت بنجاح. معرف الملف: ${uploadedFile.name}`);

      console.log("3. جاري معالجة الملف وتجهيزه للذكاء الاصطناعي...");
      let fileState = await ai.files.get({ name: uploadedFile.name });
      while (fileState.state === 'PROCESSING') {
        await delay(2000);
        fileState = await ai.files.get({ name: uploadedFile.name });
      }

      if (fileState.state === 'FAILED') {
        throw new Error('فشلت معالجة ملف الـ PDF على خوادم جوجل.');
      }

      console.log("4. جاري تحليل الكتاب واستخراج الفهرس الهيكلي...");
      const response = await ai.models.generateContent({
        // عدنا إلى flash لأنه المتاح مجاناً وحللنا مشكلة الـ 400 بإزالة المخطط المعقد والتأكيد على صيغة النص
        model: 'gemini-2.5-flash',
        contents: [
          {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType
            }
          },
          `أنت خبير مناهج سعودية. قم بقراءة كتاب [ ${book.subjectName} ] المرفق كاملاً واستخرج منه الفهرس بالتفصيل. 
          أريد النتيجة ككائن JSON يحتوي على مصفوفة اسمها "lessons"، وداخل كل عنصر الحقول التالية باللغة العربية:
          - chapterTitle: اسم الفصل أو الوحدة
          - lessonTitle: اسم الدرس كاملاً
          - startPage: رقم صفحة بداية الدرس (كنص)
          - endPage: رقم صفحة نهاية الدرس (كنص)
          
          تأكد أن تعيد JSON نقي فقط بدون أي مقدمات أو مؤخرات.`
        ],
        config: {
          // جعلنا المخرجات json ولكن بدون فرض كائن الـ Schema الصارم من طرف السيرفر لتفادي الـ 400
          responseMimeType: "application/json"
        }
      });

      if (!response.text) {
        console.error(`❌ خطأ: رد الذكاء الاصطناعي فارغ لمادة ${book.subjectName}`);
        continue;
      }

      console.log(`✅ تم استخراج فهرس [ ${book.subjectName} ] بنجاح:`);
      try {
        const resultJson = JSON.parse(response.text);
        console.log(JSON.stringify(resultJson, null, 2));
      } catch (e) {
        // في حال رجع النص ومعه علامات الأكواد المعتادة
        console.log(response.text);
      }

    } catch (error) {
      console.error(`❌ حدث خطأ أثناء معالجة مادة ${book.subjectName}:`, error);
    } finally {
      // تنظيف الملف المؤقت محلياً
      if (fs.existsSync(tempEnglishPath)) {
        try { fs.unlinkSync(tempEnglishPath); } catch (e) {}
      }
      // تنظيف وحذف الملف من سيرفرات جوجل
      if (uploadedFile) {
        try {
          await ai.files.delete({ name: uploadedFile.name });
          console.log(`🧹 تم تنظيف وحذف الملف المؤقت من خوادم جوجل.`);
        } catch (delError) {
          console.error("فشل حذف الملف المؤقت من خوادم جوجل:", delError);
        }
      }
    }
    
    console.log(`--------------------------------------------------\n`);

    if (i < booksToProcess.length - 1) {
      console.log("⏳ الانتظار لمدة 20 ثانية للحفاظ على استقرار الكوتا المجانية...");
      await delay(20000);
    }
  }

  console.log("✨ انتهت العملية كاملة لجميع المناهج بنجاح!");
}

processAllBooks();
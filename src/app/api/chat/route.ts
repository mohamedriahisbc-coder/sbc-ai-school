import { NextRequest, NextResponse } from "next/server";
// تأكد تماماً أن هذا هو سطر الاستيراد الوحيد الخاص بجوجل
import { GoogleGenerativeAI } from "@google/generative-ai";

// التعديل هنا: استخدام الاسم الصحيح للكلاس
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { action, lessonId, userMessage } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. نظام تلخيص الدرس
    if (action === "summarize") {
      const prompt = `أنت معلم سعودي خبير ومحفز. قم بكتابة ملخص شيق ومنظم على شكل نقاط رئيسية مستهدفة للدرس الذي يحمل المعرف أو العنوان التالي: (${lessonId}). استخدم إيموجيات مناسبة واجعل الأسلوب سهلاً ومفهوماً لطلاب المرحلة الابتدائية.`;
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text() });
    }

    // 2. نظام اسأل AI (المعلم الذكي)
    if (action === "ask") {
      const prompt = `أنت المعلم الذكي لمنصة SBC AI School. تجيب على أسئلة الطلاب بذكاء، مرح، وأسلوب مبسط يناسب المنهج السعودي. سؤال الطالب حول الدرس (${lessonId}) هو: "${userMessage}". أجب باختصار وتشجيع.`;
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text() });
    }

    // 3. نظام توليد الاختبارات التفاعلية
    if (action === "generate_quiz") {
      const prompt = `قم بتوليد اختبار قصير مكون من 3 أسئلة خيارات متعددة (MCQ) لدرس المنهج السعودي: (${lessonId}).
      يجب أن تكون الإجابة بصيغة JSON فقط كصفوف مصفوفة بالشكل التالي تماماً دون أي مقدمات أو نصوص خارج الجييسون:
      [
        {"question": "السؤال الأول؟", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0},
        {"question": "السؤال الثاني؟", "options": ["أ", "ب", "ج", "د"], "correctIndex": 1},
        {"question": "السؤال الثالث؟", "options": ["أ", "ب", "ج", "د"], "correctIndex": 2}
      ]`;
      const result = await model.generateContent(prompt);
      const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
      return NextResponse.json({ quiz: JSON.parse(cleanJson) });
    }

    return NextResponse.json({ error: "الإجراء غير مدعوم" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ في خادم الذكاء الاصطناعي" }, { status: 500 });
  }
}
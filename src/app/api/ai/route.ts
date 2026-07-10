import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();
    
    // التحقق من وجود مفتاح API
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key غير موجود" }, { status: 500 });
    }

    const modelName = "gemini-1.5-flash"; // استخدم الإصدار المعتمد والمتاح حالياً
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // توجيهات النظام (System Prompts)
    const prompts: Record<string, string> = {
      summarize: `أنت معلم سعودي خبير. لخص الدرس التالي: (${text}) في نقاط رئيسية مركزة بأسلوب تعليمي مبسط للطلاب.`,
      ask: `أنت معلم ذكي لمنصة SBC AI School. أجب على سؤال الطالب: "${text}" بأسلوب مبسط ومحفز يناسب المنهج السعودي.`,
      generate_quiz: `أنشئ 3 أسئلة اختيار من متعدد للدرس: (${text}). أجب بصيغة JSON فقط كصفوف مصفوفة بالشكل التالي تماماً دون أي مقدمات: [{"question": "...", "options": ["أ", "ب", "ج", "د"], "correctIndex": 0}].`
    };

    const finalPrompt = prompts[action];
    if (!finalPrompt) {
      return NextResponse.json({ error: "الإجراء غير مدعوم" }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: finalPrompt }] }] 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return NextResponse.json({ error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي" }, { status: 500 });
    }

    let output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // تنظيف مخرجات الـ JSON
    if (action === "generate_quiz") {
      output = output.replace(/```json|```/g, "").trim();
      return NextResponse.json({ quiz: JSON.parse(output) });
    }

    return NextResponse.json({ result: output });

  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "فشل في معالجة الطلب" }, { status: 500 });
  }
}
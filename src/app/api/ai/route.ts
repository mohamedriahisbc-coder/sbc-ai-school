import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();
    
    // التحقق من وجود مفتاح API
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key غير موجود" }, { status: 500 });
    }

    const modelName = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // توجيهات النظام (System Prompts)
    const prompts: Record<string, string> = {
  summarize: `
أنت معلم سعودي خبير.

لخص الدرس التالي في نقاط واضحة وسهلة الفهم للطلاب.

الدرس:
${text}
`,

  ask: `
أنت SBC AI، مساعد ذكي داخل منصة تعليمية.

أجب عن أي سؤال يكتبه المستخدم مهما كان موضوعه.

إذا كان السؤال تعليميًا فاشرحه بطريقة سهلة وواضحة.
إذا كان السؤال عامًا فأجب بدقة وبأسلوب احترافي.
إذا طُلب منك كتابة كود أو ترجمة أو حل مسألة أو كتابة مقال فقم بذلك.

السؤال:
${text}
`,

  generate_quiz: `
أنشئ 3 أسئلة اختيار من متعدد اعتمادًا على الدرس التالي.

الدرس:
${text}

أعد النتيجة بصيغة JSON فقط دون أي شرح.

[
  {
    "question":"...",
    "options":["أ","ب","ج","د"],
    "correctIndex":0
  }
]
`
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
  console.error("FULL API ERROR:", JSON.stringify(data, null, 2));

  return NextResponse.json(
    {
      status: response.status,
      googleResponse: data,
    },
    { status: 500 }
  );
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
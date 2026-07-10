import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, action } = await req.json();
    
    // الموديل الجديد المتاح في حسابك
    const modelName = "gemini-3-flash-preview"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    let finalPrompt = "";
    if (action === "summarize") {
      finalPrompt = `لخص الدرس التالي: (${text}) في نقاط رئيسية مركزة بأسلوب تعليمي.`;
    } else if (action === "ask") {
      finalPrompt = `أنت معلم ذكي، أجب على سؤال الطالب: "${text}" بأسلوب مبسط.`;
    } else if (action === "generate_quiz") {
      finalPrompt = `أنشئ 3 أسئلة اختيار من متعدد للدرس: (${text}). أجب بصيغة JSON فقط: [{"question": "...", "options": ["...", "..."], "correctIndex": 0}].`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }] }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("خطأ من جوجل:", JSON.stringify(data));
        return NextResponse.json({ error: "فشل الاتصال بالنموذج الجديد" }, { status: 500 });
    }

    let output = data.candidates[0].content.parts[0].text;
    if (action === "generate_quiz") output = output.replace(/```json|```/g, "").trim();

    return NextResponse.json({ result: output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
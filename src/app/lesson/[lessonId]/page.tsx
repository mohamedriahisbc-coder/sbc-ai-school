"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  // الرابط الأصلي للفيديو
  const defaultVideoUrl = "https://www.youtube.com/embed/yaV-qpVa_Uo";
  const [activeTab, setActiveTab] = useState("summary");

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const callAI = async (action: string, text: string) => {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, text }),
    });
    return await res.json();
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const data = await callAI("summarize", lessonId);
    setSummary(data.result || "عذراً، لم أتمكن من التلخيص.");
    setLoadingSummary(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    const currentInput = chatInput;
    setChatInput("");
    setLoadingChat(true);
    const data = await callAI("ask", currentInput);
    setChatMessages((prev) => [...prev, { role: "ai", text: data.result }]);
    setLoadingChat(false);
  };

  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    const data = await callAI("generate_quiz", lessonId);
    try {
      const cleanJson = data.result.replace(/```json|```/g, "").trim();
      setQuiz(JSON.parse(cleanJson));
    } catch {
      alert("فشل توليد الاختبار.");
    }
    setLoadingQuiz(false);
  };

  return (
    <main className="min-h-screen text-white relative" dir="rtl" style={{ backgroundImage: "url('/images/background.png')", backgroundSize: "cover" }}>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>
      
      {/* الهيدر مع زر الرئيسية */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center border-b border-white/5 pb-4">
        <a 
          href="/" 
          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
        >
          🏠 الرئيسية
        </a>
        <div className="flex gap-4 items-center">
          <h1 className="text-sm font-bold text-blue-400">{lessonId} :معرف الدرس</h1>
          <div className="text-xs font-bold text-blue-300 border-r border-white/10 pr-4">✨ المنظومة التعليمية للذكاء الاصطناعي</div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* القسم الأيمن (الفيديو) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <h3 className="text-sm font-bold mb-3 text-slate-300">📺 فيديو الشرح المعتمد للدرس</h3>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5">
              <iframe src={defaultVideoUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        </div>

        {/* القسم الأيسر (الذكاء الاصطناعي) */}
        <div className="lg:col-span-5">
           <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 min-h-[460px] flex flex-col">
            <div className="flex gap-2 border-b border-white/5 pb-3 mb-4">
              <button onClick={() => setActiveTab("summary")} className={`px-3 py-1 rounded-lg text-xs ${activeTab === "summary" ? "bg-blue-600" : "bg-white/5"}`}>📝 ملخص</button>
              <button onClick={() => setActiveTab("ai-ask")} className={`px-3 py-1 rounded-lg text-xs ${activeTab === "ai-ask" ? "bg-purple-600" : "bg-white/5"}`}>🤖 اسأل</button>
              <button onClick={() => setActiveTab("quizzes")} className={`px-3 py-1 rounded-lg text-xs ${activeTab === "quizzes" ? "bg-amber-600" : "bg-white/5"}`}>📊 اختبار</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {activeTab === "summary" && <button onClick={handleSummarize} className="w-full bg-blue-600 py-2 rounded text-xs">تحديث التلخيص</button>}
              {activeTab === "summary" && <p className="mt-4 text-xs">{loadingSummary ? "جاري..." : summary}</p>}
              
              {activeTab === "ai-ask" && (
                <div className="space-y-2">
                  {chatMessages.map((msg, i) => <p key={i} className="text-xs">{msg.text}</p>)}
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-black/40 p-2 rounded text-xs" placeholder="اسأل أي شيء عن الدرس..." />
                  <button onClick={handleSendMessage} className="w-full bg-purple-600 py-2 rounded text-xs">إرسال</button>
                </div>
              )}

              {activeTab === "quizzes" && (
                <div className="space-y-2">
                  <button onClick={handleGenerateQuiz} className="w-full bg-amber-600 py-2 rounded text-xs">توليد اختبار</button>
                  {quiz.map((q, i) => <p key={i} className="text-xs font-bold mt-2">{q.question}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
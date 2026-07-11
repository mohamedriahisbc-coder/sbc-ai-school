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
  const [summaryInput, setSummaryInput] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizInput, setQuizInput] = useState("");
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
  if (!summaryInput.trim()) return;

  setLoadingSummary(true);

  const data = await callAI("summarize", summaryInput);

  setSummary(data.result || "تعذر إنشاء الملخص.");

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
  if (!quizInput.trim()) return;

  setLoadingQuiz(true);

  const data = await callAI("generate_quiz", quizInput);

  setQuiz(data.quiz || []);

  setLoadingQuiz(false);
};

  return (
    <main className="min-h-screen text-white relative" dir="rtl" style={{ backgroundImage: "url('/images/background.png')", backgroundSize: "cover" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[0px]"></div>
      
      {/* الهيدر مع زر الرئيسية */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center border-b border-white/5 pb-4">
        <a 
  href="/" 
  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-base font-black transition-all border border-white/10 flex items-center gap-2"
>
  🏠 الرئيسية
</a>
        <div className="flex gap-4 items-center">
  {/* معرف الدرس باللون الأبيض */}
  <h1 className="text-lg font-black text-white drop-shadow-md">
    {lessonId} :معرف الدرس
  </h1>
  
  {/* المنظومة التعليمية باللون الأبيض */}
  <div className="text-base font-bold text-white border-r border-white/30 pr-4 drop-shadow-md">
    ✨ المنظومة التعليمية للذكاء الاصطناعي
  </div>
</div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* القسم الأيمن (الفيديو) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <h3 className="text-xl font-black mb-4 text-white drop-shadow-md">📺 فيديو الشرح المعتمد للدرس</h3>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5">
              <iframe src={defaultVideoUrl} className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
            </div>
          </div>
        </div>

        {/* القسم الأيسر (الذكاء الاصطناعي) */}
        <div className="lg:col-span-5">
           <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 min-h-[460px] flex flex-col">
            <div className="flex gap-2 border-b border-white/5 pb-3 mb-4">
              {/* زر ملخص */}
<button 
  onClick={() => setActiveTab("summary")} 
  className={`flex-1 px-6 py-4 rounded-2xl text-lg font-black transition-all duration-300 ${
    activeTab === "summary" 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]" 
      : "bg-white/5 text-white hover:bg-white/10"
  }`}
>
  📝 ملخص
</button>

{/* زر اسأل */}
<button 
  onClick={() => setActiveTab("ai-ask")} 
  className={`flex-1 px-6 py-4 rounded-2xl text-lg font-black transition-all duration-300 ${
    activeTab === "ai-ask" 
      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]" 
      : "bg-white/5 text-white hover:bg-white/10"
  }`}
>
  🤖 اسأل
</button>

{/* زر اختبار */}
<button 
  onClick={() => setActiveTab("quizzes")} 
  className={`flex-1 px-6 py-4 rounded-2xl text-lg font-black transition-all duration-300 ${
    activeTab === "quizzes" 
      ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30 scale-[1.02]" 
      : "bg-white/5 text-white hover:bg-white/10"
  }`}
>
  📊 اختبار
</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {activeTab === "summary" && (
  <div className="space-y-4">

    <input
      value={summaryInput}
      onChange={(e) => setSummaryInput(e.target.value)}
      placeholder="اكتب عنوان الدرس (مثال: الكسور، الطاقة، الخلايا...)"
      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-base outline-none focus:border-blue-500"
    />

    <button
      onClick={handleSummarize}
      className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-base font-bold"
    >
      📝 تلخيص الدرس
    </button>

    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 min-h-[260px] overflow-y-auto">
      {loadingSummary ? (
        <p className="text-base animate-pulse">
          🤖 يقوم الذكاء الاصطناعي بإنشاء الملخص...
        </p>
      ) : (
        <p className="text-base leading-8 whitespace-pre-wrap">
          {summary}
        </p>
      )}
    </div>

  </div>
)}
              
              {activeTab === "ai-ask" && (
  <div className="flex flex-col h-full">

    {/* الرسائل */}
    <div className="flex-1 space-y-4 overflow-y-auto max-h-[420px] mb-4 pr-2">

      {chatMessages.map((msg, i) => (
        <div
          key={i}
          className={`rounded-2xl px-4 py-3 text-base leading-8 ${
            msg.role === "user"
              ? "bg-blue-600 text-white ml-10"
              : "bg-slate-800 border border-white/10 mr-10"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {loadingChat && (
        <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 text-base mr-10 animate-pulse">
          🤖 SBC AI يكتب...
        </div>
      )}

    </div>

    {/* مربع الكتابة */}
    <input
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      placeholder="اكتب أي سؤال..."
      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-base outline-none focus:border-blue-500"
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSendMessage();
      }}
    />

    {/* زر الإرسال */}
    <button
      onClick={handleSendMessage}
      disabled={loadingChat}
      className="w-full mt-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 text-base font-bold disabled:opacity-50"
    >
      {loadingChat ? "جاري التفكير..." : "إرسال"}
    </button>

  </div>
)}

              {activeTab === "quizzes" && (
  <div className="space-y-3">

    <input
      value={quizInput}
      onChange={(e) => setQuizInput(e.target.value)}
      placeholder="اكتب عنوان الدرس (مثال: الكسور)"
      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-base"
    />

    <button
      onClick={handleGenerateQuiz}
      className="w-full bg-amber-600 py-3 rounded-xl text-base font-bold"
    >
      توليد اختبار
    </button>

    {quiz.map((q, i) => (
      <div
        key={i}
        className="bg-white/5 p-4 rounded-xl mt-3"
      >
        <p className="font-bold text-base mb-2">
          {i + 1}. {q.question}
        </p>

        {q.options?.map((op: string, index: number) => (
          <p key={index} className="text-base py-1">
            {op}
          </p>
        ))}
      </div>
    ))}

  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
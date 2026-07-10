export default function Grade1() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col items-center justify-center p-10">

      {/* الشخصية */}
      <div className="text-8xl mb-6">🦊</div>

      {/* العنوان */}
      <h1 className="text-4xl font-bold text-blue-700 mb-2">
        سامي الثعلب
      </h1>

      <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
        أنا هنا لأساعدك تتعلم بطريقة ممتعة وسهلة
      </p>

      {/* الأزرار التعليمية */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl shadow-lg">
          📌 لخص لي درس اليوم
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl shadow-lg">
          ❓ اسألني أسئلة
        </button>

        <button className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl shadow-lg">
          🧠 اختبرني
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl shadow-lg">
          ✏️ اشرح لي كأني طفل
        </button>

      </div>

    </main>
  );
}

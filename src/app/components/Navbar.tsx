"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 h-20">

          {/* Logo - تنسيق الكبسولة المربعة */}
          <div className="flex items-center gap-4">
            <div className="h-16 px-3 bg-[#000080] border-2 border-white/20 shadow-xl flex items-center justify-center rounded-2xl shrink-0">
              <img 
                src="/logo.png" 
                alt="SBC Logo" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">SBC AI School</h1>
              <p className="text-sm text-white/90">Smart Education Platform</p>
            </div>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-xl text-lg font-black text-white hover:bg-white/10 transition-all">
              🏠 الرئيسية
            </button>
            <button className="px-8 py-2.5 rounded-xl text-lg font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all">
              🔑 دخول
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
}
"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="backdrop-blur-md bg-white/20 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 h-20">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl shadow-lg">
              🎓
            </div>

            <div>

              <h1 className="text-2xl font-extrabold text-white">
                SBC AI School
              </h1>

              <p className="text-sm text-white/90">
                Smart Education Platform
              </p>

            </div>

          </div>

          {/* Menu */}

          <div className="flex items-center gap-8">

            <button className="text-white font-bold hover:text-blue-200 transition">
              الرئيسية
            </button>

            <button className="text-white font-bold hover:text-blue-200 transition">
              دخول
            </button>

          </div>

        </div>
      </nav>
    </header>
  );
}
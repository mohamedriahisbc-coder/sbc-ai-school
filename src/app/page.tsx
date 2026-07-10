"use client";

import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

// 1. مصفوفة البيانات المحلية المنظمة حسب الـ Schema
const localData = [
  {
    id: "primary",
    name: "المرحلة الابتدائية",
    tracks: [],
    grades: [
      {
        id: "grade-1",
        name: "الصف الأول الابتدائي",
        terms: [
          {
            id: "term-1",
            name: "الفصل الدراسي الأول",
            subjects: [
              {
                id: "sub-quran-1",
                name: "القرآن الكريم والدراسات الإسلامية",
                units: [
                  {
                    id: "unit-tawhid-1",
                    title: "التوحيد: معرفة الله عز وجل",
                    lessons: [
                      { id: "q1", title: "الدرس الأول: ما يجب على المسلم معرفته" },
                      { id: "q2", title: "الدرس الثاني: الله الخالق" },
                      { id: "q3", title: "الدرس الثالث: الله الرازق" }
                    ]
                  },
                  {
                    id: "unit-fiqh-1",
                    title: "الفقه والسلوك: تعظيم القرآن الكريم",
                    lessons: [
                      { id: "q4", title: "الدرس الأول: محبة القرآن الكريم والعناية به" }
                    ]
                  }
                ]
              },
              {
                id: "sub-lughati-1",
                name: "لغتي",
                units: [
                  {
                    id: "unit-family-1",
                    title: "الوحدة الأولى: أسرتي",
                    lessons: [
                      { id: "lug1", title: "الدرس الأول: حرف (م)" },
                      { id: "lug2", title: "الدرس الثاني: حرف (ب)" }
                    ]
                  }
                ]
              },
              {
                id: "sub-math-1",
                name: "الرياضيات",
                units: [
                  {
                    id: "unit-math-u1",
                    title: "الفصل 1: المقارنة والتصنيف",
                    lessons: [
                      { id: "m1", title: "1-1 التصنيف وفق خاصية واحدة" }
                    ]
                  }
                ]
              },
              {
                id: "sub-science-1",
                name: "العلوم",
                units: [
                  {
                    id: "unit-sci-u1",
                    title: "الفصل 1: النباتات من حولنا",
                    lessons: [
                      { id: "sci1", title: "الدرس الأول: مخلوقات حية" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: "term-2",
            name: "الفصل الدراسي الثاني",
            subjects: [
              {
                id: "sub-islamic-2",
                name: "الدراسات الإسلامية (العام)",
                units: [
                  {
                    id: "unit-tawhid-2",
                    title: "التوحيد - معرفة دين الإسلام",
                    lessons: [
                      { id: "is1", title: "الدرس الأول: Islam ديني" },
                      { id: "is2", title: "الدرس الثاني: أركان الإسلام" }
                    ]
                  }
                ]
              },
              {
                id: "sub-lughati-2",
                name: "لغتي",
                units: [
                  {
                    id: "unit-health-2",
                    title: "الوحدة الرابعة: صحتي وسلامتي",
                    lessons: [
                      { id: "lug3", title: "الدرس الأول: حرف (ص)" },
                      { id: "lug4", title: "الدرس الثاني: حرف (ض)" }
                    ]
                  }
                ]
              },
              {
                id: "sub-math-2",
                name: "الرياضيات",
                units: [
                  {
                    id: "unit-math-u7",
                    title: "الفصل 7: القيمة المنزلية",
                    lessons: [
                      { id: "m2", title: "7-1 الآحاد والعشرات" }
                    ]
                  }
                ]
              },
              {
                id: "sub-science-2",
                name: "العلوم",
                units: [
                  {
                    id: "unit-sci-u6",
                    title: "الفصل 6: الطقس والفصول",
                    lessons: [
                      { id: "sci2", title: "الدرس الأول: الطقس من حولنا" }
                    ]
                  }
                ]
              },
              {
                id: "sub-art-2",
                name: "التربية الفنية",
                units: [
                  {
                    id: "unit-art-u1",
                    title: "مجال الرسم",
                    lessons: [
                      { id: "art1", title: "الموضوع الأول: الألوان ممتعة" }
                    ]
                  }
                ]
              },
              {
                id: "sub-life-2",
                name: "المهارات الحياتية والأسرية",
                units: [
                  {
                    id: "unit-life-u1",
                    title: "الوحدة الأولى: صحتي وسلامتي",
                    lessons: [
                      { id: "life1", title: "الدرس الأول: نظافة الوجه" }
                    ]
                  }
                ]
              },
              {
                id: "sub-english-2",
                name: "اللغة الإنجليزية (We Can 1)",
                units: [
                  {
                    id: "unit-eng-u1",
                    title: "Unit 1: Toys and Things",
                    lessons: [
                      { id: "eng1", title: "Talk Time & Rhythms" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "intermediate",
    name: "المرحلة المتوسطة",
    tracks: [],
    grades: [
      {
        id: "grade-7",
        name: "الصف الأول المتوسط",
        terms: [{ id: "term-1-mid", name: "الفصل الدراسي الأول", subjects: [] }]
      },
      {
        id: "grade-8",
        name: "الصف الثاني المتوسط",
        terms: [{ id: "term-1-mid-2", name: "الفصل الدراسي الأول", subjects: [] }]
      }
    ]
  },
  {
    id: "secondary",
    name: "المرحلة الثانوية",
    tracks: [
      {
        id: "track-general",
        name: "المسار العام",
        grades: [
          {
            id: "grade-10-g",
            name: "الصف الأول الثانوي",
            terms: [{ id: "term-1-sec", name: "الفصل الدراسي الأول", subjects: [] }]
          }
        ]
      },
      {
        id: "track-cs",
        name: "مسار علوم الحاسب والهندسة",
        grades: [
          {
            id: "grade-10-cs",
            name: "الصف الأول الثانوي - حاسب",
            terms: [{ id: "term-1-cs", name: "الفصل الدراسي الأول", subjects: [] }]
          }
        ]
      }
    ]
  }
];

export default function Home() {
  const [stages, setStages] = useState<any[]>([]);
  const [stageId, setStageId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");

  const [tracks, setTracks] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    setStages(localData);
  }, []);

  const handleStage = (id: string) => {
    setStageId(id);
    setTrackId("");
    setGradeId("");
    setSemesterId("");
    setSubjectId("");
    setChapterId("");

    const stage = localData.find((s) => String(s.id) === id);
    const currentTracks = stage?.tracks || [];
    setTracks(currentTracks);
    
    let allGrades = [];
    if (currentTracks.length > 0) {
      allGrades = currentTracks.flatMap((track: any) => track.grades || []);
    } else {
      allGrades = stage?.grades || [];
    }

    setGrades(allGrades);
    setSemesters([]);
    setSubjects([]);
    setChapters([]);
    setLessons([]);

    setTimeout(() => {
      document.getElementById("grades-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleTrack = (tId: string) => {
    setTrackId(tId);
    const track = tracks.find((t) => String(t.id) === tId);
    setGrades(track?.grades || []);
    
    setGradeId("");
    setSemesterId("");
    setSubjectId("");
    setChapterId("");
    setSemesters([]);
    setSubjects([]);
    setChapters([]);
    setLessons([]);
  };

  const handleGrade = (id: string) => {
    setGradeId(id);
    setSemesterId("");
    setSubjectId("");
    setChapterId("");

    const grade = grades.find((g) => String(g.id) === id);
    setSemesters(grade?.terms || []);
    setSubjects([]);
    setChapters([]);
    setLessons([]);

    setTimeout(() => {
      document.getElementById("semesters-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSemester = (id: string) => {
    setSemesterId(id);
    setSubjectId("");
    setChapterId("");

    const semester = semesters.find((sem) => String(sem.id) === id);
    setSubjects(semester?.subjects || []);
    setChapters([]);
    setLessons([]);

    setTimeout(() => {
      document.getElementById("subjects-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubject = (id: string) => {
    setSubjectId(id);
    setChapterId("");

    const subject = subjects.find((s) => String(s.id) === id);
    setChapters(subject?.units || []);
    setLessons([]);

    setTimeout(() => {
      document.getElementById("content-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleChapter = (id: string) => {
    setChapterId(id);

    const chapter = chapters.find((c) => String(c.id) === id);
    setLessons(chapter?.lessons || []);

    setTimeout(() => {
      document.getElementById("lessons-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <main
      className="min-h-screen relative text-white selection:bg-blue-500/30"
      dir="rtl"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">
            منصة SBC AI School الذكية
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-xl mx-auto font-medium">
            اختر مسارك التعليمي الآن ودع الذكاء الاصطناعي يقودك نحو التفوق.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <span>🎯</span> المسار الدراسي الحالي:
            </h2>
            <div className="flex flex-wrap gap-2.5 bg-black/40 p-2 rounded-2xl border border-white/5 w-full lg:w-auto">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => handleStage(String(stage.id))}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-1.5 ${
                    stageId === String(stage.id)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>🎓</span> {stage.name}
                </button>
              ))}
            </div>
          </div>

          {tracks.length > 1 && (
            <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2 items-center animate-fadeIn">
              <span className="text-xs font-bold text-slate-400 mr-2">🔀 تصفية حسب المسار:</span>
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTrack(String(t.id))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    trackId === String(t.id) ? "bg-indigo-600 text-white" : "bg-black/20 hover:bg-white/5 text-white/80"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-4 order-1 lg:order-1">
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-white">الموجه الذكي لـ SBC</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs text-emerald-400 font-semibold">متصل وجاهز</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 mb-4">
                  "تصفح المواد والمسارات المعتمدة للتو في المملكة العربية السعودية بالذكاء الاصطناعي التفاعلي."
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 order-2 lg:order-2 space-y-8">
              
              {stageId ? (
                <div id="grades-anchor" className="animate-fadeIn scroll-mt-32">
                  <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> اختر الصف الدراسي:
                  </h3>
                  {grades && grades.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {grades.map((grade) => (
                        <button
                          key={grade.id}
                          onClick={() => handleGrade(String(grade.id))}
                          className={`p-4 rounded-xl border text-right text-sm font-bold transition-all duration-200 flex items-center justify-between group ${
                            gradeId === String(grade.id)
                              ? "bg-blue-600 border-blue-400 text-white shadow-md"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
                          }`}
                        >
                          <span>📘 {grade.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/40 border border-dashed border-white/10 rounded-xl bg-black/5 text-sm">
                      ⚠️ لم يتم العثور على صفوف لهذه المرحلة في قاعدة البيانات حالياً.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-white/40 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  📌 يرجى اختيار المرحلة الدراسية من الشريط العلوي للبدء
                </div>
              )}

              {gradeId && (
                <div id="semesters-anchor" className="animate-fadeIn pt-6 border-t border-white/5 scroll-mt-32">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> اختر الفصل الدراسي:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {semesters.map((sem) => (
                      <button
                        key={sem.id}
                        onClick={() => handleSemester(String(sem.id))}
                        className={`px-6 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 ${
                          semesterId === String(sem.id)
                            ? "bg-amber-500 border-amber-400 text-slate-950 shadow-md"
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
                        }`}
                      >
                        🗓️ {sem.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {semesterId && (
                <div id="subjects-anchor" className="animate-fadeIn pt-6 border-t border-white/5 scroll-mt-32">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span> المواد الدراسية المتاحة:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <button
                          key={subject.id}
                          onClick={() => handleSubject(String(subject.id))}
                          className={`p-4 rounded-xl border text-right text-sm font-bold transition-all duration-200 flex items-center justify-between group ${
                            subjectId === String(subject.id)
                              ? "bg-purple-600 border-purple-400 text-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
                          }`}
                        >
                          <span>📚 {subject.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full p-6 bg-white/5 rounded-xl text-center text-sm text-white/40">
                        قريباً.. جاري إدخال مواد هذا الفصل الدراسي 📝
                      </div>
                    )}
                  </div>
                </div>
              )}

              {subjectId && (
                <div id="content-anchor" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5 scroll-mt-32">
                  
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
                      📂 الوحدات والفصول:
                    </h3>
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => handleChapter(String(chapter.id))}
                          className={`w-full p-3.5 rounded-xl border text-right text-sm font-bold transition-all duration-200 block ${
                            chapterId === String(chapter.id)
                              ? "bg-orange-600 border-orange-400 text-white"
                              : "bg-white/5 border-white/10 hover:bg-white/5 text-white/90"
                          }`}
                        >
                          📁 {chapter.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div id="lessons-anchor" className="bg-black/20 p-4 rounded-2xl border border-white/5 scroll-mt-32">
                    <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
                      📖 الدروس المتاحة:
                    </h3>
                    {chapterId ? (
                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                        {lessons.length > 0 ? (
                          lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => (window.location.href = `/lesson/${lesson.id}`)}
                              className="w-full p-3.5 rounded-xl border border-white/10 bg-white text-slate-900 font-bold text-sm text-right hover:bg-blue-50 transition-all flex items-center justify-between shadow-sm"
                            >
                              <span>📖 {lesson.title}</span>
                              <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md font-medium">ابدأ الآن 🤖</span>
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/30 text-sm">
                            قريباً.. سيتم إضافة دروس هذه الوحدة ⏳
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-white/30 text-sm h-full flex items-center justify-center">
                        👈 اختر الوحدة أو الفصل لعرض دروسه
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
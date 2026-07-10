"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { id } = await params;

      const res = await fetch(`/api/grades/${id}`);
      const grade = await res.json();

      setSubjects(grade.subjects || []);
    }

    load();
  }, [params]);

  return (
    <main style={{ padding: 40 }}>
      <h1>اختر المادة</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => router.push(`/subject/${subject.id}`)}
            style={{
              padding: 25,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            {subject.name}
          </button>
        ))}
      </div>
    </main>
  );
}
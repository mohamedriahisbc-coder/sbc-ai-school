"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GradesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [grades, setGrades] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { id } = await params;

      const res = await fetch(`/api/stages/${id}`);
      const stage = await res.json();

      setGrades(stage.grades || []);
    }

    load();
  }, [params]);

  return (
    <main style={{ padding: 40 }}>
      <h1>اختر الصف الدراسي</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        {grades.map((grade) => (
          <button
            key={grade.id}
            onClick={() => router.push(`/grade/${grade.id}`)}
            style={{
              padding: 25,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            {grade.name}
          </button>
        ))}
      </div>
    </main>
  );
}
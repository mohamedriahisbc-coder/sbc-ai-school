"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChooseStage() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/stages")
      .then((res) => res.json())
      .then((data) => {
        setStages(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>جاري تحميل المراحل...</h2>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>اختر المرحلة الدراسية</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => router.push(`/choose-stage/${stage.id}`)}
            style={{
              padding: 30,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            {stage.name}
          </button>
        ))}
      </div>
    </main>
  );
}
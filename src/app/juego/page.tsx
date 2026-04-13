"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Starfield from "@/components/Starfield";
import TableroJuego from "@/components/TableroJuego";

function JuegoContent() {
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<"basico" | "avanzado">(
    (searchParams.get("level") as "basico" | "avanzado") || "basico"
  );

  return (
    <main className="relative min-h-screen bg-cosmic-bg">
      <Starfield />
      <TableroJuego level={level} onLevelChange={setLevel} />
    </main>
  );
}

export default function JuegoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cosmic-bg flex items-center justify-center">
          <div className="text-white/60 text-lg">Cargando el cosmos...</div>
        </div>
      }
    >
      <JuegoContent />
    </Suspense>
  );
}

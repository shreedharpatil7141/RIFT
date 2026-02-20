"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  const [results, setResults] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  /* ================= AUTH ================= */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth");
    if (isLoggedIn !== "true") {
      router.replace("/login");
    }
  }, [router]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("analysisResult");
      if (stored) {
        const parsed = JSON.parse(stored);

        if (parsed.results && Array.isArray(parsed.results)) {
          setResults(parsed.results);
        } else {
          setResults([parsed]);
        }
      }
    } catch {
      setResults([]);
    } finally {
      setMounted(true);
    }
  }, []);

  /* ================= MOUSE GLOW ================= */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted || results.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0F303C] text-white">
        Loading analysis result...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F303C] text-slate-200 print:bg-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F303C] via-[#0C2630] to-[#091E25]" />
        <div
          className="absolute w-[500px] h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none transition-all duration-200"
          style={{
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-12">

        <h1 className="text-2xl font-bold text-white">
          Results View
        </h1>

        {results.map((result, index) => {

          const confidence = Math.round(
            (result.risk_assessment?.confidence_score || 0) * 100
          );

          const severity =
            result.risk_assessment?.severity?.toLowerCase();

          let riskStyles = "bg-gray-800 border-gray-600 text-gray-400";
          let ringColor = "#64748b";

          if (severity === "low") {
            riskStyles = "bg-green-900/30 border-green-500 text-green-400";
            ringColor = "#22c55e";
          } else if (severity === "moderate") {
            riskStyles = "bg-yellow-900/30 border-yellow-500 text-yellow-400";
            ringColor = "#eab308";
          } else if (severity === "high") {
            riskStyles = "bg-orange-900/30 border-orange-500 text-orange-400";
            ringColor = "#f97316";
          } else if (severity === "critical") {
            riskStyles = "bg-red-900/30 border-red-500 text-red-400";
            ringColor = "#ef4444";
          }

          const copyJson = async () => {
            await navigator.clipboard.writeText(
              JSON.stringify(result, null, 2)
            );
            alert("JSON copied!");
          };

          const downloadJson = () => {
            const blob = new Blob(
              [JSON.stringify(result, null, 2)],
              { type: "application/json" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pharmaguard_${result.drug}.json`;
            a.click();
            URL.revokeObjectURL(url);
          };

          return (
            <div key={index} className="space-y-8 border-b border-slate-700 pb-10">

              {/* DRUG TITLE */}
              <h2 className="text-xl font-bold text-teal-300">
                {result.drug}
              </h2>

              {/* RISK SECTION */}
              <div className="bg-[#0C2630]/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                <div className={`md:col-span-2 rounded-lg p-6 border ${riskStyles}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Risk Status
                  </p>

                  <h2 className="text-4xl font-extrabold mt-2">
                    {result.risk_assessment?.risk_label?.toUpperCase()}
                  </h2>

                  <p className="text-sm mt-4 leading-relaxed">
                    {result.clinical_recommendation?.recommendation}
                  </p>
                </div>

                {/* Confidence Ring */}
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke={ringColor}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={339}
                        strokeDashoffset={339 - (339 * confidence) / 100}
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {confidence}%
                      </span>
                      <span className="text-xs text-slate-400">
                        Confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROFILE + RECOMMENDATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-[#0C2630]/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl p-6 space-y-6">
                  <h3 className="font-bold text-white text-lg">
                    Pharmacogenomic Profile
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#091E25] p-4 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase">Gene</p>
                      <p className="text-teal-300 font-bold text-lg mt-1">
                        {result.pharmacogenomic_profile?.primary_gene}
                      </p>
                    </div>

                    <div className="bg-[#091E25] p-4 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase">Diplotype</p>
                      <p className="text-white font-extrabold text-xl mt-1">
                        {result.pharmacogenomic_profile?.diplotype}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#091E25] p-4 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase">Phenotype</p>
                    <p className="text-white font-semibold mt-1">
                      {result.pharmacogenomic_profile?.phenotype}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0C2630]/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-lg">
                    Clinical Recommendations (CPIC)
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-300">
                    <li>{result.clinical_recommendation?.recommendation}</li>
                  </ul>
                </div>

                <div className="bg-teal-900/30 border border-teal-400 rounded-xl p-6 lg:col-span-2">
                  <h3 className="font-bold text-teal-300 mb-2">
                    AI Clinical Explanation
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {result.llm_generated_explanation?.summary}
                  </p>
                </div>
              </div>

              {/* JSON SECTION */}
              <div className="bg-[#091E25] rounded-xl p-6 text-white border border-slate-700 shadow-xl">

                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Structured JSON Output
                  </h3>

                  <div className="flex gap-3">
                    <button
                      onClick={copyJson}
                      className="px-3 py-1 text-xs bg-slate-700 rounded-md hover:bg-slate-600 transition"
                    >
                      Copy
                    </button>

                    <button
                      onClick={downloadJson}
                      className="px-3 py-1 text-xs bg-teal-500 rounded-md hover:bg-teal-600 transition"
                    >
                      Download
                    </button>
                  </div>
                </div>

                <pre className="text-xs overflow-x-auto text-green-400">
                  {JSON.stringify(result, null, 2)}
                </pre>

              </div>

            </div>
          );
        })}

      </div>
    </main>
  );
}
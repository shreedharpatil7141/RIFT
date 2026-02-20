"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [drugs, setDrugs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  /* ================= AUTH CHECK ================= */
   useEffect(() => {
  const isLoggedIn = localStorage.getItem("auth");

  if (isLoggedIn !== "true") {
    router.replace("/login");
  }
}, [router]);

  /* ================= MOUSE GLOW ================= */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //if (!mounted) return null;

  /* ================= DRUG FUNCTIONS ================= */
  const addDrug = (value: string) => {
    if (!value.trim()) return;
    if (drugs.includes(value.toUpperCase())) return;
    setDrugs([...drugs, value.toUpperCase()]);
    setInputValue("");
  };

  const removeDrug = (value: string) => {
    setDrugs(drugs.filter((d) => d !== value));
  };

  /* ================= HANDLE ANALYZE FUNCTION ================= */
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a VCF file.");
      return;
    }

    if (drugs.length === 0) {
      alert("Please add at least one drug.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    drugs.forEach((drug) => {
       formData.append("drugs", drug);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("drug", JSON.stringify(drugs));

      router.push("/results");

    } catch (error) {
      console.error(error);
      alert("Something went wrong during analysis.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F303C] text-slate-200">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F303C] via-[#0C2630] to-[#091E25]" />

      <div
        className="absolute w-[500px] h-[500px] bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none transition-all duration-200 -z-10"
        style={{
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />

      {/* ================= NAVBAR ================= */}
      <header className="bg-[#0C2630]/80 backdrop-blur-md border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-md text-white text-sm font-bold">
              PG
            </div>
            <span className="font-bold text-teal-300">PharmaGuard</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-slate-400">
            <span className="text-teal-300 border-b-2 border-teal-300 pb-1">
              Dashboard
            </span>
            <span
              onClick={() => router.push("/guidelines")}
              className="hover:text-teal-300 cursor-pointer"
            >
              Guidelines
            </span>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-gradient-to-r from-[#0C2630] to-[#123D4A] rounded-xl shadow-xl text-center py-12 px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Precision Pharmacogenomic Analysis
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Upload genetic data to identify variants that impact drug metabolism.
            Prevent adverse drug reactions and optimize patient dosage with evidence-based insights.
          </p>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1 */}
          <div className="bg-[#0C2630]/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 text-white text-sm font-bold">
                1
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                Upload Patient VCF File
              </h2>
            </div>

            <div
              onClick={() => document.getElementById("vcfInput")?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-teal-400 hover:bg-[#123D4A]/40 transition"
            >
              <p className="font-semibold text-slate-200 mb-1">
                {file ? file.name : "Drag and drop your file here"}
              </p>
              <p className="text-sm text-slate-400 mb-4">
                Supported format: .vcf (Max 5MB)
              </p>
              <button className="px-5 py-2 bg-teal-500 text-white rounded-md text-sm font-semibold">
                Browse Files
              </button>
            </div>

            <input
  id="vcfInput"
  type="file"
  accept=".vcf"
  className="hidden"
  onChange={(e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const selectedFile = e.target.files[0];

    // ✅ Strict extension check
    if (!selectedFile.name.toLowerCase().endsWith(".vcf")) {
      alert("Only .vcf files are allowed.");
      e.target.value = ""; // Reset input
      setFile(null);
      return;
    }

    // ✅ Optional size check (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }}
/>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#0C2630]/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 text-white text-sm font-bold">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                Select Drugs for Screening
              </h2>
            </div>

            <label className="block text-sm font-medium text-slate-400 mb-2">
              Target Medications
            </label>

            <div className="flex flex-wrap items-center gap-2 p-3 border border-slate-600 rounded-lg bg-[#091E25] min-h-[50px]">
              {drugs.map((drug) => (
                <span
                  key={drug}
                  className="flex items-center gap-2 px-3 py-1 bg-teal-900 text-teal-300 rounded-full text-sm font-medium"
                >
                  {drug}
                  <button onClick={() => removeDrug(drug)}>×</button>
                </span>
              ))}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDrug(inputValue);
                  }
                }}
                placeholder="Add drugs..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-300 placeholder-slate-500"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Suggested for VCF Screening:
              </p>

              <div className="flex flex-wrap gap-2">
                {["CODEINE","WARFARIN","CLOPIDOGREL","SIMVASTATIN","AZATHIOPRINE","FLUOROURACIL"].map((item) => (
                  <button
                    key={item}
                    onClick={() => addDrug(item)}
                    className="px-3 py-1 text-xs border border-slate-600 rounded-md text-slate-400 hover:border-teal-400 hover:text-teal-300 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={handleAnalyze}
              className="px-10 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold"
            >
              Run Precision Analysis
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Average processing time: 45–60 seconds
            </p>
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">

          <div className="bg-[#0C2630]/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Resources
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="https://cpicpgx.org/guidelines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300"
                >
                  CPIC Clinical Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://samtools.github.io/hts-specs/VCFv4.2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300"
                >
                  .VCF v4.2 Format
                </a>
              </li>
            </ul>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/logo.png"
              alt="PharmaGuard Logo"
              className="w-72 opacity-40 mix-blend-lighten drop-shadow-2xl"
            />
          </div>

        </div>

      </div>

      <footer className="border-t border-slate-700 py-6 text-center text-xs text-slate-500">
        © 2026 PharmaGuard Analytics Inc.
      </footer>

    </main>
  );
}
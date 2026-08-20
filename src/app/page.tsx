"use client";

import { ChangeEvent, useRef, useState } from "react";

const SIZE = 1080;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const generateFrame = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bg.addColorStop(0, "#08110d");
    bg.addColorStop(0.5, "#10291d");
    bg.addColorStop(1, "#05100b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    const glow = ctx.createRadialGradient(540, 486, 100, 540, 486, 650);
    glow.addColorStop(0, "rgba(255,196,61,0.16)");
    glow.addColorStop(1, "rgba(255,196,61,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SIZE, SIZE);

    const photoX = 110;
    const photoY = 110;
    const photoSize = 860;
    const radius = 70;

    ctx.save();
    roundedRect(ctx, photoX, photoY, photoSize, photoSize, radius);
    ctx.clip();
    const scale = Math.max(photoSize / image.width, photoSize / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    ctx.drawImage(image, photoX + (photoSize - drawWidth) / 2, photoY + (photoSize - drawHeight) / 2, drawWidth, drawHeight);
    ctx.restore();

    ctx.lineWidth = 22;
    ctx.strokeStyle = "#f5c64b";
    roundedRect(ctx, 55, 55, SIZE - 110, SIZE - 110, 92);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    roundedRect(ctx, 78, 78, SIZE - 156, SIZE - 156, 75);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 48px Arial";
    ctx.fillText("HH GOA 2026", SIZE / 2, 48);

    ctx.fillStyle = "#f5c64b";
    roundedRect(ctx, 285, 932, 510, 82, 41);
    ctx.fill();
    ctx.fillStyle = "#07110c";
    ctx.font = "900 34px Arial";
    ctx.fillText("FRAME IN GOA", SIZE / 2, 985);

    [[105, 108], [975, 108], [105, 972], [975, 972]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#f5c64b";
      ctx.fill();
    });

    setResult(canvas.toDataURL("image/png", 1));
  };

  const processFile = (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) return setError("Please upload an image.");
    if (file.size > 20 * 1024 * 1024) return setError("Image must be smaller than 20MB.");
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
    const image = new Image();
    image.onload = () => { generateFrame(image); URL.revokeObjectURL(url); };
    image.onerror = () => { setError("Couldn't read this image. Try another JPG or PNG."); URL.revokeObjectURL(url); };
    image.src = url;
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "hh-goa-2026-frame.png";
    link.click();
  };

  const shareToX = () => {
    if (!result) return;
    downloadImage();
    const text = "Just framed my profile for HH Goa 2026 🌴✨ #FrameInGoa";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen bg-[#06100b] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5c64b]">HH Goa</p><h1 className="mt-1 text-xl font-black">Frame 2026</h1></div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60">#FrameInGoa</div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#f5c64b]/20 bg-[#f5c64b]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f5c64b]">Your profile. Goa ready.</div>
            <h2 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl">Put your face<br /><span className="text-[#f5c64b]">in the frame.</span></h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg">Upload your photo and instantly create your HH Goa 2026 profile picture. No account. No signup. Just frame it.</p>

            {!result ? <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`mt-9 cursor-pointer rounded-3xl border border-dashed p-8 transition ${dragging ? "border-[#f5c64b] bg-[#f5c64b]/10" : "border-white/15 bg-white/[0.035] hover:border-white/30 hover:bg-white/[0.06]"}`}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif" onChange={handleFile} className="hidden" />
              <div className="flex flex-col items-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5c64b] text-2xl text-black">↑</div><p className="font-bold">Drop your photo here</p><p className="mt-2 text-sm text-white/40">or tap to choose from your phone</p><p className="mt-5 text-xs text-white/25">JPG · PNG · HEIC · up to 20MB</p></div>
            </div> : <div className="mt-9 flex flex-wrap gap-3"><button onClick={downloadImage} className="rounded-full bg-[#f5c64b] px-7 py-4 text-sm font-black text-black">Download PNG</button><button onClick={shareToX} className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold">Share to X ↗</button><button onClick={reset} className="rounded-full px-5 py-4 text-sm font-semibold text-white/45 hover:text-white">Try another</button></div>}
            {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}
          </div>

          <div className="relative mx-auto w-full max-w-[480px]"><div className="absolute -inset-8 rounded-full bg-[#f5c64b]/10 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl">
            {result ? <img src={result} alt="Generated HH Goa 2026 profile frame" className="aspect-square w-full rounded-[1.5rem] object-cover" /> : preview ? <div className="relative aspect-square overflow-hidden rounded-[1.5rem]"><img src={preview} alt="Uploaded photo" className="h-full w-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/35"><div className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">Generating…</div></div></div> : <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#183b28] to-[#07120c]"><div className="text-center"><div className="text-7xl">🌴</div><p className="mt-5 text-sm font-bold text-white/40">Your frame will appear here</p></div></div>}
          </div></div>
        </section>
        <footer className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between"><span>HH Goa 2026 · Frame generator</span><span>Built for builders.</span></footer>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

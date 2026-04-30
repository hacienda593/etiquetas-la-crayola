"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { TEMPLATES } from "@/components/templates";
import { Search, Printer, Check, Clock, Loader2, PenLine } from "lucide-react";

type Pedido = {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  unidad_educativa: string;
  grado: string;
  genero: string;
  template_id: string;
  telefono_padre: string;
  cantidad: number;
  lapices_hojas: number;
  estado: string;
  created_at: string;
};

// Genera una página 50×25mm con etiquetas de lápiz:
// 5 franjas horizontales (texto horizontal, sin negritas) +
// 1 franja vertical a la derecha (2 líneas rotadas) — igual al modelo Excel
function generarPaginaLapiz(nombre: string, apellido: string, grado: string): string {
  const p1 = nombre.split(" ")[0].toUpperCase();
  const p2 = apellido.split(" ")[0].toUpperCase();
  const texto = `${p1} ${p2}`;
  // Grado abreviado: máx 12 chars para que quepa en la franja
  const gradoTx = grado.toUpperCase().slice(0, 14);

  const MAIN_W  = 330;
  const SIDE_W  = 70;
  const STRIP_H = 40;  // 200 / 5

  // Fuente combinada: si el texto+grado cabe en 1 línea, lo ponemos junto
  const lineaCombinada = `${texto}  ${gradoTx}`;
  const fzC = lineaCombinada.length > 22 ? 13
            : lineaCombinada.length > 18 ? 15
            : lineaCombinada.length > 14 ? 17
            : 19;

  // 5 franjas horizontales — nombre y grado en una sola línea
  const franjas = Array.from({ length: 5 }, (_, i) => {
    const y  = i * STRIP_H;
    const cy = y + STRIP_H / 2;
    return `
      ${i > 0 ? `<line x1="0" y1="${y}" x2="${MAIN_W}" y2="${y}" stroke="black" stroke-width="0.7" stroke-dasharray="5 3"/>` : ""}
      <text x="${MAIN_W / 2}" y="${cy}"
        font-family="Arial, sans-serif"
        fill="black" text-anchor="middle" dominant-baseline="middle">
        <tspan font-size="${fzC}" font-weight="700">${texto}</tspan><tspan font-size="${fzC - 3}" font-weight="400" fill="#444">  ${gradoTx}</tspan>
      </text>`;
  }).join("");

  // Separador vertical
  const sep = `<line x1="${MAIN_W}" y1="0" x2="${MAIN_W}" y2="200" stroke="black" stroke-width="0.7" stroke-dasharray="5 3"/>`;

  // Franja vertical derecha — nombre + grado rotados -90°
  const cx  = MAIN_W + SIDE_W / 2;
  const fzV = Math.max(p1.length, p2.length) > 9 ? 12 : 14;
  const vertical = `
    <text x="${cx}" y="52"
      font-size="${fzV}" font-weight="700" font-family="Arial, sans-serif"
      fill="black" text-anchor="middle" dominant-baseline="middle"
      transform="rotate(-90 ${cx} 52)">${p1}</text>
    <text x="${cx}" y="104"
      font-size="${fzV}" font-weight="700" font-family="Arial, sans-serif"
      fill="black" text-anchor="middle" dominant-baseline="middle"
      transform="rotate(-90 ${cx} 104)">${p2}</text>
    <text x="${cx}" y="158"
      font-size="10" font-weight="400" font-family="Arial, sans-serif"
      fill="#333" text-anchor="middle" dominant-baseline="middle"
      transform="rotate(-90 ${cx} 158)">${gradoTx}</text>`;

  return `<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" fill="white"/>
    ${franjas}
    ${sep}
    ${vertical}
  </svg>`;
}

export default function CajeroPage() {
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [imprimiendo, setImprimiendo] = useState(false);
  const [imprimiendoLapices, setImprimiendoLapices] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cantidadEdit, setCantidadEdit] = useState<number | null>(null);
  const [lapicesEdit, setLapicesEdit] = useState<number | null>(null);

  const template = pedido ? TEMPLATES.find(t => t.id === pedido.template_id) : null;

  async function buscarPedido() {
    if (!codigo.trim()) return;
    setBuscando(true);
    setError("");
    setPedido(null);
    setExito(false);

    const { data, error: err } = await supabase
      .from("etiquetas_pedidos")
      .select("*")
      .eq("codigo", codigo.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (err || !data) {
      setError(`Código ${codigo} no encontrado.`);
    } else {
      setPedido(data as Pedido);
    }
    setBuscando(false);
  }

  async function imprimir() {
    if (!pedido || !template) return;
    setImprimiendo(true);

    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) { setImprimiendo(false); return; }

    const Comp = template.componente;
    const datos = {
      nombre:   pedido.nombre,
      apellido: pedido.apellido,
      unidad:   pedido.unidad_educativa,
      grado:    pedido.grado,
      whatsapp: pedido.telefono_padre || "593999999999",
    };

    const { renderToStaticMarkup } = await import("react-dom/server");
    const svgString = renderToStaticMarkup(<Comp {...datos}/>);

    const paginas = Array.from({ length: cantidadFinal }, () =>
      `<div class="pag">${svgString}</div>`
    ).join("");

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: 50mm 25mm; margin: 0; }
  html, body { width: 50mm; height: 25mm; background: white; }
  .pag { width: 50mm; height: 25mm; overflow: hidden; page-break-after: always; }
  svg { width: 50mm !important; height: 25mm !important; display: block; }
</style></head><body>
${paginas}
<script>window.onload = () => { window.print(); window.close(); }<\/script>
</body></html>`);
    win.document.close();

    await supabase.from("etiquetas_pedidos").update({ estado: "impreso" }).eq("id", pedido.id);
    setPedido(prev => prev ? { ...prev, estado: "impreso" } : prev);
    setExito(true);
    setImprimiendo(false);
  }

  async function imprimirLapices() {
    if (!pedido) return;
    setImprimiendoLapices(true);

    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) { setImprimiendoLapices(false); return; }

    const svgLapiz = generarPaginaLapiz(pedido.nombre, pedido.apellido, pedido.grado);
    const paginas = Array.from({ length: lapicesFinal || 1 }, () =>
      `<div class="pag">${svgLapiz}</div>`
    ).join("");

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: 50mm 25mm; margin: 0; }
  html, body { width: 50mm; height: 25mm; background: white; }
  .pag { width: 50mm; height: 25mm; overflow: hidden; page-break-after: always; }
  svg { width: 50mm !important; height: 25mm !important; display: block; }
</style></head><body>
${paginas}
<script>window.onload = () => { window.print(); window.close(); }<\/script>
</body></html>`);
    win.document.close();
    setImprimiendoLapices(false);
  }

  // Cantidades efectivas: usa el valor editado por el cajero o el del pedido
  const cantidadFinal = cantidadEdit ?? pedido?.cantidad ?? 1;
  const lapicesFinal  = lapicesEdit  ?? pedido?.lapices_hojas ?? 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <header className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center">
          <Printer size={18} className="text-black"/>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 leading-none">La Crayola</p>
          <p className="text-sm font-black uppercase tracking-tight leading-none">Panel del Cajero</p>
        </div>
      </header>

      <div className="max-w-sm mx-auto space-y-6">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Código del cliente</label>
          <div className="flex gap-2">
            <input
              value={codigo}
              onChange={e => setCodigo(e.target.value.replace(/\D/g,"").slice(0,4))}
              onKeyDown={e => e.key === "Enter" && buscarPedido()}
              placeholder="0000"
              maxLength={4}
              className="flex-1 bg-zinc-900 border-2 border-zinc-700 rounded-xl px-4 py-3 text-3xl font-black text-center tracking-widest outline-none focus:border-yellow-400 transition-colors"
            />
            <button onClick={buscarPedido} disabled={buscando || codigo.length < 4}
              className="bg-yellow-400 text-black px-5 rounded-xl font-black disabled:opacity-40 flex items-center gap-2">
              {buscando ? <Loader2 size={18} className="animate-spin"/> : <Search size={18}/>}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs font-bold mt-2">{error}</p>}
        </div>

        {pedido && template && (
          <div className="space-y-4">
            {/* Estado */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider
              ${pedido.estado === "impreso" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"}`}>
              {pedido.estado === "impreso" ? <Check size={14}/> : <Clock size={14}/>}
              {pedido.estado === "impreso" ? "Ya fue impreso" : "Pendiente de impresión"}
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <template.componente
                nombre={pedido.nombre}
                apellido={pedido.apellido}
                unidad={pedido.unidad_educativa}
                grado={pedido.grado}
                whatsapp={pedido.telefono_padre || "593999999999"}
              />
            </div>

            {/* Datos */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
              {[
                ["Nombre",      `${pedido.nombre} ${pedido.apellido}`],
                ["Institución", pedido.unidad_educativa],
                ["Grado",       pedido.grado],
                ["Modelo",      template.nombre],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{k}</span>
                  <span className="text-xs font-bold text-white">{v}</span>
                </div>
              ))}
            </div>

            {/* Ajuste de cantidades por el cajero */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 space-y-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ajustar cantidades</p>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">
                  Etiquetas escolares
                  {cantidadEdit !== null && <span className="ml-2 text-yellow-400 normal-case font-normal">modificado</span>}
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCantidadEdit(Math.max(1, cantidadFinal - 1))}
                    className="w-10 h-10 bg-zinc-800 rounded-xl font-black text-lg flex items-center justify-center hover:bg-zinc-700">−</button>
                  <span className="flex-1 text-center text-2xl font-black">{cantidadFinal}</span>
                  <button onClick={() => setCantidadEdit(cantidadFinal + 1)}
                    className="w-10 h-10 bg-zinc-800 rounded-xl font-black text-lg flex items-center justify-center hover:bg-zinc-700">+</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">
                  Hojas de lápices <span className="text-zinc-600 normal-case font-normal">(6 etiq. c/u)</span>
                  {lapicesEdit !== null && <span className="ml-2 text-yellow-400 normal-case font-normal">modificado</span>}
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLapicesEdit(Math.max(0, lapicesFinal - 1))}
                    className="w-10 h-10 bg-zinc-800 rounded-xl font-black text-lg flex items-center justify-center hover:bg-zinc-700">−</button>
                  <span className="flex-1 text-center text-2xl font-black">
                    {lapicesFinal === 0 ? <span className="text-zinc-500 text-sm">Ninguna</span> : lapicesFinal}
                  </span>
                  <button onClick={() => setLapicesEdit(lapicesFinal + 1)}
                    className="w-10 h-10 bg-zinc-800 rounded-xl font-black text-lg flex items-center justify-center hover:bg-zinc-700">+</button>
                </div>
                {lapicesFinal > 0 && (
                  <p className="text-[10px] text-zinc-500 font-bold mt-1 text-center">{lapicesFinal * 6} etiquetas de lápiz</p>
                )}
              </div>
            </div>

            {exito && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-xs font-bold text-center uppercase tracking-wider">
                ✓ Impresión enviada correctamente
              </div>
            )}

            {/* Botón etiquetas escolares */}
            <button onClick={imprimir} disabled={imprimiendo}
              className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 border-2 border-yellow-500 shadow-[4px_4px_0px_rgba(255,215,0,0.3)]">
              {imprimiendo ? <Loader2 size={18} className="animate-spin"/> : <Printer size={18}/>}
              {imprimiendo ? "Preparando..." : `Imprimir ${cantidadFinal} etiqueta${cantidadFinal !== 1 ? "s" : ""}`}
            </button>

            {/* Botón etiquetas de lápices */}
            {lapicesFinal > 0 && (
              <button onClick={imprimirLapices} disabled={imprimiendoLapices}
                className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 border-2 border-zinc-600">
                {imprimiendoLapices ? <Loader2 size={18} className="animate-spin"/> : <PenLine size={18}/>}
                {imprimiendoLapices ? "Preparando..." : `Imprimir ${lapicesFinal * 6} etiquetas de lápiz`}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

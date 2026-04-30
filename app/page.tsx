"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, UNIDADES_EDUCATIVAS_DEFAULT } from "@/lib/supabase";
import { TEMPLATES, CATEGORIAS, type TemplateData } from "@/components/templates";
import { ChevronRight, ChevronLeft, Printer, Plus, Check } from "lucide-react";

type Step = 1 | 2 | 3;
type Categoria = "nino" | "nina" | "joven_hombre" | "joven_mujer";

const CANTIDADES = [1, 3, 6, 9, 12];

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [unidad, setUnidad] = useState("");
  const [unidadNueva, setUnidadNueva] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [grado, setGrado] = useState("");
  const [telefonoPadre, setTelefonoPadre] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [templateId, setTemplateId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [lapicesHojas, setLapicesHojas] = useState(0);

  const unidadFinal = mostrarNueva ? unidadNueva : unidad;
  const templatesFiltrados = TEMPLATES.filter(t => t.categoria === categoria);
  const templateSeleccionado = TEMPLATES.find(t => t.id === templateId);

  const telefonoWA = "593" + telefonoPadre.replace(/\D/g,"").replace(/^0/,"");

  const datosEtiqueta: TemplateData = {
    nombre:   nombre   || "CARLOS",
    apellido: apellido || "PEREZ",
    unidad:   unidadFinal || "UNIDAD EDUCATIVA",
    grado:    grado    || "1RO BÁSICO",
    whatsapp: telefonoWA || "593999999999",
  };

  const telLimpio = telefonoPadre.replace(/\D/g,"");
  const paso1Valido = nombre.trim() && apellido.trim() && unidadFinal.trim() && grado.trim() && categoria && telLimpio.length === 10;
  const paso2Valido = templateId !== "";

  async function guardarPedido() {
    setLoading(true);
    setError("");
    const codigo = generarCodigo();

    const { error: err } = await supabase.from("etiquetas_pedidos").insert({
      codigo,
      nombre:           nombre.trim(),
      apellido:         apellido.trim(),
      unidad_educativa: unidadFinal.trim(),
      grado:            grado.trim(),
      genero:           categoria,
      template_id:      templateId,
      telefono_padre:   telefonoWA,
      cantidad,
      lapices_hojas:    lapicesHojas,
      estado:           "pendiente",
    });

    if (err) { setError("Error al guardar. Intente nuevamente."); setLoading(false); return; }
    router.push(`/confirmacion/${codigo}`);
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-black text-white px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center">
          <Printer size={18} className="text-black" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 leading-none">La Crayola</p>
          <p className="text-sm font-black uppercase tracking-tight leading-none">Etiquetas Escolares</p>
        </div>
      </header>

      {/* Steps indicator */}
      <div className="bg-zinc-100 px-5 py-3 flex items-center gap-2">
        {([1,2,3] as Step[]).map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors
              ${step >= s ? "bg-black text-white" : "bg-zinc-300 text-zinc-500"}`}>
              {step > s ? <Check size={12}/> : s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step >= s ? "text-black" : "text-zinc-400"}`}>
              {s === 1 ? "Datos" : s === 2 ? "Modelo" : "Confirmar"}
            </span>
            {s < 3 && <ChevronRight size={12} className="text-zinc-400"/>}
          </div>
        ))}
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto">

        {/* PASO 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Datos del estudiante</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Llena los datos tal como irán en la etiqueta</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Nombre</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Carlos" maxLength={20}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-base font-black text-black outline-none focus:ring-4 focus:ring-yellow-200 uppercase placeholder:text-zinc-400 placeholder:normal-case placeholder:font-normal"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Apellido</label>
                <input value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Pérez" maxLength={20}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-base font-black text-black outline-none focus:ring-4 focus:ring-yellow-200 uppercase placeholder:text-zinc-400 placeholder:normal-case placeholder:font-normal"/>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Unidad educativa</label>
              {!mostrarNueva ? (
                <div className="space-y-2">
                  <select value={unidad} onChange={e => setUnidad(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:ring-4 focus:ring-yellow-200 bg-white">
                    <option value="">Seleccionar...</option>
                    {UNIDADES_EDUCATIVAS_DEFAULT.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button onClick={() => setMostrarNueva(true)}
                    className="flex items-center gap-2 text-xs font-black text-zinc-500 hover:text-black uppercase tracking-wider">
                    <Plus size={12}/> No está en la lista
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input value={unidadNueva} onChange={e => setUnidadNueva(e.target.value)}
                    placeholder="Nombre completo de la institución"
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-zinc-400 placeholder:font-normal"/>
                  <button onClick={() => { setMostrarNueva(false); setUnidadNueva(""); }}
                    className="text-xs font-black text-zinc-400 hover:text-black uppercase tracking-wider">← Volver a la lista</button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Grado / Especialidad</label>
              <input value={grado} onChange={e => setGrado(e.target.value)}
                placeholder="Ej: 6to Básico  ·  3ro BGU Químico"
                className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-bold text-black outline-none focus:ring-4 focus:ring-yellow-200 uppercase placeholder:text-zinc-400 placeholder:normal-case placeholder:font-normal"/>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                Celular del padre/madre <span className="text-zinc-400 normal-case font-normal">(para QR WhatsApp)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400">🇪🇨</span>
                <input
                  value={telefonoPadre}
                  onChange={e => setTelefonoPadre(e.target.value.replace(/\D/g,"").slice(0,10))}
                  placeholder="09XXXXXXXX"
                  maxLength={10}
                  className="w-full border-2 border-black rounded-xl pl-10 pr-4 py-3 text-base font-black text-black outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-zinc-400 placeholder:font-normal"
                />
                {telLimpio.length > 0 && (
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black ${telLimpio.length === 10 ? "text-green-500" : "text-red-400"}`}>
                    {telLimpio.length === 10 ? "✓" : `${telLimpio.length}/10`}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Es para...</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIAS.map(c => (
                  <button key={c.value} onClick={() => { setCategoria(c.value as Categoria); setTemplateId(""); }}
                    className={`border-2 rounded-xl p-3 text-left transition-all
                      ${categoria === c.value ? "border-black bg-black text-white" : "border-zinc-200 hover:border-zinc-400"}`}>
                    <div className="text-sm font-black">{c.label}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${categoria === c.value ? "text-zinc-300" : "text-zinc-400"}`}>{c.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!paso1Valido}
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
              Siguiente — Elegir Modelo <ChevronRight size={16}/>
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Elige el modelo</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                {nombre.toUpperCase()} {apellido.toUpperCase()} · {grado.toUpperCase()}
              </p>
            </div>

            <div className="space-y-4">
              {templatesFiltrados.map(t => {
                const Comp = t.componente;
                const sel = templateId === t.id;
                return (
                  <button key={t.id} onClick={() => setTemplateId(t.id)}
                    className={`w-full rounded-2xl p-3 text-left transition-all
                      ${sel ? "ring-4 ring-yellow-300 border-black" : "border-zinc-200 hover:border-zinc-400"}`}
                    style={{ border: `${sel ? 3 : 2}px solid ${sel ? "#000" : "#e5e7eb"}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider">{t.nombre}</span>
                      {sel && <span className="bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">✓ Seleccionado</span>}
                    </div>
                    <div className="w-full rounded-xl border border-zinc-100 overflow-hidden" style={{ aspectRatio: "2/1" }}>
                      <Comp {...datosEtiqueta}/>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border-2 border-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <ChevronLeft size={16}/> Atrás
              </button>
              <button onClick={() => setStep(3)} disabled={!paso2Valido}
                className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-30">
                Siguiente <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && templateSeleccionado && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Confirmar pedido</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Revisa antes de enviar</p>
            </div>

            <div className="border-2 border-black rounded-2xl overflow-hidden">
              <templateSeleccionado.componente {...datosEtiqueta}/>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2.5">
              {[
                ["Nombre", `${nombre.toUpperCase()} ${apellido.toUpperCase()}`],
                ["Institución", unidadFinal],
                ["Grado", grado.toUpperCase()],
                ["Modelo", templateSeleccionado.nombre],
                ["WhatsApp", `+${telefonoWA}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">{k}</span>
                  <span className="text-xs font-black text-black text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Cantidad de etiquetas escolares</label>
              <div className="grid grid-cols-5 gap-2">
                {CANTIDADES.map(c => (
                  <button key={c} onClick={() => setCantidad(c)}
                    className={`py-3 rounded-xl font-black text-sm border-2 transition-all
                      ${cantidad === c ? "bg-black text-white border-black" : "border-zinc-200 hover:border-zinc-400"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                Etiquetas de lápices / esferos
                <span className="text-zinc-400 normal-case font-normal ml-1">(6 por hoja)</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0,1,2,3,4].map(h => (
                  <button key={h} onClick={() => setLapicesHojas(h)}
                    className={`py-3 rounded-xl font-black text-sm border-2 transition-all
                      ${lapicesHojas === h ? "bg-black text-white border-black" : "border-zinc-200 hover:border-zinc-400"}`}>
                    {h === 0 ? "No" : `${h}h`}
                  </button>
                ))}
              </div>
              {lapicesHojas > 0 && (
                <p className="text-[10px] text-zinc-400 font-bold mt-1">{lapicesHojas * 6} etiquetas de lápiz</p>
              )}
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>}

            <div className="flex gap-3 pb-8">
              <button onClick={() => setStep(2)}
                className="flex-1 border-2 border-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <ChevronLeft size={16}/> Atrás
              </button>
              <button onClick={guardarPedido} disabled={loading}
                className="flex-1 bg-yellow-400 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {loading ? "Enviando..." : <><Printer size={16}/> Enviar Pedido</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

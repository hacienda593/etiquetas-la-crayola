"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { CheckCircle, Printer } from "lucide-react";
import Link from "next/link";

const NEGOCIO_WA = "593984341953";

export default function ConfirmacionPage() {
  const { codigo } = useParams<{ codigo: string }>();

  const msgWA = encodeURIComponent(
    `Hola La Crayola! Mi código de pedido de etiquetas es: *${codigo}* 🏷️`
  );
  const waUrl = `https://wa.me/${NEGOCIO_WA}?text=${msgWA}`;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <CheckCircle size={40} className="text-black" fill="black"/>
      </div>

      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">¡Pedido enviado!</h1>
      <p className="text-zinc-500 text-sm font-bold max-w-xs mb-8">
        Muestra este código al cajero cuando le toque su turno
      </p>

      {/* Código grande */}
      <div className="bg-black text-yellow-400 rounded-3xl px-12 py-8 mb-8 shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Código de pedido</p>
        <p className="text-7xl font-black tracking-widest">{codigo}</p>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        {/* Botón WhatsApp */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,0.15)]">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar código por WhatsApp
        </a>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Instrucciones</p>
          <p className="text-xs text-zinc-600 font-bold leading-relaxed">
            1. Envía tu código por WhatsApp al negocio<br/>
            2. Espera tu turno en la caja<br/>
            3. Dile al cajero el código <strong>{codigo}</strong>
          </p>
        </div>

        <Link href="/"
          className="flex items-center justify-center gap-2 w-full border-2 border-black py-3 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
          Hacer otro pedido
        </Link>
      </div>

      <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest mt-8 flex items-center gap-1">
        <Printer size={10}/> La Crayola · Etiquetas Escolares
      </p>
    </main>
  );
}

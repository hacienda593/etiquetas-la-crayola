import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const UNIDADES_EDUCATIVAS_DEFAULT = [
  "Unidad Educativa SMB",
  "Escuela San Patricio",
  "Colegio Bernabé de Larrául",
  "UEFTE",
];

export type Pedido = {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  unidad_educativa: string;
  grado: string;
  genero: "nino" | "nina" | "joven_hombre" | "joven_mujer";
  template_id: string;
  cantidad: number;
  estado: "pendiente" | "impreso";
  created_at: string;
};

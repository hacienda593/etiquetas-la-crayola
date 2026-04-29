CREATE TABLE IF NOT EXISTS etiquetas_pedidos (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo           varchar(4)   NOT NULL,
  nombre           varchar(50)  NOT NULL,
  apellido         varchar(50)  NOT NULL,
  unidad_educativa varchar(120) NOT NULL,
  grado            varchar(80)  NOT NULL,
  genero           varchar(20)  NOT NULL,
  template_id      varchar(50)  NOT NULL,
  telefono_padre   varchar(15)  NOT NULL DEFAULT '',
  cantidad         integer      NOT NULL DEFAULT 24,
  estado           varchar(20)  NOT NULL DEFAULT 'pendiente',
  created_at       timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_etiquetas_codigo ON etiquetas_pedidos(codigo);

ALTER TABLE etiquetas_pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "permitir insert publico" ON etiquetas_pedidos FOR INSERT WITH CHECK (true);

CREATE POLICY "permitir select por codigo" ON etiquetas_pedidos FOR SELECT USING (true);

CREATE POLICY "permitir update estado" ON etiquetas_pedidos FOR UPDATE USING (true);

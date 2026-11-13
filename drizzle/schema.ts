import { date, pgTable, sql, text, timestamp, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const cargos = pgTable("cargos", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  cor: text("cor").notNull().default("#64748b"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  nomeUnique: uniqueIndex("cargos_nome_unique").on(sql`lower(btrim(${table.nome}))`),
}));

export const funcionarios = pgTable("funcionarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  cargoId: uuid("cargo_id").notNull().references(() => cargos.id, { onDelete: "restrict" }),
  cor: text("cor").notNull().default("#0f766e"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  nomeUnique: uniqueIndex("funcionarios_nome_unique").on(sql`lower(btrim(${table.nome}))`),
}));

export const folgas = pgTable("folgas", {
  id: uuid("id").defaultRandom().primaryKey(),
  funcionarioId: uuid("funcionario_id").notNull().references(() => funcionarios.id, { onDelete: "cascade" }),
  data: date("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  funcionarioDataUnique: unique("folgas_funcionario_data_unique").on(table.funcionarioId, table.data),
}));

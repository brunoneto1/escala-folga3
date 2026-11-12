# Escala de Folgas — Entrega 1 (Cargos e Funcionários)

Nesta etapa construímos apenas os itens 1 e 2 do documento. O calendário (item 3) fica para depois, mas a barra lateral já terá o link "Calendário" com uma tela "Em breve".

## O que você vai ver
- Barra lateral com: Calendário (em breve), Funcionários, Cargos. Pode ser recolhida.
- **Cargos**: lista em tabela, botão "Novo cargo", editar e excluir (com confirmação).
- **Funcionários**: lista com nome, cargo e bolinha de cor; criar/editar em diálogo escolhendo o cargo e a cor (paleta de cores pré-definida, sugerindo automaticamente uma ainda não usada).
- Mensagens (toasts) em português para sucesso e erros.

## Validações
- Cargo duplicado bloqueado (ignorando maiúsculas/minúsculas e espaços).
- Funcionário duplicado bloqueado (mesmo nome).
- Excluir cargo com funcionários vinculados é bloqueado com mensagem explicando quantos funcionários usam o cargo.

## Visual
Estilo app de gestão: fundo claro levemente quente, verde-petróleo como cor principal, fonte Manrope, cartões com bordas suaves.

## Detalhes técnicos
- Ativar Lovable Cloud (banco de dados). Sem login: tabelas com acesso público (anon) — adequado só para esta fase.
- Tabelas: `cargos (id, nome único case-insensitive, created_at)` e `funcionarios (id, nome único, cargo_id -> cargos ON DELETE RESTRICT, cor, created_at)`, com GRANTs e RLS liberando anon/authenticated. Também uma tabela `folgas (funcionario_id, data)` já criada para a próxima etapa.
- Camadas:
  - `src/services/cargos.ts`, `src/services/funcionarios.ts` — acesso ao banco.
  - `src/rules/` — estrutura vazia (`index.ts`, `types.ts` com interface de regra, README) para regras futuras.
  - Telas em `src/routes/` (o framework exige essa pasta no lugar de `src/pages/`): `index.tsx` redireciona para `/funcionarios`, `calendario.tsx`, `funcionarios.tsx`, `cargos.tsx`.
  - Componentes em `src/components/` (sidebar, formulários, diálogo de confirmação).
- Validação de duplicados no service antes de salvar + restrição no banco como garantia; dados via React Query.
- Testes simples para a normalização de nomes duplicados.

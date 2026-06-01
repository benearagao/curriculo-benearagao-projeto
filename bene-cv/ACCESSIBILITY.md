# Acessibilidade — Auditoria WCAG 2.2 AA

Este documento mapeia cada critério **WCAG 2.2 nível AA** atendido por este CV ao trecho de código que o satisfaz. Foi construído para ser auditável por qualquer pessoa que rode Lighthouse / axe DevTools / NVDA / VoiceOver sobre a página.

**Última auditoria interna:** 2026-06-01
**Conformidade declarada:** WCAG 2.2 AA (com elementos AAA pontuais)
**Página auditada:** <https://benearagao.com.br>
**Evidência automatizada:** suite `tests/` (`npm test`) → html-validate 0 erros · 8/8 teclado · axe-core 0 violações (41 checks). Roda no GitHub Action e barra o deploy se falhar.

---

## Resumo

| Princípio | Critérios atendidos | Status |
|---|---|---|
| **1. Perceptível** | 1.1.1, 1.3.1, 1.3.2, 1.3.3, 1.3.4, 1.3.5, 1.4.1, 1.4.3, 1.4.4, 1.4.5, 1.4.10, 1.4.11, 1.4.12, 1.4.13 | ✅ |
| **2. Operável** | 2.1.1, 2.1.2, 2.1.4, 2.4.1, 2.4.2, 2.4.3, 2.4.4, 2.4.5, 2.4.6, 2.4.7, 2.4.11, 2.4.12, 2.4.13, 2.5.1, 2.5.2, 2.5.3, 2.5.4, 2.5.7, 2.5.8 | ✅ |
| **3. Compreensível** | 3.1.1, 3.1.2, 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.2.6, 3.3.1, 3.3.2 | ✅ |
| **4. Robusto** | 4.1.1, 4.1.2, 4.1.3 | ✅ |

---

## 1. Perceptível

### 1.1.1 Conteúdo não textual (A)
- **Foto de perfil**: `<img alt="Foto de Bené Aragão">` em `index.html`.
- **Ícones decorativos** (telefone, e-mail, GitHub, LinkedIn, marker de localização, pin, mundo): todos com `aria-hidden="true"` e `focusable="false"` — corretamente ignorados por leitores de tela porque o texto do link adjacente já carrega a informação.
- **Skip link** com texto visível ao focar.

### 1.3.1 Informação e relações (A)
- Estrutura semântica: `<header>` (papel implícito `banner`), `<main>`, `<aside>`, `<footer>` (papel implícito `contentinfo`), `<article>`, `<section aria-labelledby="…">`. Roles explícitos foram omitidos por serem redundantes (regra nº 1 do ARIA).
- Hierarquia de headings: `h1` (nome) → `h2` (seções) → `h3` (cargos/projetos). Sem buracos.
- Listas reais: `<ul>`, `<ol>`, `<dl>` (skills usam definition list para par categoria/tecnologias).

### 1.3.2 Sequência significativa (A)
- DOM ordem = ordem visual = ordem de leitura. Sidebar precede o `main` apenas porque traz contexto pessoal (foto, contato, credencial). O `skip-link` permite pular direto para o conteúdo.

### 1.3.3 Características sensoriais (A)
- Nenhuma instrução depende de cor, forma ou posição. Não há "veja o ícone azul à direita".

### 1.3.4 Orientação (AA)
- Layout responsivo via CSS Grid/Flex. Sem `orientation: portrait/landscape` bloqueante.

### 1.3.5 Identificação de propósito de entrada (AA)
- Não há formulários nesta página. Critério N/A mas declarado para clareza.

### 1.4.1 Uso de cor (A)
- Cor nunca é o único portador de significado. Links são sublinhados via `text-decoration` (não só `color`). Selo W3Cx tem texto "VERIFIED" — não depende do verde.

### 1.4.3 Contraste (mínimo) (AA)
Todos os pares de cor validados sobre `#FFFFFF`:

| Token | Cor | Contraste | Conformidade |
|---|---|---|---|
| `--ink-primary` | `#1A1A1A` | 17.40:1 | AAA |
| `--ink-secondary` | `#4A4A4A` | 8.86:1 | AAA |
| `--ink-tertiary` | `#6B6B6B` | 5.33:1 | AA |
| `--accent` | `#0F766E` | 5.47:1 | AA (texto normal) |
| `--border` | `#D4D4D4` | 1.48:1 | decorativo (ver 1.4.11) |
| `--border-strong` | `#8E8E8E` | 3.28:1 | AA (componente de UI) |

> Valores recalculados em 2026-06-01 contra a fórmula WCAG (confere com WebAIM). A tabela anterior estava superestimada e foi corrigida.

### 1.4.4 Redimensionar texto (AA)
- Fontes em `rem`. Container em `max-width` (não `width` fixo). Zoom até 200% sem perda de funcionalidade ou conteúdo.

### 1.4.5 Imagens de texto (AA)
- Nenhum texto é exibido como imagem (exceto OG image, que não é parte da página renderizada).

### 1.4.10 Reflow (AA)
- Layout reflua em 320 CSS pixels sem scroll horizontal. Media queries em breakpoints estratégicos no `styles.css`.

### 1.4.11 Contraste de não-texto (AA)
- `--border` (#D4D4D4, 1.48:1) é usado **apenas em divisores decorativos** (`border-bottom` entre seções e contornos de *chips* não-interativos com texto de alto contraste). Divisores e elementos puramente decorativos são **isentos** de 1.4.11.
- Componentes interativos usam `--border-strong` (#8E8E8E, **3.28:1** — passa AA): borda do botão "Baixar PDF".
- Focus indicator (`outline: 2px solid var(--accent)`, 5.47:1) bem acima de 3:1.

### 1.4.12 Espaçamento de texto (AA)
- Sem `line-height`, `letter-spacing` ou `word-spacing` declarados em `!important` que impediriam override por user stylesheets.

### 1.4.13 Conteúdo sob hover ou foco (AA)
- Não há tooltips ou popovers acionados por hover. Critério N/A.

---

## 2. Operável

### 2.1.1 Teclado (A)
- 100% navegável via teclado. Botão "Baixar PDF" responde a `Enter` e `Space`.
- Links nativos `<a>` sem `tabindex` artificial.

### 2.1.2 Sem armadilha de teclado (A)
- Não há iframes embedded, modais ou widgets que prendam o foco.

### 2.1.4 Atalhos de tecla (A)
- Não há atalhos de tecla de uma letra implementados pelo autor. Critério N/A.

### 2.4.1 Bypass blocks (A)
- **Skip link**: `<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a>`. Visível ao receber foco.

### 2.4.2 Página com título (A)
- `<title>Bené Aragão — Designer Sênior de Produto · UX/UI + IA + Acessibilidade</title>`.

### 2.4.3 Ordem do foco (A)
- DOM ordem natural. Sem `tabindex` positivo.

### 2.4.4 Propósito do link (em contexto) (A)
- Todos os links têm texto descritivo. Links externos (LinkedIn, GitHub, projetos) levam `target="_blank"` + `rel="noopener noreferrer"` + `aria-label="… (abre em nova aba)"`.

### 2.4.5 Múltiplas formas (AA)
- CV de página única; sem necessidade de search/menu de site. Critério N/A.

### 2.4.6 Cabeçalhos e rótulos (AA)
- Cada `<section>` tem `aria-labelledby` apontando para um `h2` real.

### 2.4.7 Foco visível (AA)
- `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` em `styles.css`.

### 2.4.11 Foco não obscurecido (mínimo) (AA — **novo WCAG 2.2**)
- Botão "Baixar PDF" é `position: fixed` no canto superior direito. Não obscurece foco de nenhum elemento (o foco aparece com `outline-offset` visível mesmo sob a borda do botão).

### 2.4.12 Foco não obscurecido (aprimorado) (AAA)
- Mesmo critério; nenhum elemento da UI cobre o foco completamente.

### 2.4.13 Aparência do foco (AAA — adicionado, não exigido) (AAA)
- Outline tem 2px de espessura, contraste ≥3:1 contra a cor adjacente, e `outline-offset: 2px` o separa do elemento.

### 2.5.1 Gestos de ponteiro (A)
- Não há gestos de path-based ou multi-touch. Critério N/A.

### 2.5.2 Cancelamento de ponteiro (A)
- Clique no botão "Baixar PDF" só dispara no `click` (ato up), não `mousedown`.

### 2.5.3 Rótulo no nome (A)
- Botão "Baixar PDF" tem texto visível + `aria-label` consistente.

### 2.5.4 Atuação por movimento (A)
- Nenhuma funcionalidade depende de movimentação do dispositivo.

### 2.5.7 Movimentos de arrasto (AA — **novo WCAG 2.2**)
- Sem drag interactions. N/A.

### 2.5.8 Tamanho do alvo (mínimo) (AA — **novo WCAG 2.2**)
- Botão "Baixar PDF": padding `0.5rem 0.875rem` + texto + ícone → área clicável ~96×34px (≥24×24 exigido).
- Contact links: `padding: 4px 0` + texto inline-flex → atendem 24×24 quando contam com espaçamento entre alvos.
- Links de projeto (`imprimenovizinho.com.br`, `corretoratotalbrasilia.com.br`): ~18px de altura, mas são **links inline dentro do `<h3>`**, cuja altura é limitada pelo line-height do texto adjacente → cobertos pela **exceção de inline** do 2.5.8.

---

## 3. Compreensível

### 3.1.1 Idioma da página (A)
- `<html lang="pt-BR">`.

### 3.1.2 Idioma de partes (AA)
- Termos em inglês recebem `lang="en"`: "AI-augmented since 2024", "W3Cx Certified", "Web Accessibility". Leitores de tela trocam para voz inglesa nesses trechos.

### 3.2.1 Em foco (A)
- Receber foco não dispara mudança de contexto.

### 3.2.2 Em entrada (A)
- Sem inputs. N/A.

### 3.2.3 Navegação consistente (AA)
- Página única. N/A.

### 3.2.4 Identificação consistente (AA)
- Ícones com mesma função têm mesma representação visual e mesmo texto adjacente.

### 3.2.6 Ajuda consistente (A — **novo WCAG 2.2**)
- Não há mecanismo de ajuda. N/A.

### 3.3.1 Identificação de erro (A)
- Sem formulários. N/A.

### 3.3.2 Rótulos ou instruções (A)
- Sem formulários. N/A.

---

## 4. Robusto

### 4.1.1 Análise (A)
- HTML5 válido. Validar com `npx html-validate index.html`.

### 4.1.2 Nome, função, valor (A)
- Botão usa `<button type="button">` nativo. Skip link usa `<a>`. Não há widgets ARIA custom que exigiriam `role` + `aria-*` manuais.

### 4.1.3 Mensagens de status (AA)
- Sem mensagens dinâmicas (toast, snackbar, etc.). N/A.

---

## Critérios além do AA (extras)

| Critério | Nível | Implementação |
|---|---|---|
| 1.4.6 Contraste aprimorado | AAA | `--ink-primary` em 17.40:1, muito além de 7:1 |
| 2.3.3 Animação de interações | AAA | `@media (prefers-reduced-motion: reduce)` desativa transições |
| Forced colors mode | (W3C draft) | `@media (forced-colors: active)` mapeia tokens para system colors |

---

## Como auditar este CV

```bash
# 1. Lighthouse via Chrome DevTools
#    DevTools → Lighthouse → Accessibility → Analyze page load
#    Meta: 100/100

# 2. axe DevTools (extensão)
#    Painel axe → Scan ALL of my page → 0 violations

# 3. Validação HTML
npx html-validate index.html

# 4. Pa11y (CLI)
npx pa11y https://benearagao.com.br --standard WCAG2AA

# 5. Manual: teclado-only
#    F6 (foca a próxima região), Tab/Shift+Tab, Enter, Space.
#    Skip link DEVE aparecer no primeiro Tab.

# 6. Manual: leitor de tela
#    macOS: Cmd+F5 (VoiceOver) → leia toda a página com Ctrl+Opt+A.
#    Windows: NVDA (gratuito) → Insert+Down para leitura contínua.

# 7. prefers-reduced-motion
#    macOS: Sistema → Acessibilidade → Tela → Reduzir movimento.
#    Recarregue a página. Transições/animações devem cessar.

# 8. Forced colors (Windows)
#    Configurações → Acessibilidade → Temas de contraste → Aquatic.
#    Página deve permanecer legível, links/foco visíveis.
```

---

## Manutenção

Quando alterar `index.html` ou `styles.css`:

1. Rodar Lighthouse Accessibility — meta 100/100.
2. Rodar axe DevTools — zero violations.
3. Atualizar **Última auditoria** no topo deste arquivo.
4. Atualizar `?v=YYYYMMDD` em `index.html` (cache busting).
5. `git commit && git push` → GitHub Action faz deploy.

---

> Este documento é o instrumento de evidência que distingue um CV "que diz ser acessível" de um CV "que comprova ser acessível". Recrutadores em vagas sêniores de UX/Design buscam isso.

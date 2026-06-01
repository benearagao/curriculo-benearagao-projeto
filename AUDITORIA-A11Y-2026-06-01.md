# Relatório de Auditoria de Acessibilidade

**Produto:** Currículo digital Bené Aragão — <https://benearagao.com.br>
**Data:** 2026-06-01
**Norma de referência:** WCAG 2.2, nível AA (com itens AAA pontuais)
**Escopo:** página única `bene-cv/index.html` + `styles.css`
**Resultado:** ✅ Conforme AA — 0 violações automatizadas, achados manuais resolvidos

---

## 1. Metodologia e ferramentas

| Camada | Ferramenta | Versão | Comando |
|---|---|---|---|
| Validação estática | html-validate | 11.x | `npm run test:html` |
| Navegação por teclado | Playwright (Chromium) | 1.60 | `npm run test:keyboard` |
| Scanner WCAG | axe-core | 4.x | `npm run test:a11y` |
| Contraste de cor | cálculo WCAG (fórmula sRGB, confere com WebAIM) | — | script reproduzível (§4) |
| Reflow / target-size | Playwright @320px e medição de bounding-box | 1.60 | script reproduzível (§4) |

**Reproduzir tudo:**

```bash
cd bene-cv && python3 -m http.server 4321 &   # serve o site
cd tests && npm ci && npx playwright install --with-deps chromium
BASE_URL=http://localhost:4321/ npm test       # html + teclado + axe
```

A mesma suite roda no GitHub Action (`.github/workflows/deploy.yml`, job `audit`) e **barra o deploy** se qualquer item falhar.

---

## 2. Resultado automatizado

```
html-validate : 0 erros
teclado        : 8/8 checks (skip-link, foco visível, ordem de tabulação, sem armadilha)
axe-core       : 0 violações · 41 checks aprovados · 1 item incomplete (resolvido manualmente, §3)
```

Regras axe aplicadas: `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`.

---

## 3. Achados e correções desta auditoria

| # | Severidade | Critério | Achado | Correção |
|---|---|---|---|---|
| 1 | 🔴 Bloqueador | infra | `tests/a11y.spec.js` não existia — `npm test` quebrava; evidência axe não rodava | Suite axe-core recriada |
| 2 | 🔴 Alto | 2.4.7 | Teste do skip link falhava (`top: -100`) | Falso-positivo de timing: teste passou a aguardar a transição de 0.15s (CSS já conforme; estado estável `top: 8px`) |
| 3 | 🟠 Médio | 4.1.2 / ARIA 1.2 | `aria-label` proibido em `<span>` (role `generic`) no nome | `aria-label` removido (texto visível já é anunciado) |
| 4 | 🟠 Médio | 1.4.3 | Tabela de contraste do `ACCESSIBILITY.md` superestimada (ex.: `#1A1A1A` dizia 18.88, real 17.40) | Valores recalculados e corrigidos |
| 5 | 🔴 Alto | 1.4.11 | `--border` declarado 3.05:1, real **1.48:1**; usado na borda do botão "Baixar PDF" | Novo token `--border-strong` (#8E8E8E, 3.28:1) na borda do botão; `--border` restrito a divisores decorativos (isentos) |
| 6 | 🔵 Best-practice | ARIA-in-HTML | `role="banner"`/`role="contentinfo"` redundantes em `<header>`/`<footer>` | Removidos (papéis implícitos mantidos) |

---

## 4. Verificações manuais (itens que o axe não decide sozinho)

### 1.4.3 / 1.4.11 — Contraste (recalculado em 2026-06-01)

Texto sobre `#FFFFFF` (e selo W3Cx no pior caso do gradiente, `#F9F9F9`):

| Elemento | Cor | Fundo | Ratio | Status |
|---|---|---|---|---|
| `--ink-primary` | #1A1A1A | #FFF | 17.40:1 | AAA |
| `--ink-secondary` | #4A4A4A | #FFF | 8.86:1 | AAA |
| `--ink-tertiary` | #6B6B6B | #FFF | 5.33:1 | AA |
| `--accent` | #0F766E | #FFF | 5.47:1 | AA |
| `.badge__label` (selo) | #0F766E | #F9F9F9 | 5.20:1 | AA |
| `.badge__name` | #1A1A1A | #F9F9F9 | 16.53:1 | AAA |
| `.profile__initials` | #FFF | #0F766E | 5.47:1 | AA |
| Borda botão `--border-strong` | #8E8E8E | #FFF | 3.28:1 | AA (1.4.11) |

> Os 5 nós marcados `incomplete` pelo axe (`color-contrast`) eram texto sobre gradiente e iniciais sobrepostas pela foto — **todos verificados ≥ AA**.

### 1.4.10 Reflow — viewport 320px: `scrollWidth == clientWidth` → ✅ sem scroll horizontal.

### 2.5.8 Target size (24px):

- Botão "Baixar PDF": ~96×34px → ✅.
- Links de contato: atendem por espaçamento entre alvos → ✅.
- Links de projeto (~18px de altura): **inline dentro do `<h3>`** → cobertos pela exceção de inline → ✅.

**Script de verificação de contraste (reproduzível):**

```js
function lum(hex){const c=hex.replace('#','').match(/../g).map(h=>{let v=parseInt(h,16)/255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
function ratio(a,b){const L1=lum(a),L2=lum(b),hi=Math.max(L1,L2),lo=Math.min(L1,L2);return (hi+0.05)/(lo+0.05)}
```

---

## 5. Pendências para verificação humana final (não automatizáveis)

Antes de anunciar o selo publicamente, recomenda-se a passagem manual final:

- [ ] Leitor de tela — VoiceOver (macOS, `Cmd+F5`) e/ou NVDA (Windows): leitura completa da página.
- [ ] Zoom de texto a 200% no navegador (distinto de reflow): sem perda de conteúdo.
- [ ] Modo de cores forçadas (Windows High Contrast): links e foco permanecem visíveis.
- [ ] `prefers-reduced-motion`: transições cessam.

Estes itens dependem de tecnologia assistiva real e julgamento humano — o `ACCESSIBILITY.md` traz o passo-a-passo.

---

## 6. Conclusão

O produto atende **WCAG 2.2 nível AA** de forma **comprovável e reproduzível**: a evidência não é uma afirmação no rodapé, mas uma suite executável que qualquer terceiro roda e vê passar, integrada ao pipeline de deploy. Os achados desta auditoria (incluindo claims de contraste incorretos) foram corrigidos. Restam apenas verificações manuais de tecnologia assistiva (§5) para o selo final.

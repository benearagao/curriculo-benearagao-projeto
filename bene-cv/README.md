# Bené Aragão — Currículo Web

CV web em **HTML5 + CSS3 puro**, sem build, sem framework, zero dependências em runtime.

- **Acessibilidade**: WCAG 2.2 AA — ver [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) para checklist auditável.
- **Performance**: Lighthouse-ready (cache de longa duração via `.htaccess`, fontes com `display=swap`).
- **SEO**: structured data Schema.org `Person`, Open Graph + Twitter cards, `sitemap.xml`, `robots.txt`.
- **Print**: PDF idêntico via `@media print`, cabe em 1 página A4.
- **Deploy**: GitHub Actions → FTP Locaweb automático em todo `push` para `main`.

Produção: <https://benearagao.com.br>

---

## Estrutura

```
bene-cv/
├── index.html              # CV completo, HTML5 semântico, Schema.org Person
├── styles.css              # Tokens + layout + @media print + a11y queries
├── .htaccess               # Gzip, cache, security headers (Apache/Locaweb)
├── robots.txt              # Crawlers
├── sitemap.xml             # Sitemap XML
├── ACCESSIBILITY.md        # Checklist WCAG 2.2 AA auditável
├── README.md
└── assets/
    ├── favicon.svg
    ├── profile.jpg         # Foto 120x120 (renderizada)
    ├── og-image.png        # 1200x630 social preview
    └── og-image.svg        # Fonte do PNG
```

---

## Rodar localmente

```bash
# Servidor estático (recomendado para testar OG, fontes, headers)
npx serve .
# ou
python3 -m http.server 8000
```

Abrir `http://localhost:3000` ou `http://localhost:8000`.

---

## Gerar PDF a partir do navegador

1. Abrir `index.html` no Chrome ou Edge.
2. Clicar no botão **"Baixar PDF"** no canto superior direito (ou `Cmd/Ctrl + P`).
3. Destino: **Salvar como PDF**. Layout: Retrato. Papel: A4. Margens: Padrão.
4. **Mais ajustes** → marcar **"Gráficos de plano de fundo"** (preserva a accent do selo W3Cx).
5. Salvar.

Cabe em **uma página A4**.

---

## Validar acessibilidade

```bash
# Suite automatizada (a mesma que roda no CI e barra o deploy)
#   html-validate + navegação por teclado (Playwright) + axe-core
python3 -m http.server 4321 &        # a partir desta pasta (bene-cv/)
cd ../tests && npm install
BASE_URL=http://localhost:4321/ npm test
#   → html-validate: 0 erros · teclado: 8/8 · axe: 0 violações
#   Requer Node ≥ 22.22.

# Complementos no navegador:
# - Lighthouse (DevTools → Accessibility) — meta 100/100
# - axe DevTools (extensão Chrome/Firefox) → 0 violações
```

Relatório de auditoria datado: [`../AUDITORIA-A11Y-2026-06-01.md`](../AUDITORIA-A11Y-2026-06-01.md).

Testes manuais essenciais:
- Navegação só por teclado (Tab/Shift+Tab/Enter); o **skip link** aparece no primeiro Tab.
- Foco visível em todos os elementos interativos.
- Leitor de tela (VoiceOver macOS: `Cmd+F5` · NVDA Windows).
- `prefers-reduced-motion`: animações desativadas.
- `forced-colors: active` (Windows High Contrast): contrastes preservados.

Ver [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) para a auditoria completa.

---

## Deploy

### Automático (recomendado)

A cada `git push` na `main` que toque `bene-cv/**`, o workflow `.github/workflows/deploy.yml` faz o upload via FTP para a Locaweb. Configurar uma vez:

1. **Settings → Secrets and variables → Actions** no repo do GitHub.
2. Adicionar dois secrets:
   - `FTP_USERNAME` → `benearagao8`
   - `FTP_PASSWORD` → senha FTP da Locaweb
3. `git push` na `main` dispara o deploy.

### Manual (fallback)

```bash
./deploy-locaweb.sh
```

### Limpeza de cache pós-deploy

- Navegador: `Cmd+Shift+R` / `Ctrl+Shift+R`.
- `.htaccess` já gerencia `Cache-Control` com versionamento via `?v=` em `styles.css`.

---

## Cache busting

Quando alterar `styles.css`, atualizar a query string no `<link>`:

```html
<link rel="stylesheet" href="styles.css?v=YYYYMMDD">
```

Isso força navegadores a baixar a nova versão imediatamente, mesmo com `.htaccess` aplicando cache de 1 ano.

---

## Regenerar o `og-image.png`

A partir do SVG (após qualquer edição em `assets/og-image.svg`):

```bash
cd bene-cv/assets
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=og-image.png \
  "file://$PWD/og-image.svg"
```

Validar preview em <https://www.opengraph.xyz>.

---

## Decisões de design

| Decisão | Por quê |
|---|---|
| **HTML5 + CSS3 puro, zero build** | Coerência com o pitch de a11y e domínio fundamental. Deploy é cópia de arquivos. Sobrevive a qualquer mudança de stack. |
| **Accent `#0F766E` (teal)** | Contraste 5.47:1 sobre `#FFF` — AA texto normal. `theme-color` alinhado. |
| **Tipografia: Inter + JetBrains Mono** | Inter para corpo (legibilidade Web), Mono para badges/códigos. Features OpenType: kerning + tabular-nums em datas. |
| **Sem ícones decorativos no corpo** | Reduz ruído cognitivo. Os 5 ícones de contato são `aria-hidden="true"`. |
| **Skills via `<dl>`, sem barras** | Honesto e acessível. Barras de "85% de Figma" são teatro. |
| **Selo W3Cx como verified seal** | Check em círculo accent, fundo gradient sutil — visualmente lê como credencial verificada. |
| **Tagline highlights como chips** | Aumenta escaneabilidade, hierarquia mais rica que separadores de bullet. |
| **`prefers-reduced-motion` + `forced-colors`** | Não é decoração — é WCAG 2.3.3 (Success Criterion) e suporte ao High Contrast Mode do Windows. |

---

## Stack & versionamento

- Sem `package.json`. Tudo é estático.
- HTTP de produção servido pelo Apache da Locaweb (`.htaccess` cuida do resto).
- Versionamento: Git. Branch `main` = produção.

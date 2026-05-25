# Bené Aragão — Currículo Web

Currículo web em **HTML5 + CSS3 puro**, sem build, sem framework. Acessibilidade WCAG 2.2 AA validável; impressão para PDF idêntica via `@media print`.

URL pretendida: <https://cv.benearagao.com.br>

## Estrutura

```
bene-cv/
├── index.html         # CV completo, HTML5 semântico
├── styles.css         # Tokens, layout 2 colunas, print
├── assets/
│   ├── favicon.svg    # Letra "B" em SVG
│   ├── og-image.png   # 1200x630 (gerada a partir de og-image.svg)
│   └── og-image.svg   # Fonte do social preview
└── README.md
```

## Rodar localmente

Como não há build, qualquer uma destas opções funciona:

```bash
# Opção 1 — abrir direto no navegador
open index.html

# Opção 2 — servidor estático (recomendado p/ testar fontes, meta tags, OG)
npx serve .
# ou
python3 -m http.server 8000
```

Em seguida, abra <http://localhost:3000> (serve) ou <http://localhost:8000> (python).

## Gerar PDF (a partir do navegador)

1. Abra `index.html` no Chrome ou Edge.
2. `Ctrl/Cmd + P` para abrir a impressão.
3. **Destino**: "Salvar como PDF".
4. **Layout**: Retrato. **Tamanho do papel**: A4. **Margens**: Padrão.
5. **Mais ajustes** → marque **"Gráficos de plano de fundo"** (preserva a cor accent do selo W3Cx e dos marcadores).
6. Salvar.

O layout de 2 colunas é mantido, e o arquivo cabe em **uma página A4**.

## Validar acessibilidade

```bash
# Lighthouse (Chrome DevTools → Lighthouse → Accessibility)
# Meta: 100/100

# axe DevTools (extensão Chrome/Firefox)

# Validação HTML
npx html-validate index.html
```

Cheque também:
- Navegação só por teclado (Tab/Shift+Tab/Enter).
- Skip link aparece ao focar o primeiro elemento (`Tab` no topo da página).
- Leitor de tela (VoiceOver no macOS: `Cmd + F5`; NVDA no Windows).

## Deploy na Vercel

A forma mais simples (sem CLI):

1. Faça `git init` na pasta `bene-cv/` e suba para um repo no GitHub.
2. Entre em <https://vercel.com/new> e importe o repositório.
3. Framework preset: **Other**. Build command: **(vazio)**. Output dir: **`./`**.
4. Deploy.

Via Vercel CLI:

```bash
npm i -g vercel
cd bene-cv
vercel        # primeira vez: aceitar todas as defaults (Other / sem build)
vercel --prod # promove para produção
```

## Apontar `cv.benearagao.com.br` (DNS)

No painel da Vercel, em **Project → Settings → Domains**:

1. Adicione `cv.benearagao.com.br`.
2. A Vercel mostrará um `CNAME` a configurar:
   ```
   Tipo:   CNAME
   Host:   cv
   Aponta: cname.vercel-dns.com
   TTL:    3600 (ou padrão)
   ```
3. No painel DNS do seu registrador de `benearagao.com.br` (Registro.br, Cloudflare, etc.), adicione o registro acima.
4. Aguarde a propagação (até ~30 min). A Vercel emite o certificado TLS automaticamente.

> Se você usa Cloudflare, deixe o registro como **"DNS only"** (nuvem cinza) durante a primeira validação, depois pode ativar o proxy se desejar.

## Regenerar o `og-image.png`

A versão atual foi gerada a partir do SVG via Chrome headless:

```bash
cd assets
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=og-image.png \
  "file://$PWD/og-image.svg"
```

Para mudar a arte: edite `assets/og-image.svg` e rode o comando acima novamente. Para validar como aparece no LinkedIn / Twitter / WhatsApp use <https://www.opengraph.xyz>.

## Decisões de design

- **Cores**: `--accent: #1D4ED8` (azul tech) sobre fundo branco — contraste 7.66:1, AAA para texto normal.
- **Tipografia**: Inter (sans-serif) + JetBrains Mono (stack/URLs) via Google Fonts com `display=swap`.
- **Sem ícones decorativos**: apenas os 5 ícones de contato na sidebar, todos `aria-hidden="true"`.
- **Sem barras de progresso de skill**: agrupadas por categoria via `<dl>`, mais honestas e mais acessíveis.
- **Selo W3Cx**: borda accent + fundo `--bg-subtle`, ponto focal visual da credencial mais rara do CV.

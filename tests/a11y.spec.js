/**
 * Teste automatizado de acessibilidade (axe-core)
 *
 * Rodar:
 *   1. Servidor: cd ../bene-cv && python3 -m http.server 4321
 *   2. Teste:    node a11y.spec.js
 *
 * Escaneia a página com axe-core nas regras WCAG 2.0/2.1/2.2 níveis A e AA.
 * Saída: lista de violações (se houver) e contagem de checks aprovados.
 * Exit code 1 se qualquer violação for encontrada.
 */

const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321/';

// Tags axe correspondentes ao alvo declarado em ACCESSIBILITY.md: WCAG 2.2 AA.
const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
];

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const impactColor = {
  critical: RED,
  serious: RED,
  moderate: YELLOW,
  minor: YELLOW,
};

(async () => {
  console.log(`\n${BOLD}Teste de acessibilidade (axe-core) · ${BASE_URL}${RESET}`);
  console.log(`${DIM}Regras: ${WCAG_TAGS.join(', ')}${RESET}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.log(`${RED}PAGE ERROR:${RESET} ${err.message}`));

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  } catch (e) {
    console.log(`${RED}Falha ao carregar ${BASE_URL}: ${e.message}${RESET}`);
    console.log(`${YELLOW}O servidor está rodando? cd bene-cv && python3 -m http.server 4321${RESET}`);
    await browser.close();
    process.exit(1);
  }

  const axe = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  const { violations, passes, incomplete } = await axe.analyze();

  // --- Violações ---
  if (violations.length === 0) {
    console.log(`${GREEN}✓ Nenhuma violação encontrada${RESET}`);
  } else {
    console.log(`${RED}${BOLD}✗ ${violations.length} regra(s) com violação:${RESET}\n`);
    for (const v of violations) {
      const c = impactColor[v.impact] || RESET;
      console.log(`${c}● [${(v.impact || 'n/a').toUpperCase()}] ${v.id}${RESET} — ${v.help}`);
      console.log(`  ${DIM}${v.helpUrl}${RESET}`);
      console.log(`  ${DIM}tags: ${v.tags.filter((t) => t.startsWith('wcag')).join(', ')}${RESET}`);
      v.nodes.forEach((n, i) => {
        console.log(`  ${DIM}#${i + 1} ${n.target.join(' ')}${RESET}`);
        const summary = (n.failureSummary || '').split('\n').filter(Boolean).join(' · ');
        if (summary) console.log(`     ${DIM}${summary}${RESET}`);
      });
      console.log('');
    }
  }

  // --- Itens que axe não conseguiu decidir (requerem revisão manual) ---
  if (incomplete.length > 0) {
    console.log(`${YELLOW}⚠ ${incomplete.length} item(s) requerem revisão manual (incomplete):${RESET}`);
    for (const inc of incomplete) {
      console.log(`  ${DIM}- ${inc.id}: ${inc.help} (${inc.nodes.length} nó[s])${RESET}`);
    }
    console.log('');
  }

  console.log(
    `${BOLD}Resumo:${RESET} ${GREEN}${passes.length} checks aprovados${RESET} · ` +
      `${violations.length > 0 ? RED : DIM}${violations.length} violações${RESET} · ` +
      `${YELLOW}${incomplete.length} a revisar manualmente${RESET}\n`
  );

  await browser.close();
  process.exit(violations.length > 0 ? 1 : 0);
})();

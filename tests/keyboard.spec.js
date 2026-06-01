/**
 * Teste automatizado de navegação por teclado
 *
 * Rodar:
 *   1. Servidor: cd ../bene-cv && python3 -m http.server 4321
 *   2. Teste:    node keyboard.spec.js
 *
 * Saída: relatório por critério WCAG 2.4.x e 2.1.x.
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321/';
const MAX_TAB_STOPS = 25;

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const results = [];
let pass = 0;
let fail = 0;

function record(test, ok, details) {
  results.push({ test, ok, details });
  if (ok) {
    pass++;
    console.log(`${GREEN}✓${RESET} ${test}`);
  } else {
    fail++;
    console.log(`${RED}✗${RESET} ${BOLD}${test}${RESET}`);
    if (details) console.log(`  ${DIM}${JSON.stringify(details, null, 2).replace(/\n/g, '\n  ')}${RESET}`);
  }
}

async function focusInfo(page) {
  return await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      cls: el.className || '',
      id: el.id || '',
      text: (el.textContent || '').trim().slice(0, 60),
      href: el.getAttribute('href') || null,
      ariaLabel: el.getAttribute('aria-label') || null,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      visible: rect.top >= 0 && rect.top <= window.innerHeight && rect.width > 0 && rect.height > 0,
      outline: {
        style: computed.outlineStyle,
        width: computed.outlineWidth,
        color: computed.outlineColor,
        offset: computed.outlineOffset,
      },
      boxShadow: computed.boxShadow,
    };
  });
}

function hasVisibleFocus(info) {
  if (!info) return false;
  const widthPx = parseFloat(info.outline.width);
  const outlineVisible = info.outline.style !== 'none' && widthPx > 0;
  const shadowVisible = info.boxShadow && info.boxShadow !== 'none';
  return outlineVisible || shadowVisible;
}

(async () => {
  console.log(`\n${BOLD}Teste de navegação por teclado · ${BASE_URL}${RESET}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.log(`${RED}PAGE ERROR:${RESET} ${err.message}`));

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  } catch (e) {
    console.log(`${RED}Falha ao carregar ${BASE_URL}: ${e.message}${RESET}`);
    console.log(`${YELLOW}O servidor está rodando? cd bene-cv && python3 -m http.server 4321${RESET}`);
    process.exit(1);
  }

  // ============================================================
  // TEST 1 — Skip link é o primeiro elemento focável (WCAG 2.4.1)
  // ============================================================
  await page.keyboard.press('Tab');
  // O skip link revela-se com `transition: top 0.15s`; espera a animação
  // assentar antes de medir a posição (senão lemos um quadro intermediário).
  await page.waitForTimeout(250);
  const first = await focusInfo(page);

  record(
    '2.4.1 · Skip link é o primeiro elemento ao pressionar Tab',
    first && first.cls.includes('skip-link'),
    first ? { got: { tag: first.tag, cls: first.cls, text: first.text } } : { got: 'nada focado' }
  );

  // ============================================================
  // TEST 2 — Skip link fica visível ao receber foco
  // ============================================================
  record(
    '1.4.13 · Skip link torna-se visível ao receber foco (não fica off-screen)',
    first && first.rect.top >= 0 && first.rect.top < 200,
    first ? { rect_top: first.rect.top, expected: '>= 0 e < 200 (em px)' } : null
  );

  // ============================================================
  // TEST 3 — Skip link tem foco visível (outline)
  // ============================================================
  record(
    '2.4.7 · Skip link tem indicador de foco visível',
    hasVisibleFocus(first),
    first ? { outline: first.outline, boxShadow: first.boxShadow } : null
  );

  // ============================================================
  // TEST 4 — Skip link ativa e move foco para #main-content
  // ============================================================
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const afterSkip = await focusInfo(page);

  record(
    '2.4.1 · Ativar skip link (Enter) move foco para #main-content',
    afterSkip && afterSkip.id === 'main-content',
    afterSkip ? { activeId: afterSkip.id, expected: 'main-content' } : null
  );

  // ============================================================
  // TEST 5 — Botão "Baixar PDF" alcançável por teclado
  // ============================================================
  // Volta ao topo
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab'); // skip-link
  await page.keyboard.press('Tab'); // ?
  const second = await focusInfo(page);

  record(
    '2.1.1 · Botão "Baixar PDF" alcançável via Tab (2º elemento)',
    second && second.cls.includes('action-print'),
    second ? { tag: second.tag, cls: second.cls, ariaLabel: second.ariaLabel } : null
  );

  record(
    '2.4.7 · Botão "Baixar PDF" tem foco visível',
    hasVisibleFocus(second),
    second ? { outline: second.outline, boxShadow: second.boxShadow } : null
  );

  // ============================================================
  // TEST 6 — Ordem de tabulação completa (audit)
  // ============================================================
  console.log(`\n${BOLD}${DIM}Auditando ordem completa de tabulação...${RESET}`);

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const tabOrder = [];
  const focusFailures = [];

  for (let i = 0; i < MAX_TAB_STOPS; i++) {
    await page.keyboard.press('Tab');
    const info = await focusInfo(page);
    if (!info) break;
    tabOrder.push({
      i: i + 1,
      tag: info.tag,
      text: info.text.slice(0, 40),
      visible: info.visible,
      hasFocus: hasVisibleFocus(info),
    });
    if (!hasVisibleFocus(info)) {
      focusFailures.push({ i: i + 1, tag: info.tag, cls: info.cls, text: info.text });
    }
  }

  console.log(`\n${DIM}Ordem de tabulação (${tabOrder.length} stops):${RESET}`);
  tabOrder.forEach((t) => {
    const mark = t.hasFocus ? `${GREEN}●${RESET}` : `${RED}●${RESET}`;
    const vis = t.visible ? '' : ` ${YELLOW}[fora da viewport]${RESET}`;
    console.log(`  ${mark} ${String(t.i).padStart(2)} · ${t.tag.padEnd(8)} ${DIM}${t.text}${RESET}${vis}`);
  });

  record(
    '2.4.7 · Todos os elementos da ordem de tabulação têm foco visível',
    focusFailures.length === 0,
    focusFailures.length > 0 ? { count: focusFailures.length, items: focusFailures } : null
  );

  // ============================================================
  // TEST 7 — Sem armadilha de teclado (WCAG 2.1.2)
  // ============================================================
  // Se chegamos ao MAX_TAB_STOPS sem repetir o skip link, está OK.
  // Se 25 tabs mantém o mesmo elemento focado, é armadilha.
  const last5 = tabOrder.slice(-5).map((t) => t.text);
  const stuck = last5.every((t) => t === last5[0]);

  record(
    '2.1.2 · Sem armadilha de teclado (foco não fica preso)',
    !stuck,
    stuck ? { last5 } : null
  );

  // ============================================================
  // Resumo
  // ============================================================
  console.log(`\n${BOLD}Resumo:${RESET} ${GREEN}${pass} ok${RESET} · ${fail > 0 ? RED : DIM}${fail} falhas${RESET}\n`);

  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
})();

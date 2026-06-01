# Como contribuir

Chegou aqui pelo post? Seja bem-vindo(a). 🙂

Este repositório é o código de um currículo digital construído como prova prática de **acessibilidade WCAG 2.2 AA**, e foi deixado aberto de propósito: **acessibilidade evolui na prática e em comunidade.** Se você testou e encontrou algo — ou tem uma ideia de melhoria — sua contribuição é muito bem-vinda.

Não existe contribuição pequena demais. Um relato de "no meu leitor de tela isso soa estranho" já é ouro.

---

## Duas formas de contribuir

### 1. Reportar um problema (mais rápido)

Abra uma [issue](../../issues/new/choose) usando o template **"Relato de acessibilidade"**. Quanto mais contexto, melhor:

- **Onde** aconteceu (qual seção/elemento da página).
- **Como** você testou — navegador, sistema, e a tecnologia assistiva ou ferramenta (VoiceOver, NVDA, só teclado, Lighthouse, axe DevTools…).
- **O que esperava** e **o que aconteceu**.
- O **critério WCAG** envolvido, se você souber (não é obrigatório).

Não precisa ter certeza de que é um bug "oficial". Se pareceu errado pra você, vale o relato.

### 2. Enviar uma correção (Pull Request)

1. Faça **fork** e crie uma branch (`git checkout -b fix/descricao-curta`).
2. Faça a alteração em `bene-cv/` (`index.html` / `styles.css`).
3. **Rode a suíte** e garanta que está verde (veja abaixo).
4. Abra o PR descrevendo o **antes/depois** e, se aplicável, o critério WCAG atendido.

---

## Rodar a auditoria localmente

A mesma suíte que roda no CI e **bloqueia o deploy** se algo regredir:

```bash
# 1. Servir o site
cd bene-cv && python3 -m http.server 4321 &

# 2. Rodar a suíte: html-validate + navegação por teclado + axe-core
cd ../tests && npm install
BASE_URL=http://localhost:4321/ npm test
#   → html-validate: 0 erros · teclado: 8/8 · axe-core: 0 violações
```

> Requer **Node ≥ 22.22** (o `html-validate` usa `fs.globSync`).

Comandos individuais: `npm run test:html`, `npm run test:keyboard`, `npm run test:a11y`.

---

## O padrão que seguimos

- **Alvo:** WCAG 2.2 nível AA (com itens AAA pontuais).
- **Regra nº 1 do ARIA:** prefira HTML nativo a ARIA sempre que possível.
- **Evidência, não afirmação:** se uma mudança afeta um critério, atualize o mapeamento em [`bene-cv/ACCESSIBILITY.md`](./bene-cv/ACCESSIBILITY.md) e mantenha os números **honestos** (contraste medido, não estimado).
- **Sem build, sem framework, zero dependências em runtime** — mudanças que quebrem isso provavelmente não serão aceitas; é uma decisão de projeto, não um descuido.
- Mexeu em `styles.css`? Atualize o cache busting `?v=YYYYMMDD` no `<link>` do `index.html`.

---

## Um aviso amigável sobre o conteúdo

Este é o currículo de uma pessoa real. **Sinta-se livre para usar o código como template do seu próprio CV** (licença MIT) — mas, ao fazer fork, **troque o conteúdo pelo seu** (nome, foto, textos, links). Contribuições aqui são sobre o *código e a acessibilidade do template*, não sobre os dados pessoais.

Obrigado por ajudar a deixar a web um pouco mais acessível. 💚

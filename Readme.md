# 🏡 FamilyFlow

> Sistema de controle de gastos mensais para famílias — simples, visual e organizado.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

---

## 📌 Sobre o projeto

O **FamilyFlow** é uma plataforma de controle financeiro familiar que permite registrar entradas e saídas, organizar gastos por categorias personalizadas e visualizar o orçamento mensal em gráficos claros e objetivos.

Cada família tem sua própria conta com até 5 integrantes, categorias personalizadas e histórico de transações — tudo protegido por autenticação e controle de acesso por papel (administrador ou membro).

> Projeto desenvolvido como estudo prático de desenvolvimento web, aplicando HTML5, CSS3, JavaScript vanilla, Supabase (PostgreSQL) e integração com plataforma de pagamentos.

---

## ✨ Funcionalidades

### Fase 1 — MVP
- [x] Tela de login com autenticação via Supabase Auth
- [ ] Cadastro de família com período de teste gratuito (14 dias)
- [ ] Gestão de integrantes (até 5 por família)
- [ ] Convite de integrantes por link (WhatsApp / e-mail) ou cadastro manual pelo admin
- [ ] Dois níveis de acesso: **Administrador** e **Membro**
- [ ] Categorias dinâmicas por família (criar, editar e excluir)
- [ ] Cadastro de transações (entrada e saída) por integrante

### Fase 2 — Dashboard
- [ ] Resumo mensal (saldo, total de entradas, total de saídas)
- [ ] Gráficos de gastos por categoria
- [ ] Histórico de transações com filtros

### Fase 3 — Pagamentos
- [ ] Assinatura mensal por família (cartão de crédito e PIX)
- [ ] Bloqueio automático de acesso para famílias inadimplentes
- [ ] Reativação automática após pagamento confirmado
- [ ] Página de cobrança e gerenciamento de assinatura

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend / Banco | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Pagamentos | Mercado Pago (a confirmar) |
| Hospedagem | A definir |

---

## 👥 Modelo de acesso

| Papel | Permissões |
|---|---|
| **Administrador** | Gerencia integrantes, categorias, transações e assinatura |
| **Membro** | Registra e visualiza transações da família |

---

## 📁 Estrutura de pastas

```
familyflow/
├── index.html            ← Tela de login
├── dashboard.html        ← Painel principal
├── transactions.html     ← Listagem de transações
├── categories.html       ← Gerenciar categorias
├── family.html           ← Gerenciar integrantes
├── onboarding.html       ← Configuração inicial da família
├── subscription.html     ← Assinatura e pagamento
├── css/
│   └── style.css         ← Estilos globais
└── js/
    ├── supabase.js       ← Configuração e cliente Supabase
    ├── login.js          ← Lógica da tela de login
    ├── dashboard.js      ← Lógica do dashboard
    ├── transactions.js   ← Lógica das transações
    ├── categories.js     ← Lógica das categorias
    ├── family.js         ← Lógica da gestão familiar
    └── onboarding.js     ← Lógica do fluxo de onboarding
```

---

## 🗺️ Roadmap

```
FASE 1 — MVP
[✅] Definição do escopo e estrutura do projeto
[✅] Scaffolding (estrutura de pastas e arquivos)
[✅] Tela de login (HTML + CSS)
[✅] Lógica de validação de campos (login.js)
[ ] Configuração do Supabase (banco + auth)
[ ] Modelagem do banco de dados
[ ] Autenticação real com Supabase Auth
[ ] Tela de cadastro (dados pessoais + família)
[ ] Onboarding — Passo 1: Renda familiar
[ ] Onboarding — Passo 2: Categorias (sugestões + personalizadas)
[ ] Onboarding — Passo 3: Integrantes (link, e-mail ou manual)
[ ] Onboarding — Passo 4: Tudo pronto 🎉
[ ] Categorias dinâmicas por família
[ ] Cadastro de transações

FASE 2 — DASHBOARD
[ ] Layout do dashboard
[ ] Resumo financeiro mensal
[ ] Gráficos por categoria

FASE 3 — PAGAMENTOS
[ ] Integração com plataforma de pagamentos
[ ] Assinatura recorrente (cartão + PIX)
[ ] Bloqueio e reativação automática de acesso
```

---

## 🚀 Como rodar localmente

> Nenhuma instalação necessária — o projeto roda direto no browser.

1. Clone o repositório:
```bash
git clone https://github.com/UriellBarbosa/FamilyFlow.git
```

2. Abra o arquivo `index.html` no browser **ou** use a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code.

3. Configure suas credenciais do Supabase em `js/supabase.js` (instruções no passo correspondente do roadmap).

---

## 👨‍💻 Autor

Desenvolvido por **Uriel Barbosa** — estudante de Engenharia de Software.

- GitHub: [@UriellBarbosa](https://github.com/UriellBarbosa)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
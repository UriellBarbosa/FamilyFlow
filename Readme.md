# 🏡 FamilyFlow

> Sistema de controle de gastos mensais para famílias — simples, visual e organizado.

![Status](https://img.shields.io/badge/status-em%20planejamento-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

---

## 📌 Sobre o projeto

O **FamilyFlow** nasceu da necessidade de ter uma ferramenta simples para acompanhar as finanças de uma família ao longo do mês — sem planilhas complicadas, sem apps pesados.

O sistema permite registrar entradas e saídas, organizá-las por categoria e visualizar os dados em gráficos mensais, tudo de forma clara e acessível.

> Projeto desenvolvido como estudo prático de desenvolvimento web, aplicando HTML5, CSS3, JavaScript vanilla e Supabase (PostgreSQL).

---

## ✨ Funcionalidades planejadas

### MVP (versão inicial)
- [x] Tela de login com autenticação via Supabase Auth
- [ ] Dashboard com resumo mensal (saldo, entradas, saídas)
- [ ] Gráficos de gastos por categoria
- [ ] Cadastro de transações (entrada e saída)
- [ ] Gerenciamento de categorias personalizadas

### Futuro (pós-MVP)
- [ ] Suporte a múltiplos membros da família
- [ ] Metas mensais por categoria
- [ ] Exportação de relatório em PDF
- [ ] Modo offline com sincronização

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend / Banco | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Hospedagem | A definir |

---

## 📁 Estrutura de pastas

```
familyflow/
├── index.html          ← Tela de login
├── dashboard.html      ← Painel principal
├── transactions.html   ← Listagem de transações
├── categories.html     ← Gerenciar categorias
├── css/
│   └── style.css       ← Estilos globais
└── js/
    ├── supabase.js     ← Configuração e cliente Supabase
    ├── login.js        ← Lógica da tela de login
    ├── dashboard.js    ← Lógica do dashboard
    └── transactions.js ← Lógica das transações
```

---

## 🗺️ Roadmap

```
[✅] Definição do escopo e estrutura do projeto
[ ] Passo 1 — Estrutura base de arquivos (scaffolding)
[ ] Passo 2 — Tela de login (HTML + CSS)
[ ] Passo 3 — Integração com Supabase Auth
[ ] Passo 4 — Modelagem do banco de dados
[ ] Passo 5 — Dashboard (layout + dados reais)
[ ] Passo 6 — Cadastro de transações
[ ] Passo 7 — Gerenciamento de categorias
[ ] Passo 8 — Gráficos com dados reais
```

---

## 🚀 Como rodar localmente

> Nenhuma instalação necessária — o projeto roda direto no browser.

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/familyflow.git
```

2. Abra o arquivo `index.html` no seu browser **ou** use a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code para recarregamento automático.

3. Configure suas credenciais do Supabase no arquivo `js/supabase.js` (instruções em cada passo do desenvolvimento).

---

## 👨‍💻 Autor

Desenvolvido por **Uriel Barbosa** — estudante de Engenharia de Software.

- GitHub: [@UriellBarbosa](https://github.com/UriellBarbosa)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
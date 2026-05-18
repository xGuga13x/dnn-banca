# De Novo Não! — Front-end (dnn-banca)

## Como funciona na banca

### Vercel (front-end)
O front está deployado no Vercel e funciona **sem precisar do Java rodando**.

**Página de IA** → integrada com o Render (Python/Flask) diretamente  
**Todas as outras páginas** → funcionam com dados demonstrativos (mock)

---

## Logins disponíveis no Vercel (sem Java)

| Login | Senha | Perfil | Acesso |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | Tudo |
| `dentista` | `dent123` | DENTISTA | Dashboard, Pacientes, Consultas, Prontuários, IA |
| `gestor` | `gest123` | GESTOR | Dashboard, Pacientes, Consultas, Campanhas, Doações, Materiais |
| `voluntario` | `vol123` | VOLUNTARIO | Dashboard, Pacientes, Campanhas, Materiais |

> Quando o Java estiver rodando localmente (dentro da rede FIAP), o login
> tenta autenticar via Java primeiro. Se o Java não estiver acessível,
> usa automaticamente os usuários acima.

---

## Rodar localmente (com Java integrado)

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o front
npm run dev
# → http://localhost:5173

# 3. Em outra aba, rodar o Java (dentro da rede FIAP)
cd ../Sprint4-Java/Java
mvn quarkus:dev
# → http://localhost:8080
```

O `VITE_API_URL` padrão já aponta para `localhost:8080` — nenhuma configuração extra necessária.

---

## Variáveis de ambiente (Vercel)

Em **Settings → Environment Variables** do projeto no Vercel:

| Variável | Valor |
|---|---|
| `VITE_IA_URL` | `https://turma-do-bem-ia.onrender.com` |
| `VITE_API_URL` | deixar vazio ou `http://localhost:8080/api` |

> Se usar ngrok para expor o Java: `VITE_API_URL=https://SEU-ID.ngrok-free.app/api`

---

## Projetos

| Projeto | Deploy | Tecnologia |
|---|---|---|
| `dnn-banca` | Vercel | React + Vite + TypeScript |
| `Sprint4-AI_Chatbot` | Render | Python + Flask + scikit-learn |
| `Sprint4-Java` | Local (rede FIAP) | Java + Quarkus + Oracle |

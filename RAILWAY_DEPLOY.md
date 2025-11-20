# 🚂 Deploy no Railway.app - Guia Completo

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (crie em https://github.com se não tiver)
2. ✅ Git instalado no Windows (baixe em https://git-scm.com/download/win)
3. ✅ Conta no Railway.app (crie em https://railway.app)

---

## 🎯 Passo 1: Subir o Código para o GitHub

### 1.1 Instalar o Git (se ainda não tiver)
- Baixe: https://git-scm.com/download/win
- Instale com configurações padrão
- **Feche e reabra o PowerShell** depois de instalar

### 1.2 Criar Repositório no GitHub
1. Acesse https://github.com
2. Faça login
3. Clique no **+** (canto superior direito) → **New repository**
4. Preencha:
   - **Repository name**: `Zion-Assessoria`
   - **Description**: "Sistema de consulta bachilleratos MEC Paraguay"
   - **Visibility**: **Private** (recomendado) ou Public
   - ❌ NÃO marque nenhuma opção adicional
5. Clique em **Create repository**
6. **Copie a URL** mostrada (ex: `https://github.com/DevFalcon22/Zion-Assessoria.git`)

### 1.3 Comandos Git no PowerShell

Abra o PowerShell e execute:

```powershell
# Navegar até o projeto
cd "c:\Users\NOTEBOOK\Desktop\Rico Assessoria\RicoAssessoriaMEC"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - Sistema Zion Assessoria MEC"

# Adicionar repositório remoto (USE A SUA URL DO GITHUB)
git remote add origin https://github.com/DevFalcon22/Zion-Assessoria.git

# Renomear branch para main
git branch -M main

# Enviar para GitHub
git push -u origin main
```

**Se pedir login:**
- Usuário: seu username do GitHub
- Senha: use um **Personal Access Token** (veja seção abaixo)

#### Como criar Personal Access Token:
1. GitHub → Settings (seu perfil)
2. Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Nome: "Railway Deploy"
5. Marque: **repo** (todas as opções)
6. Generate token
7. **Copie o token** (não conseguirá ver novamente!)
8. Use esse token como senha no Git

---

## 🚂 Passo 2: Deploy no Railway.app

### 2.1 Criar Conta no Railway
1. Acesse https://railway.app
2. Clique em **Login**
3. Escolha **Login with GitHub**
4. Autorize o Railway a acessar sua conta

### 2.2 Criar Novo Projeto

1. No dashboard do Railway, clique em **New Project**
2. Selecione **Deploy from GitHub repo**
3. Se for a primeira vez, clique em **Configure GitHub App**
   - Autorize o Railway
   - Selecione "All repositories" ou apenas "Zion-Assessoria"
4. Depois de autorizar, selecione o repositório **Zion-Assessoria**

### 2.3 Configurar o Backend

Railway vai detectar automaticamente o projeto Node.js.

1. Depois que o projeto for criado, clique no serviço criado
2. Vá na aba **Variables**
3. Adicione as seguintes variáveis:
   ```
   NODE_ENV=production
   DEBUG_PUPPETEER=false
   PORT=${{PORT}}
   ```
4. Clique em **Settings** (ícone de engrenagem)
5. Em **Deploy**:
   - **Root Directory**: deixe vazio (já configurado no railway.json)
   - **Start Command**: já configurado automaticamente
6. Volte para **Deployments** e aguarde o deploy finalizar

### 2.4 Gerar URL Pública

1. Na página do serviço, vá em **Settings**
2. Procure a seção **Networking**
3. Clique em **Generate Domain**
4. Uma URL será gerada (ex: `https://seu-projeto.up.railway.app`)
5. **COPIE ESSA URL** - você vai precisar!

---

## 🎨 Passo 3: Deploy do Frontend (Vercel)

O frontend vamos colocar na Vercel (grátis e otimizado para Next.js).

### 3.1 Criar Conta na Vercel
1. Acesse https://vercel.com
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub**
4. Autorize a Vercel

### 3.2 Importar Projeto

1. No dashboard da Vercel, clique em **Add New** → **Project**
2. Selecione o repositório **RicoAssessoriaMEC**
3. Configure:
   - **Framework Preset**: Next.js ✅ (detectado automaticamente)
   - **Root Directory**: clique em **Edit** e selecione `frontend`
   - **Build Command**: `npm run build` (já preenchido)
   - **Output Directory**: `.next` (já preenchido)

### 3.3 Configurar Variáveis de Ambiente

1. Ainda na tela de configuração, clique em **Environment Variables**
2. Adicione:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: A URL do Railway que você copiou (ex: `https://seu-projeto.up.railway.app`)
   - **Environment**: Production, Preview, Development (todos marcados)
3. Clique em **Add**

### 3.4 Deploy!

1. Clique em **Deploy**
2. Aguarde o build (1-2 minutos)
3. Quando terminar, clique em **Visit** para ver seu site!

---

## ✅ Passo 4: Testar Tudo

1. Acesse a URL da Vercel (seu site)
2. Teste uma consulta:
   - **Documento**: `2842080-2`
   - **Data**: `26/06/2003`
3. Clique em **Consultar**
4. Aguarde o processamento
5. Verifique se o PDF é baixado corretamente!

---

## 🔧 Resolução de Problemas

### ❌ Git não reconhecido
**Solução**: Instale o Git e reinicie o PowerShell

### ❌ "Permission denied" ao fazer push
**Solução**: Use Personal Access Token como senha, não sua senha do GitHub

### ❌ Deploy falha no Railway
**Solução**: 
- Verifique os logs em **Deployments** → clique no deploy → **View Logs**
- Certifique-se que as variáveis de ambiente estão configuradas

### ❌ Frontend não conecta ao backend
**Solução**: 
1. Abra o console do navegador (F12)
2. Verifique se a URL da API está correta
3. Vá na Vercel → Settings → Environment Variables
4. Verifique se `NEXT_PUBLIC_API_URL` está com a URL correta do Railway
5. Se mudou, faça um novo deploy: Deployments → ... → Redeploy

### ❌ PDF não é gerado
**Solução**:
- Verifique os logs do Railway
- Certifique-se que o Chromium foi instalado corretamente
- O `nixpacks.toml` já está configurado para instalar o Chromium

---

## 💰 Custos

### Railway:
- **Grátis**: $5 em créditos todo mês
- Uso típico deste projeto: $5-10/mês
- Sem uso, pode ficar nos créditos grátis

### Vercel:
- **100% Grátis** para projetos pessoais
- Sem limite de deploys
- Domínio personalizado grátis

---

## 🚀 Próximos Passos

### Domínio Personalizado

**Na Vercel:**
1. Settings → Domains
2. Add Domain
3. Digite seu domínio (ex: `consulta.ricoassessoria.com.br`)
4. Siga instruções para configurar DNS

**No Railway:**
1. Settings → Domains
2. Custom Domain
3. Digite o domínio (ex: `api.ricoassessoria.com.br`)
4. Configure o CNAME no seu provedor de domínio

### Monitoramento

1. Railway → Metrics: veja uso de CPU, RAM, requisições
2. Vercel → Analytics: veja visitantes, performance

### Atualizações Futuras

Sempre que fizer mudanças no código:

```powershell
cd "c:\Users\NOTEBOOK\Desktop\Rico Assessoria\RicoAssessoriaMEC"
git add .
git commit -m "Descrição da mudança"
git push
```

Railway e Vercel vão fazer deploy automaticamente! 🎉

---

## 📞 Suporte

- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Documentação Railway: https://docs.railway.app
- Documentação Vercel: https://vercel.com/docs

---

**🎉 Parabéns! Seu sistema está no ar!**

Criado por **Zion Assessoria** 🚀

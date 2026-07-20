# Agendador de Consultas Médicas

Protótipo de aplicação de agendamento de consultas médicas, estruturado como **microsserviços independentes**. Projeto de estudo/exercício de arquitetura. Persistência via PostgreSQL, **um banco de dados por microsserviço**.

> 🔒 **Protótipo de estudo — uso local apenas.** A chave JWT e as credenciais de banco (`postgres/postgres`) nos `appsettings` são valores de desenvolvimento e **não devem ser usados em produção**.

## Arquitetura

```
.
├── auth-service/       Microsserviço de autenticação (login + emissão de JWT)
├── scheduler-service/  Microsserviço de CRUD (Pacientes, Médicos, Consultas)
├── frontend/           Aplicação React que consome os dois serviços
└── docker-compose.yml  Bancos PostgreSQL de desenvolvimento (um por serviço)
```

Cada microsserviço é um projeto **independente**: possui sua própria solução `.csproj`/`.sln`, seu próprio `global.json`, seu próprio banco PostgreSQL e não compartilha código com o outro. A comunicação entre front-end e serviços é via HTTP, autenticada por JWT.

## Stack

| Camada | Tecnologia |
|---|---|
| Back-end | C# / .NET 8 (ASP.NET Core Web API) |
| Front-end | React + TypeScript (Vite) |
| Autenticação | JWT (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Persistência | PostgreSQL + Entity Framework Core (um banco por serviço) |
| API docs | Swagger/OpenAPI (somente em build `DEBUG`) |

## Microsserviços

### `auth-service` — porta 5001, banco `auth_db`
Autentica usuários e emite tokens JWT. Usuários fixos (seed):

| Email | Senha | Role |
|---|---|---|
| `admin@example.com` | `Admin@123` | Admin |
| `recepcao@example.com` | `Recepcao@123` | Recepcionista |

- `POST /api/auth/login` — autentica e retorna o token JWT
- `GET /api/auth/me` — retorna os dados do usuário autenticado (requer token)

### `scheduler-service` — porta 5002, banco `scheduler_db`
CRUD de Pacientes, Médicos e Consultas. Todos os endpoints exigem o JWT emitido pelo `auth-service` (mesma chave de assinatura em ambos via `appsettings.json`, sem chamada de rede entre os serviços).

- `GET/POST/PUT/DELETE /api/pacientes`
- `GET/POST/PUT/DELETE /api/medicos`
- `GET/POST/PUT/DELETE /api/consultas` (valida se o paciente e o médico informados existem antes de agendar)

### `frontend` — porta 5173
React com tela de login, CRUD de Consultas/Médicos/Pacientes e cliente HTTP que injeta o token JWT nas requisições ao `scheduler-service`.

## Como rodar localmente

**Pré-requisitos:** [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) · [Node.js 18+](https://nodejs.org/) · Docker Desktop

```bash
# 1) Suba os bancos (na raiz do projeto)
docker compose up -d          # auth-db → 5432 · scheduler-db → 5433
                              # migrations do EF Core são aplicadas no startup de cada serviço

# 2) auth-service
cd auth-service && dotnet run  # http://localhost:5001 (Swagger em /swagger, só em Debug)

# 3) scheduler-service
cd scheduler-service && dotnet run  # http://localhost:5002

# 4) frontend
cd frontend && npm install && npm run dev  # http://localhost:5173
```

Acesse http://localhost:5173 e faça login com um dos usuários acima.

```bash
docker compose down      # para os bancos (mantém os dados no volume)
docker compose down -v   # para e apaga os dados
```

## Observações importantes

- **Bancos separados por serviço:** `auth-service` e `scheduler-service` nunca acessam o banco um do outro, mantendo o isolamento entre os microsserviços.
- **Connection strings de desenvolvimento:** em `appsettings.Development.json` de cada serviço, com usuário/senha padrão do Postgres local (`postgres/postgres`) — válidas apenas para ambiente local.
- **Chave JWT de desenvolvimento:** fixa em `appsettings.json` de ambos os serviços, apenas para uso local/prototipagem.
- **Swagger restrito a DEBUG:** registro e middleware ficam dentro de blocos `#if DEBUG` em `Program.cs`; um build Release não expõe `/swagger`.
- **CORS:** liberado apenas para `http://localhost:5173`.
- Este README cobre apenas a **execução local**. O projeto não possui pipeline de deploy/hospedagem definido — onde e como publicar (incluindo os bancos) é uma decisão futura, a ser avaliada com cuidado antes de expor qualquer ambiente publicamente.

## Licença

[MIT](LICENSE).

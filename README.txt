AGENDADOR DE CONSULTAS MEDICAS
==============================

Prototipo de aplicacao de agendamento de consultas medicas, estruturado
como microsservicos independentes. Projeto de estudo/exercicio de
arquitetura. Persistencia via PostgreSQL, um banco de dados por
microsservico.


ARQUITETURA
-----------

.
|-- auth-service/       Microsservico de autenticacao (login + emissao de JWT)
|-- scheduler-service/  Microsservico de CRUD (Pacientes, Medicos, Consultas)
|-- frontend/           Aplicacao React que consome os dois servicos
`-- docker-compose.yml  Bancos PostgreSQL de desenvolvimento (um por servico)

Cada microsservico e um projeto INDEPENDENTE: possui sua propria solucao
.csproj/.sln, seu proprio global.json, seu proprio banco de dados
PostgreSQL e nao compartilha codigo com o outro. A comunicacao entre
front-end e servicos e via HTTP, autenticada por JWT.


STACK
-----

- Back-end: C# / .NET 8 (ASP.NET Core Web API)
- Front-end: React + TypeScript (Vite)
- Autenticacao: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- Persistencia: PostgreSQL + Entity Framework Core (um banco por
  microsservico)
- Swagger/OpenAPI disponivel somente em build DEBUG (compilado fora com
  #if DEBUG) - nao existe em builds Release/producao


MICROSSERVICOS
--------------

auth-service (porta 5001, banco auth_db)

  Responsavel por autenticar usuarios e emitir tokens JWT.

  Usuarios fixos, populados via migration/seed no banco:
    - admin@example.com / Admin@123 (role: Admin)
    - recepcao@example.com / Recepcao@123 (role: Recepcionista)

  Endpoints:
    - POST /api/auth/login  -> autentica e retorna o token JWT
    - GET  /api/auth/me     -> retorna os dados do usuario autenticado
                               (requer token)

scheduler-service (porta 5002, banco scheduler_db)

  Responsavel pelo CRUD de Pacientes, Medicos e Consultas. Todos os
  endpoints exigem o JWT emitido pelo auth-service (mesma chave de
  assinatura configurada em ambos via appsettings.json, sem chamada de
  rede entre os servicos).

    - GET/POST/PUT/DELETE /api/pacientes
    - GET/POST/PUT/DELETE /api/medicos
    - GET/POST/PUT/DELETE /api/consultas
      (valida se o paciente e o medico informados existem antes de
      agendar)

frontend (porta 5173)

  Aplicacao React com:
    - Tela de login
    - CRUD de Consultas, Medicos e Pacientes
    - Cliente HTTP que injeta o token JWT nas requisicoes ao
      scheduler-service


COMO RODAR LOCALMENTE
----------------------

Pre-requisitos:
  - .NET 8 SDK (https://dotnet.microsoft.com/download/dotnet/8.0)
  - Node.js 18+ (https://nodejs.org/)
  - Docker Desktop (para rodar o PostgreSQL localmente)

1) Suba os bancos de dados (na raiz do projeto):
   docker compose up -d

   Isso cria dois containers Postgres independentes:
     - auth-db       -> porta 5432 (banco auth_db)
     - scheduler-db  -> porta 5433 (banco scheduler_db)

   As migrations do Entity Framework sao aplicadas automaticamente
   quando cada servico inicia (nao e necessario rodar comando manual).

Abra mais tres terminais (um para cada parte):

2) Auth.Api
   cd auth-service
   dotnet run
   Disponivel em http://localhost:5001 (Swagger em /swagger, somente em
   build Debug)

3) Scheduler.Api
   cd scheduler-service
   dotnet run
   Disponivel em http://localhost:5002 (Swagger em /swagger, somente em
   build Debug)

4) Frontend
   cd frontend
   npm install
   npm run dev
   Disponivel em http://localhost:5173

Acesse http://localhost:5173 e faca login com um dos usuarios listados
acima.

Para parar e remover os bancos (mantendo os dados no volume Docker):
   docker compose down

Para apagar tambem os dados dos bancos:
   docker compose down -v


OBSERVACOES IMPORTANTES
------------------------

- Bancos separados por servico: auth-service e scheduler-service nunca
  acessam o banco um do outro, mantendo o isolamento entre os
  microsservicos.

- Connection strings de desenvolvimento: definidas em
  appsettings.Development.json de cada servico, com usuario/senha
  padrao do Postgres local (postgres/postgres) - validas apenas para
  ambiente local, nunca usar em producao.

- Chave JWT de desenvolvimento: a chave de assinatura em appsettings.json
  de ambos os servicos e fixa e serve apenas para uso local/prototipagem
  - nao deve ser usada em producao.

- Swagger restrito a DEBUG: o registro do Swagger e o middleware
  (UseSwagger/UseSwaggerUI) estao dentro de blocos #if DEBUG em
  Program.cs. Um build Release/producao nao expõe /swagger.

- CORS: liberado apenas para http://localhost:5173 (origem do front-end
  em desenvolvimento).

- Este README cobre apenas a execucao LOCAL. Este projeto nao possui
  pipeline de deploy/hospedagem definido ainda - a escolha de onde e
  como publicar a aplicacao (incluindo os bancos de dados) e uma
  decisao futura, a ser avaliada com cuidado antes de expor qualquer
  ambiente publicamente.

# GEROcuidado-APIUsuario

## CONFIGURAÇÃO

Definir valores iguais para os arquivos .env e docker-compose.

Arquivo .env:

    #POSTGRES
    DB_TYPE='postgres'
    DB_HOST='localhost'
    DB_USERNAME='postgres'
    DB_PASS='postgres'
    DB_DATABASE='gerocuidado-usuario-db'
    DB_PORT=5001

Arquivo .docker-compose, na seção **_environment_**:

    ...
    environment:
      - POSTGRES_DB=gerocuidado-usuario-db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ...

Da mesma forma, alterar os valores das portas terminadas em **_xx_** (i.e 30xx para 3001) para a porta desejada nos arquivos de compose, bem como no arquivo launch.json da pasta .vscode.

## AMBIENTES

### DEV

    ```bash
    docker-compose up
    ```

#### INSTALAR DEPENDÊNCIAS E CRIAR NOVAS FUNCIONALIDADES

```bash
docker-compose exec gerocuidado-usuario-api bash
nest g resource users
```

### TEST

- GERAL

  ```bash
  docker-compose -f docker-compose.test.yml up
  ```

  após em um novo terminal

  ```bash
  docker-compose -f docker-compose.test.yml exec gerocuidado-usuario-api-test bash
  cd /home/node/app
  npm run test
  npm run test:cov
  npm run test:e2e
  npm run test:e2e:cov
  ```

- UNIT

    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:

    ```bash
    TEST=unit docker-compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from gerocuidado-usuario-api-test
    ```

- E2E
    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:

    ```bash
    TEST=e2e docker-compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from gerocuidado-usuario-api-test
    ```

# ENVIRONMENTS VARIABLES

| ENV         | Descrição              | Valor Padrão           |
| ----------- | ---------------------- | ---------------------- |
| DB_TYPE     | tipo do banco          | postgres               |
| DB_HOST     | host do PostgreSQL     | localhost              |
| DB_USERNAME | usuário do PostgreSQL  | postgres               |
| DB_PASS     | senha do PostgreSQL    | postgres               |
| DB_DATABASE | database do PostgreSQL | gerocuidado-usuario-db |
| DB_PORT     | porta do PostgreSQL    | 5001                   |

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

    $ docker-compose up

#### INSTALAR DEPENDÊNCIAS E CRIAR NOVAS FUNCIONALIDADES

```bash
$ docker-compose exec gerocuidado-usuario-api bash
$ nest g resource users
```

### TEST

- DEV

  ```bash
  $ TEST=dev docker-compose -f docker-compose.check.yml up
  ```

  após em um novo terminal

  ```bash
  $ docker-compose -f docker-compose.check.yml exec gerocuidado-usuario-api-test bash
  $ npm run test
  $ npm run test:cov
  $ npm run test:e2e
  $ npm run test:e2e:cov
  ```

- UNIT

  Com o container de desenvolvimento em execução, acesse o container com o comando:

  ```bash
  $ docker-compose exec gerocuidado-usuario-api-test bash
  ```

  E execute os comandos de teste disponíveis no arquivo **_package.json_**, por exemplo:

  ```bash
  $ npm run test:watch
  ```

  - Execução única
    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:
    `bash $ TEST=unit docker-compose -f docker-compose.check.yml up --abort-on-container-exit --exit-code-from gerocuidado-usuario-api-test `

- E2E

  Suba o container específico para testes e2e, através do comando:

  ```bash
  $ docker-compose -f docker-compose.check.yml up
  ```

  E execute os comandos de teste e2e disponíveis no arquivo **_package.json_**, por exemplo:

  ```bash
  $ npm run test:e2e:watch
  ```

  - Execução única
    Para apenas rodar os testes unitários e sair do container rode o comando abaixo:
    `bash $ TEST=e2e docker-compose -f docker-compose.check.yml up --abort-on-container-exit --exit-code-from gerocuidado-usuario-api-test `

# ENVIRONMENTS VARIABLES

| ENV         | Descrição              | Valor Padrão |
| ----------- | ---------------------- | ------------ |
| DB_TYPE     | tipo do banco          |              |
| DB_HOST     | host do PostgreSQL     |              |
| DB_USERNAME | usuário do PostgreSQL  |              |
| DB_PASS     | senha do PostgreSQL    |              |
| DB_DATABASE | database do PostgreSQL |              |
| DB_PORT     | porta do PostgreSQL    | 5001         |

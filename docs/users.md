# users

Rotas de usuário

## Índice
- [/api/users](#apiusers)
  - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/users/auth](#apiusersauth)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/users/:id](#apiusersid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)


## /api/users

### Requisição

### Requisição HTTP

| Url          | Método HTTP |
|:-------------|:------------|
| `/api/users` | `POST`      |

### Corpo da requisiçao

| Argumentos | Exemplo        | Obrigatório        | Description      |
|:-----------|:---------------|:-------------------|:-----------------|
| `name`     | João           | :heavy_check_mark: | Nome do usuário  |
| `email`    | joao@email.com | :heavy_check_mark: | Email do usuário |
| `password` | pass           | :heavy_check_mark: | Senha do usuário |

### Execução
```bash
curl --location --request POST 'http://localhost:3000/api/users/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "João",
    "email": "joao@email.com",
    "password": "pass"
}'
```

## /api/users/auth

### Requisição

### Requisição HTTP

| Url               | Método HTTP |
|:------------------|:------------|
| `/api/users/auth` | `POST`      |

### Corpo da requisiçao

| Argumentos | Exemplo        | Obrigatório        | Description      |
|:-----------|:---------------|:-------------------|:-----------------|
| `email`    | joao@email.com | :heavy_check_mark: | Email do usuário |
| `password` | pass           | :heavy_check_mark: | Senha do usuário |

### Execução
```bash
curl --location --request POST 'http://localhost:3000/api/users/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "joao@email.com",
    "password": "pass"
}'
```

## /api/users/:id

### Requisição

### Requisição HTTP

| Url              | Método HTTP |
|:-----------------|:------------|
| `/api/users/:id` | `GET`       |

### Corpo da requisiçao

Não há necessidade.

### Execução
```bash
curl --location --request GET 'http://localhost:3000/api/users/{id}' \
--header 'Content-Type: application/json' 
```
# users

Rotas de poker

## Índice
- [/api/poker](#apipoker)
  - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/poker/:id](#apipokerid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/poker/:id/stories](#apipokeridstories)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)


## /api/poker

### Requisição

### Requisição HTTP

| Url          | Método HTTP |
|:-------------|:------------|
| `/api/poker` | `POST`      |

### Corpo da requisiçao

| Argumentos  | Exemplo          | Obrigatório        | Description               |
|:------------|:-----------------|:-------------------|:--------------------------|
| `name`      | Poker assíncrono | :heavy_check_mark: | Nome do poker             |
| `createdBy` | João             | :heavy_check_mark: | Usuário que criou o poker |

### Execução
```bash
curl --location --request POST 'http://localhost:3000/api/poker' \
--header 'Content-Type: application/json' \
--header 'Authorization: {token}' \
--data-raw '{
    "name": "Poker assíncrono",
    "createdBy": "João"
}'
```

## /api/poker/:id

### Requisição

### Requisição HTTP

| Url              | Método HTTP | Descrição                       |
|:-----------------|:------------|:--------------------------------|
| `/api/poker/:id` | `GET`       | Retorna as informações do Poker |
| `/api/poker/:id` | `DELETE`    | Deleta o poker                  |

### Corpo da requisiçao

Não há necessidade.

### Execução

```bash
curl --location --request GET 'http://localhost:3000/api/poker/{id}' \
--header 'Authorization: {token}'
```

```bash
curl --location --request DELETE 'http://localhost:3000/api/poker/{id}' \
--header 'Authorization: {token}'
```

## /api/poker/:id/stories

### Requisição

### Requisição HTTP

| Url                      | Método HTTP |
|:-------------------------|:------------|
| `/api/poker/:id/stories` | `GET`       |

### Corpo da requisiçao

Não há necessidade.

### Execução
```bash
curl --location --request GET 'http://localhost:3000/api/poker/{id}stories' \
--header 'Authorization: {token}'
```
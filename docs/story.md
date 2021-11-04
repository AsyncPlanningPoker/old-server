# users

Rotas de usuário

## Índice
- [/api/story](#apistory)
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


## /api/story

### Requisição

### Requisição HTTP

| Url          | Método HTTP |
|:-------------|:------------|
| `/api/story` | `POST`      |

### Corpo da requisiçao

| Argumentos    | Exemplo                    | Obrigatório        | Description           |
|:--------------|:---------------------------|:-------------------|:----------------------|
| `name`        | Bugfix usuário             | :heavy_check_mark: | Nome da história      |
| `description` | Feature para arrumar o bug | :heavy_check_mark: | Descrição da história |
| `idPoker`     | {id}                       | :heavy_check_mark: | Id do Poker           |

### Execução
```bash
curl --location --request POST 'http://localhost:3000/api/users/' \
--header 'Content-Type: application/json' \
--header 'Authorization: {token}' \
--data-raw '{
    "name": "Bugfix usuário ",
    "description": "Feature para arrumar o bug",
    "idPoker": "{id}"
}'
```

## /api/poker/:id

### Requisição

### Requisição HTTP

| Url              | Método HTTP | Descrição                          |
|:-----------------|:------------|:-----------------------------------|
| `/api/story/:id` | `GET`       | Retorna as informações da História |
| `/api/story/:id` | `DELETE`    | Deleta a história                  |

### Corpo da requisiçao

Não há necessidade.

### Execução

```bash
curl --location --request GET 'http://localhost:3000/api/story/{id}' \
--header 'Authorization: {token}'
```

```bash
curl --location --request DELETE 'http://localhost:3000/api/story/{id}' \
--header 'Authorization: {token}'
```
```
# vote

Rotas de votos do poker

## Índice
- [/api/vote](#apivote)
  - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
      -[Requisição POST](#requisição-post)
      -[Requisição DELETE](#requisição-delete)
    - [Execução](#execução)
      -[POST](#post)
      -[DELETE](#delete)
- [/api/vote/:id](#apivoteid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/vote/deletePoker/:id](#apivotedeletepokerid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/vote/deleteStory/:id](#apivotedeletestoryid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)
- [/api/vote/deleteUser/:id](#apivotedeleteuserid)
    - [Requisição](#requisição)
    - [Requisição HTTP](#requisição-http)
    - [Corpo da requisiçao](#corpo-da-requisiçao)
    - [Execução](#execução)


## /api/vote

### Requisição

### Requisição HTTP

| Url          | Método HTTP |
|:-------------|:------------|
| `/api/vote`  | `POST`      |
| `/api/vote/` | `DELETE`    |

### Corpo da requisiçao

#### Requisição POST
| Argumentos | Exemplo   | Obrigatório        | Description    |
|:-----------|:----------|:-------------------|:---------------|
| `idStory`  | {idStory} | :heavy_check_mark: | Id da história |
| `idUser`   | {idUser}  | :heavy_check_mark: | Id do usuário  |
| `idPoker`  | {idPoker} | :heavy_check_mark: | Id do poker    |
| `vote`     | 1         | :heavy_check_mark: | Id do poker    |

#### Requisição DELETE

| Argumentos | Exemplo   | Obrigatório        | Description   |
|:-----------|:----------|:-------------------|:--------------|
| `idUser`   | {idUser}  | :heavy_check_mark: | Id do usuário |
| `idPoker`  | {idPoker} | :heavy_check_mark: | Id do poker   |

### Execução

#### POST

```bash
curl --location --request POST 'http://localhost:3000/api/vote/' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "idStory":"{idStory}",
    "idUser": "{idUser}",
    "idPoker": "{idPoker}",
    "vote": "1"
}'
```

#### DELETE

```bash
curl --location --request POST 'http://localhost:3000/api/vote/' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "idUser": "{idUser}",
    "idPoker": "{idPoker}",
}'
```

## /api/vote/:id

### Requisição

### Requisição HTTP

| Url             | Método HTTP |
|:----------------|:------------|
| `/api/vote/:id` | `GET`       |

### Corpo da requisiçao

Não há necessidade.

### Execução

```bash
curl --location --request GET 'http://localhost:3000/api/vote/{id}' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json' 
```

## /api/vote/deletePoker/:id

### Requisição

### Requisição HTTP

| Url                         | Método HTTP |
|:----------------------------|:------------|
| `/api/vote/deletePoker/:id` | `DELETE`    |

### Corpo da requisiçao

| Argumentos | Exemplo   | Obrigatório        | Description   |
|:-----------|:----------|:-------------------|:--------------|
| `idUser`   | {idUser}  | :heavy_check_mark: | Id do usuário |
| `idPoker`  | {idPoker} | :heavy_check_mark: | Id do poker   |

### Execução

```bash
curl --location --request POST 'http://localhost:3000/api/vote/deletePoker/{id}' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "idUser": "{idUser}",
    "idPoker": "{idPoker}",
}'
```

## /api/vote/deleteStory/:id

### Requisição

### Requisição HTTP

| Url                         | Método HTTP |
|:----------------------------|:------------|
| `/api/vote/deleteStory/:id` | `DELETE`    |

### Corpo da requisiçao

| Argumentos | Exemplo   | Obrigatório        | Description   |
|:-----------|:----------|:-------------------|:--------------|
| `idUser`   | {idUser}  | :heavy_check_mark: | Id do usuário |
| `idPoker`  | {idPoker} | :heavy_check_mark: | Id do poker   |

### Execução

```bash
curl --location --request POST 'http://localhost:3000/api/vote/deleteStory/{id}' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "idUser": "{idUser}",
    "idPoker": "{idPoker}",
}'
```

## /api/vote/deleteUser/:id

### Requisição

### Requisição HTTP

| Url                         | Método HTTP |
|:----------------------------|:------------|
| `/api/vote/deleteUser/:id` | `DELETE`    |

### Corpo da requisiçao

Não há necessidade.

### Execução

```bash
curl --location --request POST 'http://localhost:3000/api/vote/deleteUser/{id}' \
--header 'Authorization: {token}' \
--header 'Content-Type: application/json'
```

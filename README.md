

# Api express com MongoDb Atlas

Modelo de api com autenticação de usuário e token de autenticação.

## Funcionalidades

- Cria usuário
- Login com token de autenticação
- Restringe o conteudo de acordo com a role ou a ausência dela

## Desenvolvimento

### Ambiente
NodeJs
### Database
MongoDb
### Dependências
bcryptjs, cookie-session, cors, express, jsonwebtoken, mongoose, uuid


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/hardcore3m/api-node-mongodb.git
```

Entre no diretório do projeto

```bash
  cd api-node-mongodb
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```


## Documentação da API

#### Autenticação de usuário

```http
  POST /api/auth/signin
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**  |
| `password` | `string` | **Obrigatório**  |

#### Inscrição de usuário

```http
  POST /api/auth/signup
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**  |
| `email` | `string` | **Obrigatório**  |
| `password` | `string` | **Obrigatório**  |
| `roles` | `array` | Retorna como padrão a role "user"  |

```http
  POST /api/auth/signout
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**  |

| header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `token` | `x-access-token` | **Cookie Obrigatório**  |


#### Retorna um item

```http
  GET /api/test/user
```

| header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `token` | `x-access-token` | **Cookie Obrigatório**  |

```http
  GET /api/test/mod
```

| header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `token` | `x-access-token` | **Cookie Obrigatório** acesso somente a moderadores  |

```http
  GET /api/test/admin
```

| header   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `token` | `x-access-token` | **Cookie Obrigatório** Acesso somente a administradores  |




# Order API

API RESTful para gerenciamento de pedidos, construída com **Node.js**, **Express**, **PostgreSQL**, **Sequelize**, **JWT** para autenticação e **Swagger** para documentação interativa.

---

## Tecnologias Usadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Swagger](https://swagger.io/)

---

## Estrutura do Projeto

JITTERBIT_PROJECT/
├── node_modules/
├── src/
│ ├── controllers/
│ │ └── server.js
│ ├── domain/
│ │ ├── auth.js
│ │ └── db.js
│ ├── models/
│ │ ├── item.js
│ │ └── order.js
│ ├── routes/
│ │ ├── order.js
│ │ └── swagger.js
├── package.json
├── package-lock.json
└── README.md


1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/jitterbit_project.git
```

## Instale as dependências:
```bash
npm install
```

## Crie o banco no PostgreSQL:
```bash
CREATE DATABASE orders_db;
```

## Inicie o servidor:
```bash
npm start
```

## Servidor disponível em:
```bash
http://localhost:3000
```

## Swagger disponível em:
```bash
http://localhost:3000/docs
```


import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "orders_db",
  "postgres",
  "postgres",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL conectado");

    await sequelize.sync({ alter: true });
    console.log("Models sincronizados");
  } catch (err) {
    console.error("Erro no PostgreSQL:", err);
  }
}

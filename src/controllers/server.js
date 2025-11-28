import express from "express";
import cors from "cors";

import { connectDB } from "../domain/db.js";
import orderRoutes from "../routes/order.js";
import { login } from "../domain/auth.js";
import { setupSwagger } from "../swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", login);

app.use(orderRoutes);

setupSwagger(app);

connectDB();

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
    console.log("Swagger: http://localhost:3000/docs");
});

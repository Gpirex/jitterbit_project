import { DataTypes } from "sequelize";
import { sequelize } from "../domain/db.js";
import { Order } from "./order.js";

export const Item = sequelize.define("Item", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Relacionamento 1:N
Order.hasMany(Item, {
    foreignKey: "orderId",
    onDelete: "CASCADE"
});

Item.belongsTo(Order, { foreignKey: "orderId" });

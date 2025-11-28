import { DataTypes } from "sequelize";
import { sequelize } from "../domain/db.js";

export const Order = sequelize.define("Order", {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

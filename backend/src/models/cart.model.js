import { pool } from "../db/pool.js";

/**
 * 🔹 Obtiene el carrito por clerkId o lo crea si no existe
 */
export const getOrCreateCart = async ({ userId, clerkId }) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM carts WHERE clerk_id = $1",
      [clerkId]
    );

    if (rows.length > 0) {
      return rows[0];
    }

    const newCart = await pool.query(
      `
      INSERT INTO carts (user_id, clerk_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, clerkId]
    );

    return newCart.rows[0];
  } catch (error) {
    console.error("❌ Error getOrCreateCart:", error);
    throw error;
  }
};

/**
 * 🔹 Agrega un producto al carrito (suma cantidad si ya existe)
 */
export const addToCart = async ({ cartId, productId, quantity = 1 }) => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $3
      RETURNING *
      `,
      [cartId, productId, quantity]
    );

    return rows[0];
  } catch (error) {
    console.error("❌ Error addToCart:", error);
    throw error;
  }
};

/**
 * 🔹 Devuelve el carrito completo con productos
 */
export const getCartByClerkId = async (clerkId) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        c.id AS cart_id,
        ci.id AS item_id,
        p.id AS product_id,
        p.nombre,
        p.precio,
        ci.quantity,
        (p.precio * ci.quantity) AS subtotal
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN productos p ON p.id = ci.product_id
      WHERE c.clerk_id = $1
      ORDER BY ci.id
      `,
      [clerkId]
    );

    return rows;
  } catch (error) {
    console.error("❌ Error getCartByClerkId:", error);
    throw error;
  }
};

/**
 * 🔹 Elimina un producto del carrito
 */
export const removeFromCart = async ({ cartId, productId }) => {
  try {
    await pool.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1 AND product_id = $2
      `,
      [cartId, productId]
    );

    return { message: "Producto eliminado del carrito" };
  } catch (error) {
    console.error("❌ Error removeFromCart:", error);
    throw error;
  }
};

/**
 * 🔹 Vacía el carrito completo
 */
export const clearCart = async (cartId) => {
  try {
    await pool.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    return { message: "Carrito vaciado correctamente" };
  } catch (error) {
    console.error("❌ Error clearCart:", error);
    throw error;
  }
};

import { pool } from "../db/pool.js";

/**
 * ✅ Crear orden completa
 */
export const createOrder = async ({
  userId,
  clerkId,
  items,
  shippingAddress,
  totalPrice,
  paymentResult,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🧾 Crear orden
    const orderRes = await client.query(
      `
      INSERT INTO orders (
        user_id,
        clerk_id,
        total_price,
        payment_id,
        payment_status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        userId,
        clerkId,
        totalPrice,
        paymentResult?.id || null,
        paymentResult?.status || null,
      ]
    );

    const order = orderRes.rows[0];

    // 📦 Items
    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          name,
          price,
          quantity,
          image
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.name,
          item.price,
          item.quantity,
          item.image,
        ]
      );
    }

    // 🚚 Dirección de envío
    const {
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
    } = shippingAddress;

    await client.query(
      `
      INSERT INTO shipping_addresses (
        order_id,
        full_name,
        street_address,
        city,
        state,
        zip_code,
        phone_number
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        order.id,
        fullName,
        streetAddress,
        city,
        state,
        zipCode,
        phoneNumber,
      ]
    );

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error createOrder:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * ✅ Obtener orden completa por ID
 */
export const getOrderById = async (orderId) => {
  const orderRes = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [orderId]
  );

  if (orderRes.rows.length === 0) return null;

  const itemsRes = await pool.query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [orderId]
  );

  const shippingRes = await pool.query(
    "SELECT * FROM shipping_addresses WHERE order_id = $1",
    [orderId]
  );

  return {
    ...orderRes.rows[0],
    items: itemsRes.rows,
    shippingAddress: shippingRes.rows[0],
  };
};

/**
 * ✅ Cambiar estado de orden
 */
export const updateOrderStatus = async (orderId, status) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET status = $1,
        shipped_at = CASE WHEN $1 = 'shipped' THEN NOW() ELSE shipped_at END,
        delivered_at = CASE WHEN $1 = 'delivered' THEN NOW() ELSE delivered_at END,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, orderId]
  );

  return result.rows[0];
};

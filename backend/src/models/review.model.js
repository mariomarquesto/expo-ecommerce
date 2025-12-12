import { pool } from "../db/pool.js";

/**
 * ✅ Crear review y recalcular rating del producto
 */
export const createReview = async ({
  productId,
  userId,
  orderId,
  rating,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Crear review
    const reviewRes = await client.query(
      `
      INSERT INTO reviews (
        product_id,
        user_id,
        order_id,
        rating
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [productId, userId, orderId, rating]
    );

    // Recalcular promedio y total
    const statsRes = await client.query(
      `
      SELECT
        COUNT(*)::INTEGER AS total_reviews,
        AVG(rating)::NUMERIC(2,1) AS average_rating
      FROM reviews
      WHERE product_id = $1
      `,
      [productId]
    );

    const { total_reviews, average_rating } = statsRes.rows[0];

    // Actualizar producto
    await client.query(
      `
      UPDATE products
      SET
        total_reviews = $1,
        average_rating = $2,
        updated_at = NOW()
      WHERE id = $3
      `,
      [total_reviews, average_rating, productId]
    );

    await client.query("COMMIT");
    return reviewRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error createReview:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * ✅ Obtener reviews por producto
 */
export const getReviewsByProduct = async (productId) => {
  const { rows } = await pool.query(
    `
    SELECT
      r.id,
      r.rating,
      r.created_at,
      u.name AS user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
    `,
    [productId]
  );

  return rows;
};

/**
 * ✅ Eliminar review (admin)
 */
export const deleteReview = async (id) => {
  await pool.query(
    "DELETE FROM reviews WHERE id = $1",
    [id]
  );

  return { message: "Review eliminada correctamente" };
};

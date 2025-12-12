import { pool } from "../db/pool.js";

/**
 * ✅ Crear usuario
 */
export const createUser = async ({ email, name, imageUrl, clerkId }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO users (email, name, image_url, clerk_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [email, name, imageUrl, clerkId]
  );

  return rows[0];
};

/**
 * ✅ Buscar usuario por clerkId
 */
export const getUserByClerkId = async (clerkId) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE clerk_id = $1`,
    [clerkId]
  );

  return rows[0];
};

/**
 * ✅ Agregar dirección
 */
export const addUserAddress = async (userId, address) => {
  const {
    label,
    fullName,
    streetAddress,
    city,
    state,
    zipCode,
    phoneNumber,
    isDefault = false,
  } = address;

  // si es default, desmarcar las demás
  if (isDefault) {
    await pool.query(
      `UPDATE user_addresses SET is_default = false WHERE user_id = $1`,
      [userId]
    );
  }

  const { rows } = await pool.query(
    `
    INSERT INTO user_addresses (
      user_id,
      label,
      full_name,
      street_address,
      city,
      state,
      zip_code,
      phone_number,
      is_default
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      userId,
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    ]
  );

  return rows[0];
};

/**
 * ✅ Obtener direcciones del usuario
 */
export const getUserAddresses = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM user_addresses
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC
    `,
    [userId]
  );

  return rows;
};

/**
 * ✅ Wishlist
 */
export const addToWishlist = async (userId, productId) => {
  const { rows } = await pool.query(
    `
    INSERT INTO wishlists (user_id, product_id)
    VALUES ($1,$2)
    ON CONFLICT DO NOTHING
    RETURNING *
    `,
    [userId, productId]
  );

  return rows[0];
};

export const removeFromWishlist = async (userId, productId) => {
  await pool.query(
    `
    DELETE FROM wishlists
    WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId]
  );
};

export const getWishlist = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT p.*
    FROM wishlists w
    JOIN products p ON p.id = w.product_id
    WHERE w.user_id = $1
    `,
    [userId]
  );

  return rows;
};

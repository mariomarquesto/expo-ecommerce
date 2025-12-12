import { pool } from "../db/pool.js";

/**
 * ✅ Crear producto con imágenes
 */
export const createProduct = async ({
  name,
  description,
  price,
  stock,
  category,
  images = [],
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Crear producto
    const productRes = await client.query(
      `
      INSERT INTO products (
        name,
        description,
        price,
        stock,
        category
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, description, price, stock, category]
    );

    const product = productRes.rows[0];

    // Guardar imágenes
    for (const img of images) {
      await client.query(
        `
        INSERT INTO product_images (product_id, image_url)
        VALUES ($1, $2)
        `,
        [product.id, img]
      );
    }

    await client.query("COMMIT");
    return product;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error createProduct:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * ✅ Obtener todos los productos con imágenes
 */
export const getAllProducts = async () => {
  const { rows } = await pool.query(`
    SELECT
      p.*,
      COALESCE(
        json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
        '[]'
      ) AS images
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return rows;
};

/**
 * ✅ Obtener producto por ID
 */
export const getProductById = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT
      p.*,
      COALESCE(
        json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
        '[]'
      ) AS images
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id
    `,
    [id]
  );

  return rows[0] || null;
};

/**
 * ✅ Actualizar producto
 */
export const updateProduct = async (id, data) => {
  const { name, description, price, stock, category } = data;

  const { rows } = await pool.query(
    `
    UPDATE products
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      price = COALESCE($3, price),
      stock = COALESCE($4, stock),
      category = COALESCE($5, category),
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [name, description, price, stock, category, id]
  );

  return rows[0];
};

/**
 * ✅ Eliminar producto
 */
export const deleteProduct = async (id) => {
  await pool.query(
    "DELETE FROM products WHERE id = $1",
    [id]
  );

  return { message: "Producto eliminado correctamente" };
};

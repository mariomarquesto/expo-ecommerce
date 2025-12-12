import pool from "../db/pool.js";

const seedProducts = async () => {
  try {
    console.log("⏳ Conectando a PostgreSQL...");

    // Limpia la tabla
    await pool.query("DELETE FROM products;");

    console.log("🗑️ Tabla 'products' vaciada.");

    // Inserta los productos
    await pool.query(`
      INSERT INTO products (
        name,
        description,
        price,
        stock,
        category,
        images,
        average_rating,
        total_reviews
      ) VALUES
      (
        'Wireless Bluetooth Headphones',
        'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and travelers.',
        149.99, 50, 'Electronics',
        ARRAY[
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        4.5, 128
      ),
      (
        'Smart Watch Series 5',
        'Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist.',
        299.99, 35, 'Electronics',
        ARRAY[
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'
        ],
        4.7, 256
      ),
      (
        'Leather Crossbody Bag',
        'Handcrafted genuine leather bag with adjustable strap. Features multiple compartments and elegant design perfect for daily use.',
        89.99, 25, 'Fashion',
        ARRAY[
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500'
        ],
        4.3, 89
      ),
      (
        'Running Shoes - Pro Edition',
        'Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for performance and comfort during long runs.',
        129.99, 60, 'Sports',
        ARRAY[
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
        ],
        4.6, 342
      ),
      (
        'Bestselling Mystery Novel',
        'A gripping psychological thriller that will keep you on the edge of your seat. New York Times bestseller with over 1 million copies sold.',
        24.99, 100, 'Books',
        ARRAY[
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'
        ],
        4.8, 1243
      ),
      (
        'Portable Bluetooth Speaker',
        'Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and durable design. Perfect for outdoor adventures.',
        79.99, 45, 'Electronics',
        ARRAY[
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
          'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500'
        ],
        4.4, 167
      ),
      (
        'Classic Denim Jacket',
        'Timeless denim jacket with vintage wash and comfortable fit. A wardrobe essential that pairs perfectly with any outfit.',
        69.99, 40, 'Fashion',
        ARRAY[
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500'
        ],
        4.2, 95
      ),
      (
        'Yoga Mat Pro',
        'Extra-thick non-slip yoga mat with carrying strap. Eco-friendly material provides excellent cushioning and grip for all yoga styles.',
        49.99, 75, 'Sports',
        ARRAY[
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500'
        ],
        4.5, 203
      ),
      (
        'Mechanical Keyboard RGB',
        'Gaming keyboard with customizable RGB lighting, mechanical switches, and programmable keys. Built for gamers and typing enthusiasts.',
        119.99, 30, 'Electronics',
        ARRAY[
          'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
        ],
        4.7, 421
      ),
      (
        'Coffee Table Book Collection',
        'Stunning photography book featuring architecture and design from around the world. Hardcover edition with 300+ pages of inspiration.',
        39.99, 55, 'Books',
        ARRAY[
          'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500'
        ],
        4.6, 134
      );
    `);

    console.log("✅ Seed completado correctamente.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error ejecutando seed:", error);
    process.exit(1);
  }
};

seedProducts();

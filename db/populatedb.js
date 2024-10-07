import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const SQL = `
    CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255)
    );

    INSERT INTO category (name, description)
    VALUES
        ('Lifestyle', 'Shoes for daily wear'),
        ('Running', 'Shoes for running');

    CREATE TABLE IF NOT EXISTS item (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
        category_id INTEGER NOT NULL,
        size VARCHAR(255),
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );

    INSERT INTO item (name, brand, price, stock_quantity, category_id, size)
    VALUES
        ('Nike Air Max', 'Nike', 120.00, 3, 1, '9, 9.5, 10'),
        ('Nike Alphafly 3', 'Nike', 310.00, 1, 2, '9.5'),
        ('Adidas Adizero Adios Pro 3', 'Adidas', 250.00, 2, 2, '9, 10');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  });

  try {
    await client.connect();
    await client.query(SQL);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await client.end();
  }
}

main();

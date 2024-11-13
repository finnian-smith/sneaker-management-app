import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const SQL = `
    CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        image_url VARCHAR(255),
        tag_color VARCHAR(7)
    );

    INSERT INTO category (name, description, image_url, tag_color)
    VALUES
        ('Lifestyle', 'Shoes for daily wear', 'https://images.unsplash.com/photo-1721983031356-4b82827527e8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '#B1B1B1'),
        ('Running', 'Shoes for running', 'https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_775,c_limit/52e409b4-9c3a-418c-ad86-e319498630f0/how-to-choose-running-shoes.jpg', '#FF5733');

    CREATE TABLE IF NOT EXISTS item (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
        category_id INTEGER NOT NULL,
        size VARCHAR(255),
        image_url VARCHAR(255),
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );

    INSERT INTO item (name, brand, price, stock_quantity, category_id, size, image_url)
    VALUES
        ('Nike Air Max', 'Nike', 120.00, 3, 1, '9, 9.5, 10', 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/e7669ab1-f716-428a-b8c3-ddc47d18b68c/NIKE+AIR+MAX+1.png'),
        ('Nike Alphafly 3', 'Nike', 310.00, 1, 2, '9.5', 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/5df9a673-2191-4148-8a17-b4b57a241827/W+AIR+ZM+ALPHAFLY+NEXT%25+3+OLY.png'),
        ('Adidas Adizero Adios Pro 3', 'Adidas', 250.00, 2, 2, '9, 10', 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/75d35aae620f4c529054f83b9bfc9b29_9366/Adizero_Adios_Pro_3_Shoes_Blue_JH9636_01_00_standard.jpg');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("done");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await client.end();
  }
}

main();

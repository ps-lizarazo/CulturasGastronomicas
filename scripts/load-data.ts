import * as fs from 'fs';
import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'cultura_gastronomica',
  password: 'postgres',
  port: 5432,
});

// Execute sql file using client
const executeSqlFile = async (filePath: string) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
};

const basePath = './scripts/data/';
const executeSqlFiles = async () => {
  await executeSqlFile(`${basePath}/categoriasfake-data.sql`);
  await executeSqlFile(`${basePath}/paisesfake-data.sql`);
  await executeSqlFile(`${basePath}/ciudadesfake-data.sql`);
  await executeSqlFile(`${basePath}/culturasGastronomicasfake-data.sql`);
  await executeSqlFile(`${basePath}/paisCulturaGastronomicafake-data.sql`);
  await executeSqlFile(`${basePath}/restaurantesfake-data.sql`);
  await executeSqlFile(`${basePath}/estrellasMichelinfake-data.sql`);
  await executeSqlFile(`${basePath}/productosfake-data.sql`);
  await executeSqlFile(`${basePath}/productoCulturaGastronomicafake-data.sql`);
  await executeSqlFile(`${basePath}/recetasfake-data.sql`);
  await executeSqlFile(
    `${basePath}/restauranteCulturaGastronomicafake-data.sql`,
  );
};

client.connect().then(async () => {
  await executeSqlFiles();
  await client.end();
});

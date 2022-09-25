import { faker } from '@faker-js/faker';
import * as fs from 'fs';

// Define Constants
const recordsToGenerate = 50000;
const fileName = 'fake-data.sql';

// Create a function that generates 50 thousand records of fake data using faker library
function generateFakeData(
  count: number,
  generationFunction,
  parentId = '',
  records = [],
) {
  for (let i = 0; i < count; i++) {
    records.push(generationFunction(parentId));
  }
  return records;
}

function generateCategoriaRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.random.word(),
  };
}

function generateProductoRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.name.firstName(),
    descripcion: faker.random.words(),
    historia: faker.random.words(),
    categoria: parentId,
  };
}

function generatePaisRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.address.country(),
  };
}

function generateCiudadRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.address.city(),
    pais: parentId,
  };
}

function generateRestaurante(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.name.firstName(),
    paisId: parentId,
  };
}

function generateCulturaGastronomicaRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.random.word(),
    descripcion: faker.random.words(),
  };
}

function generateRecetaRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    nombre: faker.name.firstName(),
    descripcion: faker.random.words(),
    imageUrl: faker.image.imageUrl(),
    preparacion: faker.random.words(),
    preparacionUrl: faker.internet.url(),
    culturaGastronomicaId: parentId,
  };
}

function generateEstrellasMichelinRow(parentId) {
  return {
    id: faker.datatype.uuid(),
    fechaConsecucion: faker.date.past(),
    restauranteId: parentId,
  };
}

function main() {
  const basePath = './scripts/data/';
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  // Delete all files in basePath
  fs.readdirSync(basePath).forEach((file) => {
    fs.writeFileSync(`${basePath}${file}`, '');
  });

  const categorias_filename = basePath + 'categorias' + fileName;
  fs.appendFileSync(fileName, '');
  const fakeCategorias = generateFakeData(
    recordsToGenerate,
    generateCategoriaRow,
  );

  fakeCategorias.forEach((categoria) => {
    const sql = `INSERT INTO categoria_entity (id, nombre) VALUES ('${categoria.id}', '${categoria.nombre}');`;
    fs.appendFileSync(categorias_filename, sql + '\n');
  });

  const productos_filename = basePath + 'productos' + fileName;
  const fakeProductos = generateFakeData(
    recordsToGenerate,
    generateProductoRow,
    fakeCategorias[0].id,
  );

  fakeProductos.forEach((producto) => {
    const sql = `INSERT INTO producto_entity (id, nombre, descripcion, historia, "categoriaId") VALUES ('${producto.id}', '${producto.nombre}', '${producto.descripcion}', '${producto.historia}', '${producto.categoria}');`;
    fs.appendFileSync(productos_filename, sql + '\n');
  });

  const paises_filename = basePath + 'paises' + fileName;

  const fakePaises = generateFakeData(recordsToGenerate, generatePaisRow);

  fakePaises.forEach((pais) => {
    const sql = `INSERT INTO pais_entity (id, nombre) VALUES ('${pais.id}', '${pais.nombre}');`;
    fs.appendFileSync(paises_filename, sql + '\n');
  });

  const ciudades_filename = basePath + 'ciudades' + fileName;
  const fakeCiudades = generateFakeData(
    recordsToGenerate,
    generateCiudadRow,
    fakePaises[0].id,
  );

  fakeCiudades.forEach((ciudad) => {
    const sql = `INSERT INTO ciudad_entity (id, nombre, "paisId") VALUES ('${ciudad.id}', '${ciudad.nombre}', '${ciudad.pais}');`;
    fs.appendFileSync(ciudades_filename, sql + '\n');
  });

  const restaurantes_filename = basePath + 'restaurantes' + fileName;
  const fakeRestaurantes = generateFakeData(
    recordsToGenerate,
    generateRestaurante,
    fakeCiudades[0].id,
  );

  fakeRestaurantes.forEach((restaurante) => {
    const sql = `INSERT INTO restaurante_entity (id, nombre, "ciudadId") VALUES ('${restaurante.id}', '${restaurante.nombre}', '${restaurante.ciudadId}');`;
    fs.appendFileSync(restaurantes_filename, sql + '\n');
  });

  const culturasGastronomicas_filename =
    basePath + 'culturasGastronomicas' + fileName;
  const fakeCulturasGastronomicas = generateFakeData(
    recordsToGenerate,
    generateCulturaGastronomicaRow,
  );

  fakeCulturasGastronomicas.forEach((culturaGastronomica) => {
    const sql = `INSERT INTO cultura_gastronomica_entity (id, nombre, descripcion) VALUES ('${culturaGastronomica.id}', '${culturaGastronomica.nombre}', '${culturaGastronomica.descripcion}');`;
    fs.appendFileSync(culturasGastronomicas_filename, sql + '\n');
  });

  const recetas_filename = basePath + 'recetas' + fileName;
  const fakeRecetas = generateFakeData(
    recordsToGenerate,
    generateRecetaRow,
    fakeCulturasGastronomicas[0].id,
  );

  fakeRecetas.forEach((receta) => {
    const sql = `INSERT INTO receta_entity (id, nombre, descripcion, "imageUrl", preparacion, "preparacionUrl", "culturaGastronomicaId") VALUES ('${receta.id}', '${receta.nombre}', '${receta.descripcion}', '${receta.imageUrl}', '${receta.preparacion}', '${receta.preparacionUrl}', '${receta.culturaGastronomicaId}');`;
    fs.appendFileSync(recetas_filename, sql + '\n');
  });

  const estrellasMichelin_filename = basePath + 'estrellasMichelin' + fileName;
  const fakeEstrellasMichelin = generateFakeData(
    recordsToGenerate,
    generateEstrellasMichelinRow,
    fakeRestaurantes[0].id,
  );

  fakeEstrellasMichelin.forEach((estrellaMichelin) => {
    const sql = `INSERT INTO estrellas_michelin_entity (id, "fechaConsecucion", "restauranteId") VALUES ('${estrellaMichelin.id}', '${estrellaMichelin.fechaConsecucion}', '${estrellaMichelin.restauranteId}');`;
    fs.appendFileSync(estrellasMichelin_filename, sql + '\n');
  });

  // Pais-culturaGastronomica asociaciones
  const paisCulturaGastronomica_filename =
    basePath + 'paisCulturaGastronomica' + fileName;
  fakeCulturasGastronomicas.forEach((culturaGastronomica) => {
    const sql = `INSERT INTO cultura_gastronomica_entity_paises_pais_entity ("culturaGastronomicaEntityId","paisEntityId") VALUES ('${culturaGastronomica.id}', '${fakePaises[0].id}');`;
    fs.appendFileSync(paisCulturaGastronomica_filename, sql + '\n');
  });

  // Restaurante-CulturaGastronomica asociaciones
  const restauranteCulturaGastronomica_filename =
    basePath + 'restauranteCulturaGastronomica' + fileName;
  fakeCulturasGastronomicas.forEach((culturaGastronomica) => {
    const sql = `INSERT INTO res_ent_cul_gas_cul_gas_ent ("restauranteEntityId","culturaGastronomicaEntityId") VALUES ('${fakeRestaurantes[0].id}', '${culturaGastronomica.id}');`;
    fs.appendFileSync(restauranteCulturaGastronomica_filename, sql + '\n');
  });

  // Producto-CulturaGastronomica asociaciones
  const productoCulturaGastronomica_filename =
    basePath + 'productoCulturaGastronomica' + fileName;
  fakeCulturasGastronomicas.forEach((culturaGastronomica) => {
    const sql = `INSERT INTO pro_ent_cul_gas_cul_gas_ent ("productoEntityId","culturaGastronomicaEntityId") VALUES ('${fakeProductos[0].id}', '${culturaGastronomica.id}');`;
    fs.appendFileSync(productoCulturaGastronomica_filename, sql + '\n');
  });

  console.log('Done!');
}

main();

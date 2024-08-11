const sequelize = require('./src/config/database');
const {
  User,
  Employee,
  Client,
  Role,
  Permission,
  RolPermission,
  ProductionOrder,
  ProductionOrderDetail,
  Product,
  ProductCategory,
  Request,
  RequestDetail,
  Datasheet,
  DatasheetDetail,
  Mass,
  MassDetail,
  Supply,
  Bought,
  BoughtDetail,
  Provider,
  Sale,
  SaleDetail,
  Devolution,
  DevolutionDetail,
  DevolutionMotive,
  connectDb
} = require('./src/models'); // Asegúrate de ajustar la ruta según tu estructura de directorios

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Se conectó a la base de datos');

    // Sincroniza todos los modelos
    // {force: true } es para crear las tablas y eliminar las existentes
    // {alter: true } es para actualizar las tablas sin borrarlas, puede generar error si no estan bien sincronizados los modelos
    await sequelize.sync({ force: true });
    // await sequelize.sync({ alter: true });

    console.log('Se sincronizaron los modelos');
  } catch (error) {
    console.error('No se pudo crear los modelos, paila, mire aver si entiende: ', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 
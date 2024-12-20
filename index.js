const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { syncDatabase } = require('./src/models');
const fs = require('fs');
const path = require('path');

dotenv.config();

//Import Rutas
const dashboard = require('./src/routes/dashboard');
const authRoutes = require('./src/routes/authRoutes');
const boughtDetailRoutes = require('./src/routes/boughtDetailRoutes');
const boughtRoutes = require('./src/routes/boughtRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const productCategoriesRoutes = require('./src/routes/productCategoriesRoutes');
const productionOrderRoutes = require('./src/routes/productionOrderRoutes');
const productRoutes = require('./src/routes/productRoutes');
const massesRoutes = require('./src/routes/massesRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const requestDetailRoutes = require('./src/routes/requestDetailRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const saleDetailRoutes = require('./src/routes/saleDetailRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const suppliesRoutes = require('./src/routes/suppliesRoutes');
const userRoutes = require('./src/routes/userRoutes');
const devolutionRoutes = require('./src/routes/devolutionRoutes');
const motiveDevolutionRoutes = require('./src/routes/motiveDevolutionRoutes');
const clientsRoutes = require('./src/routes/clientsRoutes');
const employeesRoutes = require('./src/routes/employeeRoutes');
const statesRoutes = require('./src/routes/statesRoutes');
const recoveryRoutes = require('./src/routes/recoveryRoutes');

const uploadDir = path.join(__dirname, 'uploads/');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads/')));

app.use('/dashboard', dashboard);
app.use('/auth', authRoutes);
app.use('/boughtDetail', boughtDetailRoutes);
app.use('/bought', boughtRoutes);
app.use('/orderDetail', orderDetailRoutes);
app.use('/permission', permissionRoutes);
app.use('/productCategories', productCategoriesRoutes);
app.use('/productionOrder', productionOrderRoutes);
app.use('/product', productRoutes);
app.use('/masses', massesRoutes);
app.use('/provider', providerRoutes);
app.use('/requestDetail', requestDetailRoutes);
app.use('/request', requestRoutes);
app.use('/rolePermission', rolePermissionRoutes);
app.use('/role', roleRoutes);
app.use('/saleDetail', saleDetailRoutes)
app.use('/sale', saleRoutes);
app.use('/supplie', suppliesRoutes);
app.use('/user', userRoutes);
app.use('/client', clientsRoutes);
app.use('/employee', employeesRoutes);
app.use('/devolution', devolutionRoutes);
app.use('/motivedevolution', motiveDevolutionRoutes);
app.use('/states', statesRoutes);
app.use('/recovery',recoveryRoutes);

app.use('/', (req, res) => {
  res.status(200).json('API de Pedivex');
});

const port = process.env.SERVER_PORT || 3000;

const startServer = async () => {
  try {
    await syncDatabase(); // Sincroniza la base de datos
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
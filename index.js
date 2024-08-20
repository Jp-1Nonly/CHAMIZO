const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDb } = require('./src/models');
const cors = require('cors');

//Import Rutas
const authRoutes = require('./src/routes/authRoutes');
const boughtDetailRoutes = require('./src/routes/boughtDetailRoutes');
const boughtRoutes = require('./src/routes/boughtRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const productCategoriesRoutes = require('./src/routes/productCategoriesRoutes');
const productionOrderRoutes = require('./src/routes/productionOrderRoutes');
const productRoutes = require('./src/routes/productRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const requestDetailRoutes = require('./src/routes/requestDetailRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const suppliesRoutes = require('./src/routes/suppliesRoutes');
const userRoutes = require('./src/routes/userRoutes');
const devolutionRoutes = require('./src/routes/devolutionRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/boughtDetail', boughtDetailRoutes);
app.use('/bought', boughtRoutes);
app.use('/orderDetail', orderDetailRoutes);
app.use('/permission', permissionRoutes);
app.use('/productCategories', productCategoriesRoutes);
app.use('/productionOrder', productionOrderRoutes);
app.use('/product', productRoutes);
app.use('/provider', providerRoutes);
app.use('/requestDetail', requestDetailRoutes);
app.use('/request', requestRoutes);
app.use('/rolePermission', rolePermissionRoutes);
app.use('/role', roleRoutes);
app.use('/sale', saleRoutes);
app.use('/supplie', suppliesRoutes);
app.use('/user', userRoutes);
app.use('/devolution', devolutionRoutes);

const port = process.env.SERVER_PORT || 2145;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();

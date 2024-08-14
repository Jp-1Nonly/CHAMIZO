const sequelize = require('../config/database');
const { models } = require('../models');

const getAllDevolutions = async () => {
  return await models.Devolution.findAll();
};

const getDevolutionsById = async (id) => {
  return await models.Devolution.findByPk(id);
};

const createDevolutions = async (data) => {
  return await models.Devolution.create(data);
};

const createDevolucionCambioSabor = async (data) => {
  const transaction = await sequelize.transaction();

    try {
        const { idSale, idProductoActual, idProductoNuevo, cantidad, cliente, fecha } = data;

        const saleRecord = await models.Sale.findByPk(idSale);
        if (!saleRecord) {
            throw new Error('idSale no existe en la tabla sale');
        }

        const saleDetailActual = await models.SaleDetail.findOne({
            where: {
                idSale,
                idProduct: idProductoActual,
            },
        });
        if (!saleDetailActual) {
            throw new Error('Producto actual no encontrado en la venta');
        }

        if (saleDetailActual.quantity < cantidad) {
            throw new Error('Cantidad insuficiente para devolver');
        }

        const productoNuevo = await models.Product.findByPk(idProductoNuevo);
        if (!productoNuevo) {
            throw new Error('Nuevo producto no encontrado en el inventario');
        }

        const nuevaDevolucion = await models.Devolution.create({
            voucher: `DEV-${Date.now()}`,
            client: cliente,
            date: fecha,
            quantityProducts: cantidad,
            state: 1, // Asegúrate de usar el valor adecuado para el estado
            idSale: saleRecord.id,
        }, { transaction });

        await models.DevolutionDetail.create({
            idProduct: idProductoActual,
            quantity: cantidad,
            motive: 'Cambio de sabor',
            idDevolution: nuevaDevolucion.id,
        }, { transaction });

        const productoActual = await models.Product.findByPk(idProductoActual);
        productoActual.stock += cantidad;
        await productoActual.save({ transaction });

        if (productoNuevo.stock < cantidad) {
            throw new Error('Stock insuficiente del nuevo producto');
        }
        productoNuevo.stock -= cantidad;
        await productoNuevo.save({ transaction });

        saleDetailActual.quantity -= cantidad;
        await saleDetailActual.save({ transaction });

        await models.SaleDetail.create({
            idSale,
            idProduct: idProductoNuevo,
            quantity: cantidad,
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Cambio de producto realizado exitosamente', devolution: nuevaDevolucion });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

const createDevolucionMalEstado = async (data) => {
  const transaction = await sequelize.transaction();

  try {
      const { idSale, idProducto, cantidad, cliente, fecha, fechaVencimiento } = data;

      // Verificar si la fecha de vencimiento es válida
      if (!moment(fechaVencimiento).isValid() || moment(fechaVencimiento).isBefore(moment().startOf('day'))) {
          throw new Error('Fecha de vencimiento no válida o ya ha pasado');
      }

      const saleRecord = await models.Sale.findByPk(idSale);
      if (!saleRecord) {
          throw new Error('idSale no existe en la tabla sale');
      }

      const saleDetailRecord = await models.SaleDetail.findOne({
          where: {
              idSale,
              idProduct: idProducto,
          },
      });
      if (!saleDetailRecord) {
          throw new Error('Producto no encontrado en la venta');
      }

      if (saleDetailRecord.quantity < cantidad) {
          throw new Error('Cantidad insuficiente para devolver');
      }

      const producto = await models.Product.findByPk(idProducto);
      if (!producto) {
          throw new Error('Producto no encontrado en el inventario');
      }

      const nuevaDevolucion = await models.Devolution.create({
          voucher: `DEV-${Date.now()}`,
          client: cliente,
          date: fecha,
          quantityProducts: cantidad,
          state: 1, // Cambiar si es necesario
          idSale: saleRecord.id,
      }, { transaction });

      await models.DevolutionDetail.create({
          idProduct: idProducto,
          quantity: cantidad,
          motive: 'Producto en mal estado',
          idDevolution: nuevaDevolucion.id,
      }, { transaction });

      producto.stock -= cantidad;
      await producto.save({ transaction });

      saleDetailRecord.quantity -= cantidad;
      await saleDetailRecord.save({ transaction });

      await transaction.commit();
      return { message: 'Devolución por producto en mal estado registrada exitosamente', devolution: nuevaDevolucion };
  } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
  }
};


const createDevolucionProductoVencido = async (data) => {
  const transaction = await sequelize.transaction();

  try {
      const { idSale, idProducto, cantidad, cliente, fecha, comprobanteCompra, fechaVencimiento } = data;

      // Verificar si la fecha de vencimiento está vencida por menos de 24 horas
      const fechaVencimientoMoment = moment(fechaVencimiento);
      const fechaActual = moment();
      if (fechaVencimientoMoment.isAfter(fechaActual) || fechaActual.diff(fechaVencimientoMoment, 'hours') > 24) {
          throw new Error('Fecha de vencimiento no está dentro del rango de 24 horas vencido');
      }

      const saleRecord = await models.Sale.findByPk(idSale);
      if (!saleRecord) {
          throw new Error('idSale no existe en la tabla sale');
      }

      const saleDetailRecord = await models.SaleDetail.findOne({
          where: {
              idSale,
              idProduct: idProducto,
          },
      });
      if (!saleDetailRecord) {
          throw new Error('Producto no encontrado en la venta');
      }

      if (saleDetailRecord.quantity < cantidad) {
          throw new Error('Cantidad insuficiente para devolver');
      }

      const producto = await models.Product.findByPk(idProducto);
      if (!producto) {
          throw new Error('Producto no encontrado en el inventario');
      }

      const nuevaDevolucion = await models.Devolution.create({
          voucher: comprobanteCompra || `DEV-${Date.now()}`, // Usa el comprobante de compra si está disponible
          client: cliente,
          date: fecha,
          quantityProducts: cantidad,
          state: 1, // Cambiar si es necesario
          idSale: saleRecord.id,
      }, { transaction });

      await models.DevolutionDetail.create({
          idProduct: idProducto,
          quantity: cantidad,
          motive: 'Producto vencido',
          idDevolution: nuevaDevolucion.id,
      }, { transaction });

      producto.stock -= cantidad;
      await producto.save({ transaction });

      saleDetailRecord.quantity -= cantidad;
      await saleDetailRecord.save({ transaction });

      await transaction.commit();
      return { message: 'Devolución por producto vencido registrada exitosamente', devolution: nuevaDevolucion };
  } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
  }
};


const createDevolucionEmpaquetadoRoto = async (data) => {
  const transaction = await sequelize.transaction();

  try {
      const { idSale, idProducto, cantidad, cliente, fecha, motivo } = data;

      const saleRecord = await models.Sale.findByPk(idSale);
      if (!saleRecord) {
          throw new Error('idSale no existe en la tabla sale');
      }

      const saleDetailRecord = await models.SaleDetail.findOne({
          where: {
              idSale,
              idProduct: idProducto,
          },
      });
      if (!saleDetailRecord) {
          throw new Error('Producto no encontrado en la venta');
      }

      if (saleDetailRecord.quantity < cantidad) {
          throw new Error('Cantidad insuficiente para devolver');
      }

      const producto = await models.Product.findByPk(idProducto);
      if (!producto) {
          throw new Error('Producto no encontrado en el inventario');
      }

      const nuevaDevolucion = await models.Devolution.create({
          voucher: `DEV-${Date.now()}`,
          client: cliente,
          date: fecha,
          quantityProducts: cantidad,
          state: 1, // Cambiar si es necesario
          idSale: saleRecord.id,
      }, { transaction });

      await models.DevolutionDetail.create({
          idProduct: idProducto,
          quantity: cantidad,
          motive: motivo,
          idDevolution: nuevaDevolucion.id,
      }, { transaction });

      producto.stock -= cantidad;
      await producto.save({ transaction });

      saleDetailRecord.quantity -= cantidad;
      await saleDetailRecord.save({ transaction });

      await transaction.commit();
      return { message: 'Devolución por empaquetado roto registrada exitosamente', devolution: nuevaDevolucion };
  } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
  }
};


const updateDevolutions = async (id, data) => {
  return await models.Devolution.update(data, {
    where: { id }
  });
};

const deleteDevolutions = async (id) => {
  return await models.Devolution.destroy({
    where: { id }
  });
};

module.exports = {
  getAllDevolutions,
  getDevolutionsById,
  createDevolutions,
  updateDevolutions,
  deleteDevolutions,
  createDevolucionCambioSabor,
  createDevolucionMalEstado,
  createDevolucionProductoVencido,
  createDevolucionEmpaquetadoRoto
};


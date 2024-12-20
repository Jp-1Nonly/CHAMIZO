const userService = require('../services/usersServices');
const { sendResponse, sendError } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    sendResponse(res, users);
  } catch (error) {
    sendError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return sendError(res, 'user not found', 404);
    }
    sendResponse(res, user);
  } catch (error) {
    sendError(res, error);
  }
};


const getAllClientUsers = async (req, res) => {
  try {
    const clients = await userService.getAllClientUsers();
    sendResponse(res, clients);
  } catch (error) {
    sendError(res, error);
  }
};

// Controlador para manejar la solicitud de obtener todos los empleados
const getAllEmployeeUsers = async (req, res) => {
  try {
    const employees = await userService.getAllEmployeeUsers();
    sendResponse(res, employees);
  } catch (error) {
    sendError(res, error);
  }
};


const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    sendResponse(res, user, 201);
  } catch (error) {
    sendError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (updated[0] === 0) {
      return sendError(res, 'user not found', 404);
    }
    sendResponse(res, 'user updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Nueva función para actualizar solo el campo `state`
const updateUserState = async (req, res) => {
  try {
    const { state } = req.body;
    const updated = await userService.updateUserState(req.params.id, state);
    if (updated[0] === 0) {
      return sendError(res, 'user not found', 404);
    }
    sendResponse(res, 'user state updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted === 0) {
      return sendError(res, 'user not found', 404);
    }
    sendResponse(res, 'user deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    await userService.requestPasswordReset(req.body.mail);
    res.status(200).send('Email de recuperación enviado');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.body.token, req.body.password);
    res.status(200).send('Contraseña cambiada exitosamente');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllClientUsers,
  getAllEmployeeUsers,
  createUser,
  updateUser,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  updateUserState
};


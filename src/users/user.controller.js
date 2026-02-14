'use strict';

import User from './user.model.js';

export const createUser = async (req, res) => {
  try {

    const user = new User(req.body);
    await user.save();

    return res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {

    const users = await User.find();

    return res.json({
      success: true,
      users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

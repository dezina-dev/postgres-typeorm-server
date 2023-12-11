import { Request, Response } from 'express';
import { Customer } from '../entities/Customer.entity';
import { User } from '../entities/User.entity';
import { AdminGroup } from '../entities/AdminGroup.entity';
import bcrypt from 'bcrypt';
import { Order } from '../entities/Order.entity';
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();

const registerUser = async (req: Request, res: Response) => {
  try {
    const checkExist = await User.findOneBy({ User_Email: req.body?.User_Email });
    if (checkExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const {
      User_Name,
      User_Surname,
      User_Password,
      User_Email,
      User_Mobile_Number,
      User_Type,
      Profile_Image,
    } = req.body;

    if (
      !User_Name ||
      !User_Surname ||
      !User_Email ||
      !User_Password ||
      !User_Mobile_Number ||
      !User_Type
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter requied details.',
      });
    }

    const hashPassword = await bcrypt.hash(User_Password, 10);

    const user = User.create({
      User_Name: User_Name,
      User_Surname: User_Surname,
      User_Email: User_Email,
      User_Password: hashPassword,
      User_Mobile_Number: User_Mobile_Number,
      User_Type: User_Type,
      Status: "New",
      Profile_Image: Profile_Image,
    });

    const userData = await user.save();

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
      });
    }

    if (User_Type === 'Customer') {
      const {
        Customer_Name,
        Customer_Contact,
        Address,
      } = req.body;

      if (
        !Customer_Name ||
        !Address ||
        !Customer_Contact
      ) {
        return res.status(400).json({
          success: false,
          message: 'Please enter requied details.',
        });
      }

      const customer = Customer.create({
        Customer_Name: Customer_Name,
        Address: Address,
        Customer_Contact
      });

      const customerData = await customer.save();

      if (!customerData) {
        return res.status(400).json({
          success: false,
          message: 'Something went wrong',
        });
      }

      const updateUser = await User.update({ id: userData.id }, { Customer_ID: customer });

      if (!updateUser) {
        return res.status(400).json({
          success: false,
          message: 'Something went wrong',
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customer created successfully"
      });
    }
    else if (User_Type === 'Admin') {
      const { Admin_Group_Name, Menu_Access_ID, Admin_Type } = req.body;

      if (!Admin_Group_Name || !Menu_Access_ID) {
        return res.status(400).json({
          success: false,
          message: 'Please enter required details.',
        });
      }

      const admin = AdminGroup.create({
        Admin_Group_Name: Admin_Group_Name,
        Menu_Access_ID: Menu_Access_ID,
        Admin_Type: Admin_Type,
      });

      const saveAdmin = await admin.save();

      if (!saveAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Something went wrong',
        });
      }

      const updateUser = await User.update({ id: userData.id }, { Admin_ID: admin });

      if (!updateUser) {
        return res.status(400).json({
          success: false,
          message: 'Something went wrong',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Admin created successfully'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserList = async (req: Request, res: Response) => {
  try {
    const { User_Type } = req.body;

    if (!User_Type) {
      return res.status(400).json({
        success: false,
        message: 'Please enter required details.',
      });
    }

    const userDetails = await User.find({ where: { User_Type: User_Type } });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: 'Something thing went wrong',
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new order for a user
const createOrder = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { OrderName, TotalCost } = req.body;

  try {
 
    const user = await User.find({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const order = Order.create({
      OrderName: OrderName,
      TotalCost: TotalCost,
      user: user[0], // Set the user for the order
    });

    const savedOrder = await order.save();

    // Update the User entity with the new order
    user[0].Order_ID.push(order);

    // Save the updated user
    const updateUser = await user[0].save();

    if (!updateUser) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


// Get user's orders
const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {

const user = await User.find({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const UserController = {
  registerUser,
  getUserList,
  createOrder,
  getUserOrders
};

export default UserController;

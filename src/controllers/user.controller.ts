import { Request, Response } from 'express';
import { Customer } from '../entities/Customer.entity';
import { User } from '../entities/User.entity';
import { AdminGroup } from '../entities/AdminGroup.entity';
import bcrypt from 'bcrypt';
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

const UserController = {
  registerUser,
  getUserList
};

export default UserController;

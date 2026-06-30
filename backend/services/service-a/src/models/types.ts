import { Types } from 'mongoose';

export interface IItem {
  _id?:        Types.ObjectId;
  name:        string;
  description: string;
  status:      string;
  createdAt?:  Date;
  updatedAt?:  Date;
  id?:         string;
}

export interface IUser {
  _id?:         Types.ObjectId;
  name:         string;
  email:        string;
  passwordHash: string;
  createdAt?:   Date;
  updatedAt?:   Date;
  id?:          string;
}

export interface IAdmin {
  _id?:         Types.ObjectId;
  name:         string;
  email:        string;
  passwordHash: string;
  role:         string;
  createdAt?:   Date;
  updatedAt?:   Date;
  id?:          string;
}

export interface IProduct {
  _id?:        Types.ObjectId;
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
  createdAt?:  Date;
  updatedAt?:  Date;
  id?:         string;
}

export interface IOrderProduct {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface IOrder {
  _id?:          Types.ObjectId;
  userId:        string;
  products:      IOrderProduct[];
  totalAmount:   number;
  orderStatus:   string;
  paymentStatus: string;
  createdAt?:    Date;
  updatedAt?:    Date;
  id?:           string;
}

export interface ICartItem {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface ICart {
  _id?:        Types.ObjectId;
  userId:      string;
  items:       ICartItem[];
  totalAmount: number;
  createdAt?:  Date;
  updatedAt?:  Date;
  id?:         string;
}

'use strict';

export interface IItem {
  id:          string;
  name:        string;
  description: string;
  status:      string;
  createdAt?:  Date;
  updatedAt?:  Date;
}

export interface IUser {
  id:           string;
  name:         string;
  email:        string;
  passwordHash: string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface IAdmin {
  id:           string;
  name:         string;
  email:        string;
  passwordHash: string;
  role:         string;
  createdAt?:   Date;
  updatedAt?:   Date;
}

export interface IProduct {
  id:          string;
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
  createdAt?:  Date;
  updatedAt?:  Date;
}

export interface IOrderProduct {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface IOrder {
  id:            string;
  userId:        string;
  products:      IOrderProduct[];
  totalAmount:   number;
  orderStatus:   string;
  paymentStatus: string;
  createdAt?:    Date;
  updatedAt?:    Date;
}

export interface ICartItem {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface ICart {
  id:          string;
  userId:      string;
  items:       ICartItem[];
  totalAmount: number;
  createdAt?:  Date;
  updatedAt?:  Date;
}

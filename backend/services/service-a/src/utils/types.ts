export interface GrpcItemDto {
  id:          string;
  name:        string;
  description: string;
  status:      string;
  createdAt:   string;
  updatedAt:   string;
}

export interface GrpcProductDto {
  id:          string;
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
  createdAt:   string;
  updatedAt:   string;
}

export interface GrpcOrderProductDto {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface GrpcOrderDto {
  id:            string;
  userId:        string;
  products:      GrpcOrderProductDto[];
  totalAmount:   number;
  orderStatus:   string;
  paymentStatus: string;
  createdAt:     string;
}

export interface GrpcCartItemDto {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface GrpcCartDto {
  id:          string;
  userId:      string;
  items:       GrpcCartItemDto[];
  totalAmount: number;
  updatedAt:   string;
}

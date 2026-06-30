import type { ProtobufDescriptor } from './types';

export const SERVICE_A_DESCRIPTOR: ProtobufDescriptor = {
  nested: {
    servicea: {
      nested: {
        ServiceA: {
          methods: {
            HealthCheck:    { requestType: 'HealthCheckRequest',    responseType: 'HealthCheckResponse'  },
            GetById:        { requestType: 'GetByIdRequest',        responseType: 'ItemResponse'          },
            GetAll:         { requestType: 'GetAllRequest',         responseType: 'GetAllResponse'        },
            Create:         { requestType: 'CreateItemRequest',     responseType: 'ItemResponse'          },
            Update:         { requestType: 'UpdateItemRequest',     responseType: 'ItemResponse'          },
            Delete:         { requestType: 'DeleteItemRequest',     responseType: 'StatusResponse'        },
            Register:       { requestType: 'RegisterRequest',       responseType: 'AuthResponse'          },
            Login:          { requestType: 'LoginRequest',          responseType: 'AuthResponse'          },
            GetProducts:       { requestType: 'GetProductsRequest',       responseType: 'GetProductsResponse'   },
            CreateProduct:     { requestType: 'CreateProductRequest',     responseType: 'ProductResponse'       },
            UpdateProduct:     { requestType: 'UpdateProductRequest',     responseType: 'ProductResponse'       },
            DeleteProduct:     { requestType: 'DeleteItemRequest',        responseType: 'StatusResponse'        },
            ActivateProduct:   { requestType: 'GetByIdRequest',           responseType: 'ProductResponse'       },
            DeactivateProduct: { requestType: 'GetByIdRequest',           responseType: 'ProductResponse'       },
            CreateOrder:       { requestType: 'CreateOrderRequest',       responseType: 'OrderResponse'         },
            GetOrders:         { requestType: 'GetOrdersRequest',         responseType: 'GetOrdersResponse'     },
            GetUserOrders:     { requestType: 'GetUserOrdersRequest',     responseType: 'GetOrdersResponse'     },
            AddToCart:         { requestType: 'AddToCartRequest',         responseType: 'CartResponse'          },
            GetCart:           { requestType: 'HealthCheckRequest',       responseType: 'CartResponse'          },
            UpdateCartItem:    { requestType: 'UpdateCartItemRequest',    responseType: 'CartResponse'          },
            RemoveFromCart:    { requestType: 'RemoveFromCartRequest',    responseType: 'CartResponse'          },
            ClearCart:         { requestType: 'HealthCheckRequest',       responseType: 'StatusResponse'        },
            CheckoutCart:      { requestType: 'HealthCheckRequest',       responseType: 'OrderResponse'         },
            GetAllUsers:       { requestType: 'GetUsersRequest',          responseType: 'GetUsersResponse'      },
            UpdateOrderStatus: { requestType: 'UpdateOrderStatusRequest', responseType: 'OrderResponse'         },
          },
        },
        Item: {
          fields: {
            id:          { type: 'string', id: 1 },
            name:        { type: 'string', id: 2 },
            description: { type: 'string', id: 3 },
            status:      { type: 'string', id: 4 },
            createdAt:   { type: 'string', id: 5 },
            updatedAt:   { type: 'string', id: 6 },
          },
        },
        GetByIdRequest:    { fields: { id: { type: 'string', id: 1 } } },
        GetAllRequest: {
          fields: {
            page:   { type: 'int32',  id: 1 },
            limit:  { type: 'int32',  id: 2 },
            status: { type: 'string', id: 3 },
            search: { type: 'string', id: 4 },
          },
        },
        CreateItemRequest: {
          fields: {
            name:        { type: 'string', id: 1 },
            description: { type: 'string', id: 2 },
            status:      { type: 'string', id: 3 },
          },
        },
        UpdateItemRequest: {
          fields: {
            id:          { type: 'string', id: 1 },
            name:        { type: 'string', id: 2 },
            description: { type: 'string', id: 3 },
            status:      { type: 'string', id: 4 },
          },
        },
        DeleteItemRequest: { fields: { id: { type: 'string', id: 1 } } },
        ItemResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
            data:    { type: 'Item',   id: 3 },
          },
        },
        GetAllResponse: {
          fields: {
            success: { type: 'bool',           id: 1 },
            message: { type: 'string',         id: 2 },
            data:    { rule: 'repeated', type: 'Item', id: 3 },
            meta:    { type: 'PaginationMeta', id: 4 },
          },
        },
        PaginationMeta: {
          fields: {
            total:      { type: 'int32', id: 1 },
            page:       { type: 'int32', id: 2 },
            limit:      { type: 'int32', id: 3 },
            totalPages: { type: 'int32', id: 4 },
            hasNext:    { type: 'bool',  id: 5 },
            hasPrev:    { type: 'bool',  id: 6 },
          },
        },
        StatusResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
          },
        },
        HealthCheckRequest:  { fields: {} },
        HealthCheckResponse: {
          fields: {
            status:    { type: 'string', id: 1 },
            service:   { type: 'string', id: 2 },
            timestamp: { type: 'string', id: 3 },
          },
        },
        AuthUser: {
          fields: {
            id:        { type: 'string', id: 1 },
            name:      { type: 'string', id: 2 },
            email:     { type: 'string', id: 3 },
            role:      { type: 'string', id: 4 },
            createdAt: { type: 'string', id: 5 },
          },
        },
        RegisterRequest: {
          fields: {
            name:     { type: 'string', id: 1 },
            email:    { type: 'string', id: 2 },
            password: { type: 'string', id: 3 },
          },
        },
        LoginRequest: {
          fields: {
            email:    { type: 'string', id: 1 },
            password: { type: 'string', id: 2 },
          },
        },
        AuthResponse: {
          fields: {
            success: { type: 'bool',     id: 1 },
            message: { type: 'string',   id: 2 },
            token:   { type: 'string',   id: 3 },
            user:    { type: 'AuthUser', id: 4 },
          },
        },
        // ── Product ─────────────────────────────────────────────────────────
        Product: {
          fields: {
            id:          { type: 'string', id: 1 },
            name:        { type: 'string', id: 2 },
            description: { type: 'string', id: 3 },
            category:    { type: 'string', id: 4 },
            image:       { type: 'string', id: 5 },
            price:       { type: 'double', id: 6 },
            stock:       { type: 'int32',  id: 7 },
            status:      { type: 'string', id: 8 },
            createdAt:   { type: 'string', id: 9 },
            updatedAt:   { type: 'string', id: 10 },
          },
        },
        GetProductsRequest: {
          fields: {
            page:     { type: 'int32',  id: 1 },
            limit:    { type: 'int32',  id: 2 },
            status:   { type: 'string', id: 3 },
            category: { type: 'string', id: 4 },
            search:   { type: 'string', id: 5 },
          },
        },
        GetProductsResponse: {
          fields: {
            success: { type: 'bool',             id: 1 },
            message: { type: 'string',           id: 2 },
            data:    { rule: 'repeated', type: 'Product', id: 3 },
            meta:    { type: 'PaginationMeta',   id: 4 },
          },
        },
        ProductResponse: {
          fields: {
            success: { type: 'bool',    id: 1 },
            message: { type: 'string',  id: 2 },
            data:    { type: 'Product', id: 3 },
          },
        },
        // ── Order ────────────────────────────────────────────────────────────
        OrderProduct: {
          fields: {
            productId:   { type: 'string', id: 1 },
            productName: { type: 'string', id: 2 },
            quantity:    { type: 'int32',  id: 3 },
            price:       { type: 'double', id: 4 },
          },
        },
        Order: {
          fields: {
            id:            { type: 'string',  id: 1 },
            userId:        { type: 'string',  id: 2 },
            products:      { rule: 'repeated', type: 'OrderProduct', id: 3 },
            totalAmount:   { type: 'double',  id: 4 },
            orderStatus:   { type: 'string',  id: 5 },
            paymentStatus: { type: 'string',  id: 6 },
            createdAt:     { type: 'string',  id: 7 },
          },
        },
        CreateOrderRequest: {
          fields: {
            userId:    { type: 'string', id: 1 },
            productId: { type: 'string', id: 2 },
            quantity:  { type: 'int32',  id: 3 },
          },
        },
        OrderResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
            data:    { type: 'Order',  id: 3 },
          },
        },
        GetUserOrdersRequest: {
          fields: {
            userId: { type: 'string', id: 1 },
            page:   { type: 'int32',  id: 2 },
            limit:  { type: 'int32',  id: 3 },
          },
        },
        GetOrdersResponse: {
          fields: {
            success: { type: 'bool',           id: 1 },
            message: { type: 'string',         id: 2 },
            data:    { rule: 'repeated', type: 'Order', id: 3 },
            meta:    { type: 'PaginationMeta', id: 4 },
          },
        },
        // ── Cart ─────────────────────────────────────────────────────────────
        CartItem: {
          fields: {
            productId:   { type: 'string', id: 1 },
            productName: { type: 'string', id: 2 },
            quantity:    { type: 'int32',  id: 3 },
            price:       { type: 'double', id: 4 },
          },
        },
        Cart: {
          fields: {
            id:          { type: 'string',  id: 1 },
            userId:      { type: 'string',  id: 2 },
            items:       { rule: 'repeated', type: 'CartItem', id: 3 },
            totalAmount: { type: 'double',  id: 4 },
            updatedAt:   { type: 'string',  id: 5 },
          },
        },
        AddToCartRequest: {
          fields: {
            productId: { type: 'string', id: 1 },
            quantity:  { type: 'int32',  id: 2 },
          },
        },
        UpdateCartItemRequest: {
          fields: {
            productId: { type: 'string', id: 1 },
            quantity:  { type: 'int32',  id: 2 },
          },
        },
        RemoveFromCartRequest: {
          fields: {
            productId: { type: 'string', id: 1 },
          },
        },
        CartResponse: {
          fields: {
            success: { type: 'bool',   id: 1 },
            message: { type: 'string', id: 2 },
            data:    { type: 'Cart',   id: 3 },
          },
        },
        // ── Product CRUD (admin) ──────────────────────────────────────────────
        CreateProductRequest: {
          fields: {
            name:        { type: 'string', id: 1 },
            description: { type: 'string', id: 2 },
            category:    { type: 'string', id: 3 },
            image:       { type: 'string', id: 4 },
            price:       { type: 'double', id: 5 },
            stock:       { type: 'int32',  id: 6 },
            status:      { type: 'string', id: 7 },
          },
        },
        UpdateProductRequest: {
          fields: {
            id:          { type: 'string', id: 1 },
            name:        { type: 'string', id: 2 },
            description: { type: 'string', id: 3 },
            category:    { type: 'string', id: 4 },
            image:       { type: 'string', id: 5 },
            price:       { type: 'double', id: 6 },
            stock:       { type: 'int32',  id: 7 },
            status:      { type: 'string', id: 8 },
          },
        },
        // ── Order admin ───────────────────────────────────────────────────────
        GetOrdersRequest: {
          fields: {
            page:        { type: 'int32',  id: 1 },
            limit:       { type: 'int32',  id: 2 },
            orderStatus: { type: 'string', id: 3 },
          },
        },
        UpdateOrderStatusRequest: {
          fields: {
            id:          { type: 'string', id: 1 },
            orderStatus: { type: 'string', id: 2 },
          },
        },
        // ── User management (admin) ───────────────────────────────────────────
        GetUsersRequest: {
          fields: {
            page:  { type: 'int32', id: 1 },
            limit: { type: 'int32', id: 2 },
          },
        },
        UserData: {
          fields: {
            id:        { type: 'string', id: 1 },
            name:      { type: 'string', id: 2 },
            email:     { type: 'string', id: 3 },
            role:      { type: 'string', id: 4 },
            createdAt: { type: 'string', id: 5 },
          },
        },
        GetUsersResponse: {
          fields: {
            success: { type: 'bool',           id: 1 },
            message: { type: 'string',         id: 2 },
            data:    { rule: 'repeated', type: 'UserData', id: 3 },
            meta:    { type: 'PaginationMeta', id: 4 },
          },
        },
      },
    },
  },
};

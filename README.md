## Local URL

To run the project on a local environment with a local backend server, use the following URL: [http://localhost:5000/](http://localhost:5000/)

## Start Commands According to Environment

- To run the project on a local environment with a local backend server: `npm start`

## Main File

The entry point for the backend is `index.ts`.

## Database Name

This project uses Postgres as its database.

## Getting Started

To get started, follow these steps:

1. Install the project dependencies using:

```shell
npm install
```
## Understand the typeorm relations

1. one-to-one relationship
- Each User can be associated with at most one Customer, and each Customer can be associated with at most one User. The relationship is bidirectional, meaning you can navigate from a User to its associated Customer and vice versa. The @JoinColumn() decorator specifies the foreign key column in the User entity that links to the Customer entity. The eager: true option indicates that the related Customer entity should be loaded eagerly when querying for a User.
so in user entity
-  @OneToOne(() => Customer, (customer) => customer.user, { eager: true })
  @JoinColumn()
  Customer_ID!: Customer;
& in order entity
-  @OneToOne((type) => User, (user: any) => user.Customer_ID)
  user!: User;

2. one-to-many & many-to-one
- Order that has a one-to-many relationship with the User entity. Each User can have multiple orders, and each order belongs to only one user.
so in user entity
-  @OneToMany(() => Order, (order) => order.user, { eager: true })
  Order_ID!: Order[];
& in order entity
-  @ManyToOne(() => User, (user:any) => user.Order_ID)
  user!: User;


## Issues
1. Incase of entity errors at runtime
- like ->
- error: error: relation "tb_orders" does not exist
- QueryFailedError: relation "tb_orders" does not exist
    run this command -> npm run typeorm migration:run
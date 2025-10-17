# Cook Next Door Prototype TODO

## Project Setup
- [x] Create project structure with backend/ and frontend/ directories
- [x] Initialize backend Node.js project with package.json
- [x] Initialize frontend Angular project

## Backend Development
- [x] Install backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
- [x] Create server.js with basic Express setup
- [x] Set up MongoDB connection (using MongoDB Atlas for deployment)
- [x] Create User model (with roles: buyer/seller)
- [x] Create Meal model
- [x] Create Order model
- [x] Create auth middleware for JWT verification
- [x] Create auth routes (register, login)
- [x] Create meals routes (CRUD for sellers)
- [x] Create orders routes (place order, view orders)
- [x] Integrate all routes into server.js

## Frontend Development
- [x] Install Angular Material and dependencies
- [x] Create AuthService for login/register
- [x] Create MealService for API calls
- [x] Create OrderService for API calls
- [x] Create LoginComponent
- [x] Create RegisterComponent
- [x] Create HomeComponent
- [x] Create SellerDashboardComponent (add/list meals)
- [x] Create BuyerDashboardComponent (browse meals, view orders)
- [x] Create MealListComponent
- [x] Create MealFormComponent (for sellers to add meals)
- [x] Create OrderListComponent
- [x] Set up Angular routing
- [x] Implement responsive UI with Angular Material

## Integration and Testing
- [ ] Update frontend services with correct backend API URLs
- [ ] Handle authentication in frontend (store JWT, redirect)
- [ ] Test full flow: register, login, add meal, browse, order
- [ ] Add basic error handling and loading states

## Deployment Preparation
- [x] Add build scripts for production
- [x] Configure environment variables (MongoDB URI, JWT secret)
- [x] Ensure backend is compatible with Render web service
- [x] Ensure frontend can be built as static site for Render
- [x] Add README with deployment instructions

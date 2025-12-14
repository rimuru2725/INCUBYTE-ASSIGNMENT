# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop, built with Test-Driven Development (TDD) principles.

## 🚀 Features

### Backend API
- **User Authentication**: JWT-based authentication with registration and login
- **Sweets Management**: Full CRUD operations for sweets inventory
- **Search Functionality**: Search sweets by name, category, and price range
- **Inventory Management**: Purchase and restock operations
- **Role-Based Access**: Admin-only endpoints for sensitive operations

### Frontend
- **User Authentication**: Registration and login with form validation
- **Sweets Dashboard**: Browse all available sweets with search and filter
- **Purchase System**: Buy sweets with real-time quantity updates
- **Admin Panel**: Add, update, delete, and restock sweets (admin only)
- **Responsive Design**: Beautiful, modern UI with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Testing**: Jest + Supertest
- **API Documentation**: RESTful API

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed (default values work for local development)

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate

# Run tests
npm test

# Start the development server
npm run dev
```

The backend API will be running at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

**Test Coverage**: 46 tests across 3 test suites
- Authentication: 11 tests
- Sweets CRUD: 20 tests
- Inventory Management: 15 tests

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `POST /api/sweets` - Create a new sweet (requires authentication)
- `PUT /api/sweets/:id` - Update a sweet (requires authentication)
- `DELETE /api/sweets/:id` - Delete a sweet (admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (requires authentication)
- `POST /api/sweets/:id/restock` - Restock a sweet (admin only)

## 👤 User Roles

- **First User**: Automatically assigned as admin
- **Subsequent Users**: Regular users with purchase permissions
- **Admin**: Full access to all operations including delete and restock

## 🎨 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Admin Panel
![Admin Panel](./screenshots/admin.png)

## 🤖 My AI Usage

### AI Tools Used

I extensively used **Google Gemini** (Antigravity AI Assistant) throughout this project for various aspects of development.

### How I Used AI

#### 1. **Project Planning & Architecture**
- Used Gemini to help structure the project layout and decide on the technology stack
- Discussed the pros and cons of different approaches (e.g., SQLite vs PostgreSQL for development)
- Generated the initial implementation plan with detailed breakdown of features

#### 2. **Test-Driven Development**
- **Test Generation**: Gemini helped me write comprehensive test cases following TDD principles
  - Generated initial test structures for authentication, CRUD operations, and inventory management
  - Suggested edge cases I hadn't considered (e.g., testing for duplicate emails, invalid quantities)
  - Helped structure tests with proper setup and teardown

- **Implementation**: After writing tests, I used Gemini to:
  - Generate boilerplate code for services, controllers, and routes
  - Implement validation logic based on test requirements
  - Debug failing tests and fix implementation issues

#### 3. **Backend Development**
- **Prisma Schema**: Gemini helped design the database schema with appropriate relationships
- **Middleware**: Generated authentication and authorization middleware with JWT verification
- **Error Handling**: Implemented consistent error handling patterns across all endpoints
- **Code Refactoring**: Suggested improvements to make code more maintainable (e.g., shared Prisma client instance)

#### 4. **Frontend Development**
- **Component Structure**: Gemini helped design the React component hierarchy
- **State Management**: Implemented Auth Context with React hooks
- **UI/UX**: Generated Tailwind CSS classes for a modern, gradient-based design
- **Form Validation**: Implemented client-side validation with error handling

#### 5. **Debugging & Problem Solving**
- **SQLite Compatibility**: When tests failed due to case-insensitive search not being supported in SQLite, Gemini helped identify and fix the issue
- **Test Isolation**: Diagnosed and resolved database locking issues when running multiple test suites
- **CORS Configuration**: Helped set up proper CORS for frontend-backend communication

#### 6. **Documentation**
- **README**: Gemini helped structure this comprehensive README with setup instructions
- **Code Comments**: Generated meaningful comments for complex logic
- **API Documentation**: Helped document all endpoints with request/response examples

### Reflection on AI Impact

**Positive Impacts:**
1. **Speed**: AI significantly accelerated development, especially for boilerplate code and test generation
2. **Best Practices**: Gemini suggested industry-standard patterns I might have overlooked
3. **Learning**: Explained concepts like JWT authentication and Prisma ORM usage
4. **Consistency**: Helped maintain consistent code style across the project

**Challenges:**
1. **Over-reliance**: Had to be careful not to blindly accept AI suggestions without understanding them
2. **Context Limitations**: Sometimes AI generated code that didn't account for project-specific constraints
3. **Testing**: AI-generated tests occasionally needed manual adjustment for edge cases

**Key Takeaway:**
AI tools like Gemini are incredibly powerful pair programming partners. They excel at generating boilerplate, suggesting patterns, and explaining concepts. However, critical thinking and manual review remain essential. The best results came from using AI as a collaborative tool rather than a replacement for understanding the code.

### Specific Examples of AI Assistance

1. **Test Suite Generation**: ~80% of initial test structure was AI-generated, then manually refined
2. **Tailwind Styling**: AI suggested the gradient color scheme and component classes
3. **Error Handling**: AI helped implement consistent error responses across all endpoints
4. **Git Commits**: AI helped format commit messages following conventional commits with co-author attribution

## 📝 Development Workflow (TDD)

This project strictly followed Test-Driven Development:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimal code to pass tests
3. **REFACTOR**: Improve code quality while keeping tests green

Each feature has separate commits for RED and GREEN phases, visible in the git history.

## 🔐 Security Considerations

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Admin-only routes are protected with role-based middleware
- Input validation on all endpoints
- SQL injection prevention through Prisma ORM

## 🚀 Future Enhancements

- [ ] Add user profiles and order history
- [ ] Implement payment gateway integration
- [ ] Add product images and categories
- [ ] Deploy to production (Vercel + Railway)
- [ ] Add email notifications
- [ ] Implement shopping cart functionality
- [ ] Add product reviews and ratings

## 📄 License

MIT

## 👨‍💻 Author

Developed as part of a TDD Kata assessment, demonstrating full-stack development skills with modern technologies and AI-assisted development practices.

---

**Note**: This project was developed with AI assistance (Google Gemini). All AI contributions are documented in the "My AI Usage" section and in git commit co-author attributions.

# 💰 Personal Finance Tracker API

A RESTful API for managing personal income, expenses, and budgets — built with Node.js, Express, and file-based JSON persistence. Features AI-powered expense categorization, saving tips, JWT authentication, and interactive Swagger docs.

---

## 📁 Project Structure (MVC)

```
finance-tracker/
├── controllers/
│   ├── userController.js
│   ├── transactionController.js
│   ├── budgetController.js
│   └── summaryController.js
├── routes/
│   ├── userRoutes.js
│   ├── transactionRoutes.js
│   ├── budgetRoutes.js
│   └── summaryRoutes.js
├── services/
│   ├── transactionService.js
│   ├── budgetService.js
│   ├── aiService.js
│   └── fileService.js
├── middleware/
│   ├── errorHandler.js
│   ├── logger.js
│   ├── validateTransaction.js
│   ├── rateLimiter.js
│   └── auth.js
├── utils/
│   └── AppError.js
├── data/
│   ├── transactions.json
│   ├── users.json
│   └── budgets.json
├── docs/
│   └── swagger.yaml
├── tests/
│   └── api.test.js
├── .env
├── .env.example
├── .gitignore
├── app.js
├── server.js
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
DATA_DIR=./data
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
RATE_LIMIT_MAX=15
RATE_LIMIT_WINDOW_MS=60000
NODE_ENV=development
```

### 3. Initialize Data Files

```bash
mkdir -p data
echo "[]" > data/transactions.json
echo "[]" > data/users.json
echo "[]" > data/budgets.json
```

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at → `http://localhost:3000`

---

## 📦 npm Scripts

```json
{
  "scripts": {
    "start":   "node server.js",
    "dev":     "nodemon server.js",
    "test":    "jest --testPathPattern=tests/",
    "lint":    "eslint .",
    "docs":    "node docs/generateSwagger.js"
  }
}
```

---

## 📚 Dependencies

```bash
npm install express dotenv uuid cors helmet morgan express-rate-limit jsonwebtoken
npm install swagger-ui-express yamljs
npm install --save-dev nodemon jest supertest
```

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `dotenv` | Environment variables |
| `uuid` | Generate unique IDs |
| `cors` | Cross-origin support |
| `helmet` | Security headers |
| `morgan` | HTTP request logging |
| `express-rate-limit` | Rate limiting |
| `jsonwebtoken` | JWT auth |
| `swagger-ui-express` | Swagger UI at `/api/docs` |
| `yamljs` | Load swagger.yaml |

---

## 🗺️ API Endpoints

### Health

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Server health check |

### Users

| Method | Route | Description |
|---|---|---|
| POST | `/users` | Register new user |
| POST | `/users/login` | Login & get JWT token |

### Transactions

| Method | Route | Description |
|---|---|---|
| POST | `/transactions` | Add income or expense |
| GET | `/transactions` | Fetch all transactions |
| GET | `/transactions/:id` | View single transaction |
| PATCH | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| POST | `/transactions/categorize` | AI auto-categorize by description |

### Summary & Analytics

| Method | Route | Description |
|---|---|---|
| GET | `/summary` | Income vs expense summary |
| GET | `/summary/trends` | Monthly trends |
| GET | `/summary/categories` | Spending by category |
| GET | `/suggestions` | AI-powered saving tips |

### Budgets

| Method | Route | Description |
|---|---|---|
| POST | `/budgets` | Create monthly budget |
| GET | `/budgets` | Get budget for a month |
| PATCH | `/budgets/:id` | Update budget goal |

---

## 📖 Swagger UI Setup

### Install

```bash
npm install swagger-ui-express yamljs
```

### `docs/swagger.yaml`

```yaml
openapi: 3.0.0
info:
  title: Personal Finance Tracker API
  version: 1.0.0
  description: API for managing income, expenses, and budgets with AI features

servers:
  - url: http://localhost:3000
    description: Local development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Transaction:
      type: object
      required: [type, category, amount, date]
      properties:
        id:
          type: string
          example: "uuid-1234"
        type:
          type: string
          enum: [income, expense]
          example: expense
        category:
          type: string
          example: food
        amount:
          type: number
          minimum: 0.01
          example: 1200
        date:
          type: string
          format: date
          example: "2025-03-10"
        description:
          type: string
          example: "Groceries at DMart"

    User:
      type: object
      required: [name, email, password]
      properties:
        name:
          type: string
          example: Arjun Sharma
        email:
          type: string
          format: email
          example: arjun@example.com
        password:
          type: string
          minLength: 6
          example: secure123

    Budget:
      type: object
      required: [month, monthlyGoal, savingsTarget]
      properties:
        month:
          type: string
          example: "2025-03"
        monthlyGoal:
          type: number
          example: 50000
        savingsTarget:
          type: number
          example: 10000

    ErrorResponse:
      type: object
      properties:
        status:
          type: string
          example: fail
        message:
          type: string
          example: Transaction not found

paths:
  /health:
    get:
      tags: [Health]
      summary: Server health check
      responses:
        "200":
          description: Server is running
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: OK
                  uptime:
                    type: number
                  timestamp:
                    type: string

  /users:
    post:
      tags: [Users]
      summary: Register new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/User"
      responses:
        "201":
          description: User created successfully
        "400":
          description: Validation error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /users/login:
    post:
      tags: [Users]
      summary: Login and get JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        "200":
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
        "401":
          description: Invalid credentials

  /transactions:
    get:
      tags: [Transactions]
      summary: Fetch all transactions
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: type
          schema:
            type: string
            enum: [income, expense]
        - in: query
          name: category
          schema:
            type: string
        - in: query
          name: startDate
          schema:
            type: string
            format: date
        - in: query
          name: endDate
          schema:
            type: string
            format: date
      responses:
        "200":
          description: List of transactions
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Transaction"

    post:
      tags: [Transactions]
      summary: Add income or expense
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Transaction"
      responses:
        "201":
          description: Transaction created
        "400":
          description: Validation error

  /transactions/{id}:
    get:
      tags: [Transactions]
      summary: Get single transaction
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Transaction found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Transaction"
        "404":
          description: Not found

    patch:
      tags: [Transactions]
      summary: Update a transaction
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Transaction"
      responses:
        "200":
          description: Updated successfully
        "404":
          description: Not found

    delete:
      tags: [Transactions]
      summary: Delete a transaction
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Deleted successfully
        "404":
          description: Not found

  /transactions/categorize:
    post:
      tags: [Transactions]
      summary: AI auto-categorize by description
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [description]
              properties:
                description:
                  type: string
                  example: "Zomato biryani order"
      responses:
        "200":
          description: Category suggestion
          content:
            application/json:
              schema:
                type: object
                properties:
                  category:
                    type: string
                    example: food

  /summary:
    get:
      tags: [Summary]
      summary: Income vs expense summary
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: month
          schema:
            type: string
            example: "03"
        - in: query
          name: year
          schema:
            type: string
            example: "2025"
      responses:
        "200":
          description: Summary data

  /suggestions:
    get:
      tags: [Summary]
      summary: AI saving tips based on spending
      security:
        - BearerAuth: []
      responses:
        "200":
          description: Saving tips from AI

  /budgets:
    post:
      tags: [Budgets]
      summary: Create monthly budget
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Budget"
      responses:
        "201":
          description: Budget created

    get:
      tags: [Budgets]
      summary: Get budget for a month
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: month
          schema:
            type: string
            example: "2025-03"
      responses:
        "200":
          description: Budget details
```

### Register Swagger in `app.js`

```javascript
const swaggerUi   = require('swagger-ui-express');
const YAML        = require('yamljs');
const swaggerDoc  = YAML.load('./docs/swagger.yaml');

// Mount Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  customSiteTitle: 'Finance Tracker API Docs',
  customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
  swaggerOptions: {
    persistAuthorization: true,   // keeps JWT across page refresh
    displayRequestDuration: true,
  }
}));
```

📍 **Swagger UI live at:** `http://localhost:3000/api/docs`

---

## 🔐 JWT Auth Flow

```
POST /users/login  →  { token: "eyJ..." }
                            ↓
Add to all requests:  Authorization: Bearer eyJ...
```

### Protect routes in `app.js`

```javascript
const { protect } = require('./middleware/auth');

app.use('/transactions', protect, transactionRoutes);
app.use('/summary',      protect, summaryRoutes);
app.use('/budgets',      protect, budgetRoutes);
```

---

## 🛡️ Middleware Summary

| Middleware | File | Purpose |
|---|---|---|
| Logger | `middleware/logger.js` | Logs method, URL, status, time |
| Validator | `middleware/validateTransaction.js` | Checks type, amount, date |
| Rate Limiter | `middleware/rateLimiter.js` | 15 req/min per IP |
| Auth | `middleware/auth.js` | Verifies JWT token |
| Error Handler | `middleware/errorHandler.js` | Global async error catcher |

---

## 🧪 Running Tests

```bash
npm test
```

Tests cover:

- `GET /health` → 200 OK
- `POST /users` → creates user, rejects duplicates
- `POST /transactions` → validates all fields
- `GET /transactions` → returns array
- `PATCH /transactions/:id` → updates correctly
- `DELETE /transactions/:id` → removes entry
- `GET /summary` → correct totals

---

## 🤖 AI Prompts Reference

### Auto-Categorize

```
POST /transactions/categorize
{ "description": "Zomato biryani order" }
→ { "category": "food" }
```

### Saving Tips

```
GET /suggestions
→ { "tips": [...], "overallAdvice": "..." }
```

Both use Claude (`claude-sonnet-4-20250514`) via the Anthropic API.
Set `ANTHROPIC_API_KEY` in `.env` to enable.

---

## 🌐 CORS & Security

```javascript
const cors   = require('cors');
const helmet = require('helmet');

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
```

---

## 📝 .env.example

```env
PORT=3000
DATA_DIR=./data
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
RATE_LIMIT_MAX=15
RATE_LIMIT_WINDOW_MS=60000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📌 Quick Reference

```bash
# Start dev server
npm run dev

# Open Swagger UI
open http://localhost:3000/api/docs

# Run tests
npm test

# Check server health
curl http://localhost:3000/health
```

---

## 👨‍💻 Author

Built as part of Node.js MVC project assignment.

# REST API Design Specification - Family Finance

This document defines the complete REST API endpoints, request/response models, validations, and error codes for the **Family Finance** backend application.

## 1. Global API Standards

### 1.1. Base URL
All API endpoints are prefixed with: `/api/v1`

### 1.2. Authentication Header
All protected endpoints require the HTTP Authorization header containing a valid Bearer JWT:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 1.3. Response Envelope Structure

#### Success Response (200 OK, 201 Created)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

#### Error Response (400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error)
```json
{
  "success": false,
  "message": "Detailed error message describing the failure",
  "errors": {}
}
```

---

## 2. Authentication API (`/api/v1/auth`)

### 2.1. User Login
Authenticates a user and issues a JSON Web Token (JWT).

* **Method**: `POST`
* **URL**: `/api/v1/auth/login`
* **Authentication**: None (Public)
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Validation**:
  * `email`: String, required, must be a valid email format.
  * `password`: String, required, minimum 8 characters.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "access_token": "eyJhbGciOi...",
      "token_type": "bearer",
      "user": {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  }
  ```
* **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "errors": {}
  }
  ```

### 2.2. Get Current User Details
Retrieves information about the currently authenticated user session.

* **Method**: `GET`
* **URL**: `/api/v1/auth/me`
* **Authentication**: Required (JWT Bearer)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User details retrieved",
    "data": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
  ```
* **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Token has expired or is invalid",
    "errors": {}
  }
  ```

---

## 3. Accounts API (`/api/v1/accounts`)

### 3.1. List Accounts
Retrieves all family accounts and their current balances.

* **Method**: `GET`
* **URL**: `/api/v1/accounts`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Accounts retrieved successfully",
    "data": [
      {
        "id": "f83a218d-648b-498c-be82-74892c9082ab",
        "name": "BCA Savings",
        "type": "Bank",
        "balance": 15000000.00,
        "created_at": "2026-07-22T06:00:00Z"
      },
      {
        "id": "d13e9a72-f12b-478c-ab38-f9104081c72f",
        "name": "Gopay Wallet",
        "type": "E-Wallet",
        "balance": 350000.00,
        "created_at": "2026-07-22T06:05:00Z"
      }
    ]
  }
  ```

### 3.2. Create Account
Adds a new account to track balances.

* **Method**: `POST`
* **URL**: `/api/v1/accounts`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "BCA Savings",
    "type": "Bank",
    "balance": 15000000.00
  }
  ```
* **Validation**:
  * `name`: String, required, 1-100 characters.
  * `type`: String, required, must be one of: `Cash`, `Bank`, `E-Wallet`, `Savings`, `Investment`.
  * `balance`: Numeric, optional (defaults to `0.00`).
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "id": "f83a218d-648b-498c-be82-74892c9082ab",
      "name": "BCA Savings",
      "type": "Bank",
      "balance": 15000000.00,
      "created_at": "2026-07-22T06:00:00Z"
    }
  }
  ```
* **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "type": [
        "Value must be one of Cash, Bank, E-Wallet, Savings, Investment"
      ]
    }
  }
  ```

### 3.3. Update Account
Modifies an account's name or type.

* **Method**: `PUT`
* **URL**: `/api/v1/accounts/{id}`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Updated BCA Account Name",
    "type": "Bank"
  }
  ```
* **Validation**:
  * `name`: String, required.
  * `type`: String, required (valid options list).
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Account updated successfully",
    "data": {
      "id": "f83a218d-648b-498c-be82-74892c9082ab",
      "name": "Updated BCA Account Name",
      "type": "Bank",
      "balance": 15000000.00,
      "created_at": "2026-07-22T06:00:00Z"
    }
  }
  ```

### 3.4. Delete Account
Deletes an account if it doesn't violate foreign key constraint rules (restrict deletion if transactions are linked).

* **Method**: `DELETE`
* **URL**: `/api/v1/accounts/{id}`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Account deleted successfully",
    "data": null
  }
  ```
* **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Cannot delete account with existing transactions.",
    "errors": {}
  }
  ```

---

## 4. Categories API (`/api/v1/categories`)

### 4.1. List Categories
* **Method**: `GET`
* **URL**: `/api/v1/categories`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Categories retrieved successfully",
    "data": [
      {
        "id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
        "name": "Groceries",
        "type": "Expense"
      },
      {
        "id": "d2f8c0e2-8d2a-4cb1-c294-6bc9320d02f4",
        "name": "Salary",
        "type": "Income"
      }
    ]
  }
  ```

### 4.2. Create Category
* **Method**: `POST`
* **URL**: `/api/v1/categories`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Groceries",
    "type": "Expense"
  }
  ```
* **Validation**:
  * `name`: String, required, 1-100 characters.
  * `type`: String, required, must be either `Income` or `Expense`.
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
      "name": "Groceries",
      "type": "Expense"
    }
  }
  ```
* **Error Response (409 Conflict)**:
  ```json
  {
    "success": false,
    "message": "Category 'Groceries' of type 'Expense' already exists.",
    "errors": {}
  }
  ```

### 4.3. Update Category
* **Method**: `PUT`
* **URL**: `/api/v1/categories/{id}`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Food & Groceries"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Category updated successfully",
    "data": {
      "id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
      "name": "Food & Groceries",
      "type": "Expense"
    }
  }
  ```

### 4.4. Delete Category
* **Method**: `DELETE`
* **URL**: `/api/v1/categories/{id}`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Category deleted successfully",
    "data": null
  }
  ```

---

## 5. Transactions API (`/api/v1/transactions`)

### 5.1. List Transactions (with filtering & pagination)
* **Method**: `GET`
* **URL**: `/api/v1/transactions`
* **Authentication**: Required
* **Query Parameters**:
  * `page`: Integer (default `1`)
  * `limit`: Integer (default `20`)
  * `type`: String (`Income`, `Expense`, `Transfer`)
  * `account_id`: UUID
  * `category_id`: UUID
  * `start_date`: Date (YYYY-MM-DD)
  * `end_date`: Date (YYYY-MM-DD)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": {
      "transactions": [
        {
          "id": "e8a930b8-c3d2-45e6-bf8a-c9d3a1f8b89d",
          "description": "Weekly grocery shopping",
          "amount": 450000.00,
          "type": "Expense",
          "date": "2026-07-22",
          "source_account_id": "f83a218d-648b-498c-be82-74892c9082ab",
          "destination_account_id": null,
          "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
          "notes": "Supermarket purchase",
          "created_at": "2026-07-22T06:30:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total_items": 142,
        "total_pages": 8
      }
    }
  }
  ```

### 5.2. Create Transaction
Log a transaction and update the respective account balances.

* **Method**: `POST`
* **URL**: `/api/v1/transactions`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "description": "Weekly grocery shopping",
    "amount": 450000.00,
    "type": "Expense",
    "date": "2026-07-22",
    "source_account_id": "f83a218d-648b-498c-be82-74892c9082ab",
    "destination_account_id": null,
    "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
    "notes": "Supermarket purchase"
  }
  ```
* **Validation**:
  * `description`: String, required.
  * `amount`: Numeric, required, must be > 0.
  * `type`: String, required (one of `Income`, `Expense`, `Transfer`).
  * `date`: Date string, required (YYYY-MM-DD).
  * **Business Rule Validation**:
    * If `type` = `Income`: `destination_account_id` and `category_id` are required, `source_account_id` must be null.
    * If `type` = `Expense`: `source_account_id` and `category_id` are required, `destination_account_id` must be null.
    * If `type` = `Transfer`: `source_account_id` and `destination_account_id` are required and must not be equal, `category_id` must be null.
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Transaction created successfully",
    "data": {
      "id": "e8a930b8-c3d2-45e6-bf8a-c9d3a1f8b89d",
      "description": "Weekly grocery shopping",
      "amount": 450000.00,
      "type": "Expense",
      "date": "2026-07-22",
      "source_account_id": "f83a218d-648b-498c-be82-74892c9082ab",
      "destination_account_id": null,
      "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
      "notes": "Supermarket purchase",
      "created_at": "2026-07-22T06:30:00Z"
    }
  }
  ```
* **Error Response (422 Unprocessable Entity)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "destination_account_id": [
        "Destination account must be null for Expense transactions."
      ]
    }
  }
  ```

### 5.3. Delete Transaction
Removes the transaction and rolls back its account balance impact.

* **Method**: `DELETE`
* **URL**: `/api/v1/transactions/{id}`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Transaction deleted and account balance adjusted successfully",
    "data": null
  }
  ```

---

## 6. Saving Goals API (`/api/v1/saving-goals`)

### 6.1. List Saving Goals
* **Method**: `GET`
* **URL**: `/api/v1/saving-goals`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Saving goals retrieved",
    "data": [
      {
        "id": "b8a928e1-d2c3-48e2-9f0a-b2e3f4a5c6d7",
        "name": "Japan Trip 2027",
        "target_amount": 50000000.00,
        "current_amount": 12500000.00,
        "target_date": "2027-04-30",
        "notes": "Savings for hotel and flights",
        "progress_percentage": 25.0,
        "created_at": "2026-07-22T06:00:00Z"
      }
    ]
  }
  ```

### 6.2. Create Saving Goal
* **Method**: `POST`
* **URL**: `/api/v1/saving-goals`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Japan Trip 2027",
    "target_amount": 50000000.00,
    "current_amount": 0.00,
    "target_date": "2027-04-30",
    "notes": "Savings for hotel and flights"
  }
  ```
* **Validation**:
  * `name`: String, required.
  * `target_amount`: Numeric, required, must be > 0.
  * `current_amount`: Numeric, optional (defaults to 0.00, must be >= 0).
  * `target_date`: Optional YYYY-MM-DD date string.
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Saving goal created",
    "data": {
      "id": "b8a928e1-d2c3-48e2-9f0a-b2e3f4a5c6d7",
      "name": "Japan Trip 2027",
      "target_amount": 50000000.00,
      "current_amount": 0.00,
      "target_date": "2027-04-30",
      "notes": "Savings for hotel and flights",
      "progress_percentage": 0.0,
      "created_at": "2026-07-22T06:00:00Z"
    }
  }
  ```

### 6.3. Update Saving Goal
* **Method**: `PUT`
* **URL**: `/api/v1/saving-goals/{id}`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Japan Trip 2027",
    "target_amount": 50000000.00,
    "current_amount": 15000000.00,
    "target_date": "2027-04-30",
    "notes": "Adjusted current savings"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Saving goal updated",
    "data": {
      "id": "b8a928e1-d2c3-48e2-9f0a-b2e3f4a5c6d7",
      "name": "Japan Trip 2027",
      "target_amount": 50000000.00,
      "current_amount": 15000000.00,
      "target_date": "2027-04-30",
      "notes": "Adjusted current savings",
      "progress_percentage": 30.0,
      "created_at": "2026-07-22T06:00:00Z"
    }
  }
  ```

### 6.4. Delete Saving Goal
* **Method**: `DELETE`
* **URL**: `/api/v1/saving-goals/{id}`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Saving goal deleted",
    "data": null
  }
  ```

---

## 7. Budgets API (`/api/v1/budgets`)

### 7.1. Get Monthly Budgets
Retrieves budget settings for a specific month and year, including actual calculated expenditure.

* **Method**: `GET`
* **URL**: `/api/v1/budgets`
* **Authentication**: Required
* **Query Parameters**:
  * `year`: Integer, required (e.g., `2026`)
  * `month`: Integer, required (e.g., `7`)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Budgets retrieved",
    "data": [
      {
        "id": "c8a920b7-d3c2-42e1-bf0a-c2d3e4f5a6b7",
        "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
        "category_name": "Groceries",
        "year": 2026,
        "month": 7,
        "planned": 2000000.00,
        "actual": 450000.00,
        "remaining": 1550000.00
      }
    ]
  }
  ```

### 7.2. Set or Update Budget
Creates or updates the planned budget for a category during a specific month.

* **Method**: `POST`
* **URL**: `/api/v1/budgets`
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
    "year": 2026,
    "month": 7,
    "planned_amount": 2000000.00
  }
  ```
* **Validation**:
  * `category_id`: UUID, required.
  * `year`: Integer, required.
  * `month`: Integer, required (between 1 and 12).
  * `planned_amount`: Numeric, required, must be >= 0.
* **Success Response (200 OK / 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Budget set successfully",
    "data": {
      "id": "c8a920b7-d3c2-42e1-bf0a-c2d3e4f5a6b7",
      "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
      "year": 2026,
      "month": 7,
      "planned_amount": 2000000.00
    }
  }
  ```

### 7.3. Delete Budget
* **Method**: `DELETE`
* **URL**: `/api/v1/budgets/{id}`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Budget deleted successfully",
    "data": null
  }
  ```

---

## 8. Reports API (`/api/v1/reports`)

### 8.1. Dashboard Summary
Aggregates recent data to render the main family dashboard.

* **Method**: `GET`
* **URL**: `/api/v1/reports/dashboard`
* **Authentication**: Required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard metrics loaded",
    "data": {
      "total_balance": 15350000.00,
      "income_this_month": 25000000.00,
      "expense_this_month": 450000.00,
      "saving_goals": [
        {
          "name": "Japan Trip 2027",
          "progress_percentage": 25.0
        }
      ],
      "recent_transactions": [
        {
          "id": "e8a930b8-c3d2-45e6-bf8a-c9d3a1f8b89d",
          "description": "Weekly grocery shopping",
          "amount": 450000.00,
          "type": "Expense",
          "date": "2026-07-22"
        }
      ]
    }
  }
  ```

### 8.2. Monthly Financial Breakdown
Returns a breakdown of income vs expenses and expenses grouped by categories.

* **Method**: `GET`
* **URL**: `/api/v1/reports/monthly`
* **Authentication**: Required
* **Query Parameters**:
  * `year`: Integer, required
  * `month`: Integer, required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Monthly report loaded",
    "data": {
      "income_total": 25000000.00,
      "expense_total": 450000.00,
      "net_savings": 24550000.00,
      "expense_by_category": [
        {
          "category_id": "c1f7b0e1-7d1a-4ab0-b183-5ab8219c01f3",
          "category_name": "Groceries",
          "amount": 450000.00,
          "percentage": 100.0
        }
      ]
    }
  }
  ```

### 8.3. Yearly Summary
Generates trend metrics over the months of a given year.

* **Method**: `GET`
* **URL**: `/api/v1/reports/yearly`
* **Authentication**: Required
* **Query Parameters**:
  * `year`: Integer, required
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Yearly report loaded",
    "data": {
      "year": 2026,
      "monthly_trends": [
        {
          "month": 7,
          "income": 25000000.00,
          "expense": 450000.00
        }
      ]
    }
  }
  ```

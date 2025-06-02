# 🧪 API Reference – CRM Backend

This document provides a comprehensive reference to the backend REST APIs built for the CRM platform.

---

## 1. 🔐 Authentication APIs

### 1.1 Google Login

* **URL:** `/api/auth/google`
* **Method:** `GET`
* **Headers:** None
* **Description:** Redirects to Google OAuth login.

### 1.2 Google Callback

* **URL:** `/api/auth/google/callback`
* **Method:** `GET`
* **Headers:** None
* **Description:** Handles Google OAuth callback.
* **Response:**
    * On success: Redirects to `process.env.CLIENT_URL`
    * On failure: Redirects to `/`

### 1.3 Get Logged-in User

* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Headers:**
    * `Cookie`: Session cookie from Google OAuth
* **Response:**

    ```json
    {
      "user": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
    ```


## 2. 👤 Customer APIs

### 2.1 Create Customer
- **URL**: `/api/customers`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Cookie`: Session cookie
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St"
}
```
- **Response**:
```json
{
  "message": "Customer created successfully",
  "customer": { /* customer object */ }
}
```

### 2.2 Get All Customers
- **URL**: `/api/customers`
- **Method**: `GET`
- **Headers**:
  - `Cookie`: Session cookie
- **Response**:
```json
[
  { /* customer1 */ },
  { /* customer2 */ }
]
```

### 2.3 Get Customer by ID
- **URL**: `/api/customers/:id`
- **Method**: `GET`
- **Headers**:
  - `Cookie`: Session cookie
- **Response**:
```json
{ /* customer object */ }
```

### 2.4 Bulk Upload Customers
- **URL**: `/api/customers/bulk`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Cookie`: Session cookie
- **Request Body**:
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  },
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "0987654321"
  }
]
```
- **Response**:
```json
{
  "message": "Customers uploaded successfully",
  "count": 2
}
```

### 2.5 Update Customer
- **URL**: `/api/customers/:id`
- **Method**: `PUT`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Cookie`: Session cookie
- **Request Body**:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```
- **Response**:
```json
{
  "message": "Customer updated successfully",
  "customer": { /* updated customer object */ }
}
```

### 2.6 Delete Customer
- **URL**: `/api/customers/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Cookie`: Session cookie
- **Response**:
```json
{
  "message": "Customer deleted successfully"
}
```

---

## 3. 📦 Order APIs

### 3.1 Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Cookie`: Session cookie
- **Request Body**:
```json
{
  "customer": "customer_id",
  "items": [
    { "productName": "Product A", "quantity": 2, "price": 100 },
    { "productName": "Product B", "quantity": 1, "price": 50 }
  ],
  "amount": 250
}
```
- **Response**:
```json
{
  "message": "Order created successfully",
  "order": { /* order object */ }
}
```

### 3.2 Get All Orders
- **URL**: `/api/orders`
- **Method**: `GET`
- **Headers**:
  - `Cookie`: Session cookie
- **Response**:
```json
[
  { /* order1 */ },
  { /* order2 */ }
]
```

### 3.3 Get Orders by Customer
- **URL**: `/api/orders/customer/:customerId`
- **Method**: `GET`
- **Headers**:
  - `Cookie`: Session cookie
- **Response**:
```json
[
  { /* order1 */ },
  { /* order2 */ }
]
```





# 📈 Campaign APIs

---

## 4.1 Create Segment

-   **URL:** `/api/campaigns/segment`
-   **Method:** `POST`
-   **Headers:**
    -   `Content-Type: application/json`
    -   `Cookie: Session cookie`
-   **Request Body:** (either `segmentRules` or `naturalPrompt` required)

    ```json
    {
      "name": "High Spenders",
      "segmentRules": { "$gt": 10000 },
      "naturalPrompt": "People who spent more than 10,000",
      "messageTemplate": "Hi {{name}}, thanks for being a valued customer!"
    }
    ```

-   **Response:**

    ```json
    {
      "campaign": { /* campaign object */ },
      "generatedQuery": { "spent": { "$gt": 10000 } }
    }
    ```

## 4.2 Trigger Campaign

-   **URL:** `/api/campaigns/trigger/:id`
-   **Method:** `POST`
-   **Headers:**
    -   `Cookie: Session cookie`
-   **Request Body:** (either `segmentRules` or `naturalPrompt` required)

    ```json
    {
      "messageTemplate": "Hi {{name}}, thanks for being a valued customer!"
    }
    ```
-   **Response:**

    ```json
    {
      "campaign": { /* campaign object */ },
      "logsCreated": 100
    }
    ```

## 4.3 Get All Campaigns

-   **URL:** `/api/campaigns`
-   **Method:** `GET`
-   **Headers:**
    -   `Cookie: Session cookie`
-   **Response:**

    ```json
    [
      { /* campaign1 */ },
      { /* campaign2 */ }
    ]
    ```

## 4.4 Get Campaign by ID

-   **URL:** `/api/campaigns/:id`
-   **Method:** `GET`
-   **Headers:**
    -   `Cookie: Session cookie`
-   **Response:**

    ```json
    { /* campaign object */ }
    ```

## 4.5 Get Campaign Summary

-   **URL:** `/api/campaigns/summary/:id`
-   **Method:** `GET`
-   **Headers:**
    -   `Cookie: Session cookie`
-   **Response:**

    ```json
    {
      "summary": "Campaign reached 100 users. 90 delivered, 10 failed."
    }
    ```

## 4.6 Get Campaign Logs

-   **URL:** `/api/campaigns/logs/:id`
-   **Method:** `GET`
-   **Headers:**
    -   `Cookie: Session cookie`
-   **Response:**

    ```json
    [
      { /* log1 */ },
      { /* log2 */ }
    ]
    ```

---

# 🚚 Delivery APIs

---

## 5.1 Send Message to Vendor

-   **URL:** `/api/delivery/send`
-   **Method:** `POST`
-   **Headers:**
    -   `Content-Type: application/json`
    -   `Cookie: Session cookie`
-   **Request Body:**

    ```json
    {
      "campaignId": "campaign_id",
      "messages": [
        { "customerId": "customer_id", "message": "Hi John, here's 10% off!" }
      ]
    }
    ```

-   **Response:**

    ```json
    {
      "message": "Messages sent successfully"
    }
    ```

## 5.2 Receive Delivery Receipt

-   **URL:** `/api/delivery/receipt`
-   **Method:** `POST`
-   **Headers:**
    -   `Content-Type: application/json`
    -   `Cookie: Session cookie`
-   **Request Body:**

    ```json
    {
      "campaignId": "campaign_id",
      "receipts": [
        { "customerId": "customer_id", "status": "DELIVERED" }
      ]
    }
    ```

-   **Response:**

    ```json
    {
      "message": "Delivery receipts processed successfully"
    }
    ```

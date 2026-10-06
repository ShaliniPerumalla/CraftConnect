# MakerMatch Backend

Backend API for the MakerMatch custom creator marketplace.

## Tech Stack

- Python
- Django
- Django REST Framework
- MySQL
- JWT Authentication

## Backend Modules

### 1. Authentication & User Management
App:
`accounts`

Responsible for:
- Registration
- Login
- Logout
- JWT authentication
- User profiles
- Customer / Creator / Admin roles

### 2. Marketplace & Creator Discovery
App:
`marketplace`

Responsible for:
- Creator profiles
- Crafts/products
- Categories
- Creator discovery

### 3. Requirement & Quotation Management

Apps:
`requirements_app`
`quotations`

Responsible for:
- Customer requirements
- Creator quotations
- Quotation comparison
- Quotation approval

### 4. Order Lifecycle

App:
`orders`

Responsible for:
- Order creation
- Design
- Production
- Delivery
- Order status

### 5. Communication, Reviews & Administration

Apps:
`communication`
`reviews`
`notifications`
`complaints`

Responsible for:
- Chat
- Notifications
- Reviews
- Complaints
- Administration

## Backend Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
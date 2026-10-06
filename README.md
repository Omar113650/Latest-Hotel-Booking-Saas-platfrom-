# Saifna

**Hotel Booking and Reservation Platform with Real-Time Communication, Online Payments, OAuth, Push Notifications, and Multi-Role Dashboards**

Saifna is a complete hotel booking backend platform built with Node.js and Express.js.

The system connects users with hotels and property owners through a complete reservation workflow including hotel discovery, booking management, online payments, authentication, notifications, dashboards, and real-time communication.

The platform integrates Stripe for online payments, multiple OAuth providers for social authentication, Cloudinary for media storage, push notifications, scheduled background jobs, and a separate real-time chat server.

---

## Table of Contents

1. Project Overview
2. Core Features
3. User Roles
4. Tech Stack
5. System Architecture
6. Authentication
7. Social Authentication
8. Hotel Management
9. Booking System
10. Payment System
11. Stripe Webhooks
12. User Dashboard
13. Hotel Owner Dashboard
14. Admin Dashboard
15. Notifications
16. Push Notifications
17. Subscriptions
18. Scheduled Jobs
19. Real-Time Chat
20. File Uploads
21. Email Services
22. Validation
23. Error Handling
24. Project Structure
25. Docker Architecture
26. Environment Configuration
27. Installation
28. Engineering Highlights
29. Future Enhancements
30. Author

---

# Project Overview

Saifna is a booking platform designed to manage the complete relationship between users, hotels, property owners, reservations, payments, and notifications.

The platform handles the complete reservation lifecycle:

```text
User
 |
 v
Authentication
 |
 v
Discover Hotels
 |
 v
View Hotel
 |
 v
Select Booking Details
 |
 v
Validate Availability
 |
 v
Create Booking
 |
 v
Stripe Payment
 |
 v
Payment Verification
 |
 v
Booking Confirmation
 |
 v
Notifications
```

The system also includes dedicated dashboards for different types of users and integrates several external services.

---

# Core Features

The platform includes:

- User Registration and Login
- Email Verification
- Google Authentication
- GitHub Authentication
- Microsoft Authentication
- Hotel Management
- Hotel Search and Discovery
- Booking Management
- Stripe Payment Integration
- Stripe Webhooks
- User Dashboard
- Hotel Owner Dashboard
- Admin Dashboard
- Real-Time Notifications
- Web Push Notifications
- Firebase Cloud Messaging
- Subscription Management
- Scheduled Cron Jobs
- Real-Time Chat
- Cloudinary File Storage
- Email Services
- Request Validation
- Centralized Error Handling
- Docker Support

---

# User Roles

The platform contains functionality for multiple types of users.

## User

Users can interact with the booking platform.

Typical functionality includes:

- Create an account
- Login
- Use social authentication
- Browse hotels
- View hotel information
- Create bookings
- Complete payments
- View booking information
- Receive notifications
- Access their dashboard

---

## Hotel Owner

Hotel owners have a dedicated dashboard.

Their functionality can include:

- Manage hotel information
- Monitor hotel activity
- Monitor bookings
- Access hotel-related statistics
- Manage hotel resources

---

## Administrator

Administrators have access to a dedicated platform dashboard.

Administrative functionality can include:

- Monitor users
- Monitor hotels
- Monitor bookings
- Manage platform resources
- Access system statistics
- Monitor platform activity

---

# Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | Token-Based Authentication |
| OAuth | Passport.js |
| Google OAuth | Passport Google Strategy |
| GitHub OAuth | Passport GitHub Strategy |
| Microsoft OAuth | Passport Microsoft Strategy |
| Payments | Stripe |
| Payment Events | Stripe Webhooks |
| File Upload | Multer |
| Cloud Storage | Cloudinary |
| Notifications | Web Push / Firebase |
| Real-Time Communication | WebSocket / Socket Server |
| Scheduled Tasks | Cron Jobs |
| Email | Email Service |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Deployment Configuration | Vercel |
| Architecture | Route / Controller / Model / Service |

---

# System Architecture

The backend follows a layered Express architecture.

```text
                        Client Applications
                                |
                                v
                           Express API
                                |
             -----------------------------------------
             |                  |                    |
             v                  v                    v
       Authentication       Validation           Middleware
             |
             v
           Routes
             |
             v
        Controllers
             |
             v
       Business Logic
             |
       -------------------------------
       |             |               |
       v             v               v
    MongoDB       Services      External Services
       |                             |
       v                ---------------------------
    Mongoose            |          |             |
                        v          v             v
                     Stripe    Cloudinary    OAuth Providers
                                      |
                               Notifications
```

The project separates routing, request processing, data models, external integrations, and shared utilities.

---

# Authentication

Authentication functionality is implemented through:

```text
controller/
    AuthController.js

routes/
    AuthRoute.js

middleware/
    VerifyToken.js

model/
    user.js
    Token.js
    VerificationToken.js
```

A typical authentication flow:

```text
Register
   |
   v
Validate Request
   |
   v
Create User
   |
   v
Generate Verification Token
   |
   v
Verify Account
   |
   v
Login
   |
   v
Generate Authentication Token
   |
   v
Access Protected Resources
```

Authentication middleware protects routes that require an authenticated user.

---

# Token Management

The project contains a dedicated token service:

```text
service/
    TokenServices.js
```

Token-related models include:

```text
model/
    Token.js
    VerificationToken.js
```

Separating token operations into a service makes authentication logic easier to maintain.

Conceptually:

```text
Authentication Request
        |
        v
Token Service
        |
        v
Generate / Validate Token
        |
        v
Authentication Result
```

---

# Social Authentication

Saifna supports multiple OAuth authentication providers.

Strategies include:

```text
strategies/
    google.strategy.js
    github.strategy.js
    microsoft.strategy.js
```

OAuth functionality is also handled through:

```text
controller/
    OAuthController.js

config/
    passport.js
```

Supported providers include:

- Google
- GitHub
- Microsoft

---

# OAuth Flow

The social authentication workflow follows:

```text
User
 |
 v
Select OAuth Provider
 |
 +---- Google
 |
 +---- GitHub
 |
 +---- Microsoft
 |
 v
Passport Strategy
 |
 v
External Provider
 |
 v
User Authorization
 |
 v
OAuth Callback
 |
 v
Find / Create User
 |
 v
Generate Application Token
 |
 v
Authenticated User
```

This allows users to access the platform without creating a separate password-based account.

---

# Hotel Management

Hotels represent one of the primary business entities in the platform.

Implementation includes:

```text
controller/
    HotelController.js

model/
    Hotel.js

routes/
    hotelRoute.js
```

Hotel functionality can include:

- Create hotel records
- Retrieve hotels
- Update hotel information
- Manage hotel details
- Upload hotel media
- Display hotels to users
- Connect hotels with bookings

---

# Home Page

The platform contains dedicated home page logic:

```text
controller/
    HomePage.js

routes/
    homeRoute.js
```

This allows public-facing data to be retrieved separately from administrative and booking functionality.

The home page can serve resources such as:

- Available hotels
- Featured destinations
- Recommended properties
- Platform content

---

# Booking System

The booking module manages reservations between users and hotels.

Implementation:

```text
controller/
    BookingController.js

model/
    Booking.js

routes/
    BookRoute.js
```

Booking validation is handled through:

```text
Validation/
    BookValidation.js
```

A typical booking flow:

```text
User
 |
 v
Select Hotel
 |
 v
Select Booking Details
 |
 v
Validate Request
 |
 v
Check Hotel
 |
 v
Create Booking
 |
 v
Process Payment
 |
 v
Confirm Booking
 |
 v
Notify User
```

---

# Booking Validation

Booking requests should be validated before creating reservations.

The project contains dedicated booking validation:

```text
Validation/
    BookValidation.js
```

A request may pass through:

```text
Booking Request
      |
      v
Schema Validation
      |
      v
Authentication
      |
      v
Hotel Validation
      |
      v
Booking Controller
      |
      v
Create Reservation
```

This keeps invalid data away from the booking business logic.

---

# Payment System

The platform integrates Stripe for online payments.

Relevant files include:

```text
controller/
    StripeController.js

model/
    Stripe.js

routes/
    StripeRoute.js
```

A typical payment flow:

```text
Booking
   |
   v
Create Payment
   |
   v
Stripe Controller
   |
   v
Stripe API
   |
   v
Customer Payment
   |
   v
Payment Result
```

The backend should remain responsible for validating the final payment state.

---

# Stripe Webhooks

Saifna contains dedicated webhook handling.

Implementation:

```text
controller/
    webhookController.js

routes/
    stripeWebhook.js
    webhookRoute.js
```

Stripe can communicate payment events directly to the backend.

```text
Customer
   |
   v
Stripe Checkout
   |
   v
Stripe
   |
   v
Webhook Event
   |
   v
Webhook Controller
   |
   v
Verify Event
   |
   v
Update Payment / Booking
```

This prevents the system from depending only on frontend payment confirmation.

---

# Why Payment Webhooks Matter

Consider:

```text
Payment Successful
       |
       v
User Closes Browser
```

If booking confirmation depends only on the frontend redirect, the backend may not receive the final result.

With webhooks:

```text
Stripe
  |
  v
Backend Webhook
  |
  v
Update Booking
```

Payment processing can continue independently of the user's browser session.

---

# User Dashboard

The platform contains a dedicated user dashboard.

Implementation:

```text
controller/
    UserDashboard.js

routes/
    UserDashboardRoute.js
```

The dashboard provides user-specific platform information.

It can include:

- User information
- Booking information
- Payment information
- Notifications
- Account activity

---

# Hotel Owner Dashboard

Hotel owners have a dedicated dashboard.

Implementation:

```text
controller/
    HotelOwnerDashboard.js

routes/
    HotelOwnerRoutes.js
```

This separates hotel-owner functionality from normal user functionality.

The dashboard can provide:

- Hotel information
- Booking activity
- Customer reservations
- Hotel statistics
- Management functionality

---

# Admin Dashboard

Administrative functionality is handled through:

```text
controller/
    AdminDashboard.js

routes/
    adminRoute.js
```

The Admin Dashboard provides centralized platform management.

Possible dashboard information includes:

- Total users
- Total hotels
- Total bookings
- Platform activity
- Payment information
- System statistics

---

# Notification System

Saifna includes a dedicated notification architecture.

Relevant files include:

```text
controller/
    notificationcontroller.js

model/
    Notification.model.js

service/
    notificationService.js

routes/
    notification.js
```

Notifications can be generated when important application events occur.

Examples include:

- Booking created
- Booking updated
- Payment completed
- Booking confirmed
- Account activity
- Platform announcements

---

# Notification Architecture

```text
Application Event
       |
       v
Notification Service
       |
       v
Create Notification
       |
       v
Notification Storage
       |
       v
Send Notification
       |
       v
User
```

Separating notification logic into a service prevents controllers from containing notification delivery logic.

---

# Push Notifications

The platform contains dedicated push notification functionality.

Relevant files:

```text
config/
    webpush.js

utils/
    pushNotification.js
    sendNotificationToUser.js
```

The project also contains web push client resources:

```text
public/
    service-worker.js
```

A push notification flow can follow:

```text
Application Event
       |
       v
Notification Service
       |
       v
Push Notification
       |
       v
Web Push Provider
       |
       v
Service Worker
       |
       v
User Device
```

Push notifications allow users to receive important updates even when they are not actively viewing the application.

---

# Firebase Notifications

The project contains Firebase messaging resources:

```text
web-fcm/
    firebase-messaging-sw.js
    firebaseWebInit.js
    notifcation.html
```

This provides infrastructure for Firebase Cloud Messaging integration.

Conceptually:

```text
Backend
   |
   v
Firebase Cloud Messaging
   |
   v
Firebase Service Worker
   |
   v
Browser
   |
   v
Notification
```

---

# Push Notification Subscriptions

Push subscriptions are managed through:

```text
controller/
    subscriptioncontroller.js

model/
    Subscription.js

routes/
    subscription.js
```

A typical subscription flow:

```text
Browser
   |
   v
Request Notification Permission
   |
   v
Create Push Subscription
   |
   v
Send Subscription to Backend
   |
   v
Store Subscription
   |
   v
Use Subscription for Future Notifications
```

This allows the backend to maintain notification endpoints for registered devices.

---

# Scheduled Jobs

The project contains scheduled background functionality:

```text
cron/
    weeklyJob.js
```

Scheduled jobs allow the application to execute tasks automatically without requiring an HTTP request.

Conceptually:

```text
Cron Scheduler
      |
      v
Weekly Job
      |
      v
Retrieve Required Data
      |
      v
Execute Business Logic
      |
      v
Create / Send Notifications
```

Scheduled jobs can be useful for operations such as reminders and periodic notifications.

---

# Cron Notification Storage

The project includes:

```text
model/
    NotificationForCronJob.js
```

This indicates that scheduled notification operations have dedicated persistence or tracking.

This helps separate scheduled notification data from standard application notifications.

---

# Real-Time Chat

Saifna contains a dedicated chat server:

```text
chatServer.js
```

There is also:

```text
model/
    Message.js
```

This provides infrastructure for real-time communication.

Conceptually:

```text
User A
  |
  v
Chat Server
  |
  v
WebSocket Connection
  |
  v
User B
```

Messages can also be stored through the Message model.

---

# Chat Architecture

The project separates the main backend and chat server.

```text
                 Client
                   |
          -------------------
          |                 |
          v                 v
     Main Backend       Chat Server
          |                 |
          v                 v
       MongoDB           Messages
```

This separation is useful because real-time chat traffic has different characteristics from normal REST API traffic.

---

# File Upload Management

File upload utilities include:

```text
utils/
    multer.js
    Cloudinary.js
```

Multer handles incoming multipart files while Cloudinary provides cloud-based storage.

```text
Client
  |
  v
Upload File
  |
  v
Multer
  |
  v
Validate File
  |
  v
Cloudinary
  |
  v
Cloud URL
  |
  v
Database
```

This can be used for hotel images and other platform media.

---

# Email Services

Email functionality is centralized through:

```text
utils/
    emailServices.js
```

Email can support workflows such as:

- Account verification
- Authentication
- Booking confirmation
- Booking updates
- Payment notifications
- Account notifications

Keeping email functionality centralized prevents duplication across controllers.

---

# Validation

The project contains dedicated validation schemas:

```text
Validation/
    BookValidation.js
    HotelValidation.js
    TreasuretValidation.js
    UserValidation.js
```

There is also validation middleware:

```text
middleware/
    Vaildate.js
    validateId.js
```

The request pipeline can follow:

```text
HTTP Request
     |
     v
Schema Validation
     |
     v
ID Validation
     |
     v
Authentication
     |
     v
Controller
```

This keeps controllers focused on application logic.

---

# Error Handling

The project includes centralized error infrastructure:

```text
middleware/
    error.js

utils/
    AppError.js
    ApiResponse.js
```

`AppError` can provide standardized application errors while `ApiResponse` can help maintain consistent API response structures.

A typical flow:

```text
Controller / Service
        |
        v
Error Occurs
        |
        v
AppError
        |
        v
Error Middleware
        |
        v
Standardized Response
```

Common HTTP responses include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# Database Models

The project contains the following major models:

```text
Booking.js
Hotel.js
LoginGoogle.js
Message.js
Notification.model.js
NotificationForCronJob.js
Stripe.js
Subscription.js
Token.js
TreasuretoChoose.js
VerificationToken.js
user.js
```

A simplified domain relationship:

```text
User
 |
 +---- Bookings
 |
 +---- Payments
 |
 +---- Messages
 |
 +---- Notifications
 |
 +---- Push Subscriptions


Hotel
 |
 +---- Bookings


Booking
 |
 +---- User
 |
 +---- Hotel
 |
 +---- Payment
```

---

# Project Structure

The actual project structure follows:

```text
Validation/
|-- BookValidation.js
|-- HotelValidation.js
|-- TreasuretValidation.js
`-- UserValidation.js

config/
|-- connectDB.js
|-- passport.js
`-- webpush.js

controller/
|-- AdminDashboard.js
|-- AuthController.js
|-- BookingController.js
|-- HomePage.js
|-- HotelController.js
|-- HotelOwnerDashboard.js
|-- OAuthController.js
|-- StripeController.js
|-- UserDashboard.js
|-- notificationcontroller.js
|-- subscriptioncontroller.js
`-- webhookController.js

cron/
`-- weeklyJob.js

middleware/
|-- Vaildate.js
|-- VerifyToken.js
|-- error.js
`-- validateId.js

model/
|-- Booking.js
|-- Hotel.js
|-- LoginGoogle.js
|-- Message.js
|-- Notification.model.js
|-- NotificationForCronJob.js
|-- Stripe.js
|-- Subscription.js
|-- Token.js
|-- TreasuretoChoose.js
|-- VerificationToken.js
`-- user.js

routes/
|-- AuthRoute.js
|-- BookRoute.js
|-- HotelOwnerRoutes.js
|-- StripeRoute.js
|-- UserDashboardRoute.js
|-- adminRoute.js
|-- homeRoute.js
|-- hotelRoute.js
|-- notification.js
|-- stripeWebhook.js
|-- subscription.js
`-- webhookRoute.js

service/
|-- TokenServices.js
`-- notificationService.js

strategies/
|-- github.strategy.js
|-- google.strategy.js
`-- microsoft.strategy.js

utils/
|-- ApiResponse.js
|-- AppError.js
|-- Cloudinary.js
|-- emailServices.js
|-- multer.js
|-- pushNotification.js
`-- sendNotificationToUser.js

public/
|-- admin.html
|-- client.html
|-- frontend.js
|-- service-worker.js
|-- so-proud-notification.mp3
`-- style.css

web-fcm/
|-- firebase-messaging-sw.js
|-- firebaseWebInit.js
`-- notifcation.html

Dockerfile.backend
Dockerfile.chat
docker-compose.yml
chatServer.js
client.js
index.js
test-socket.js
vercel.json
package.json
```

---

# Application Request Flow

The standard REST request flow follows:

```text
Client
  |
  v
Route
  |
  v
Validation
  |
  v
Authentication
  |
  v
Controller
  |
  v
Service / Model
  |
  v
Database / External Service
  |
  v
Response
```

---

# Docker Architecture

The project includes containerization support:

```text
Dockerfile.backend
Dockerfile.chat
docker-compose.yml
```

The backend and chat server can run as separate containers.

Conceptually:

```text
                    Docker Compose
                         |
             -------------------------
             |                       |
             v                       v
      Backend Container        Chat Container
             |                       |
             v                       v
        Express API             Chat Server
             |
             v
          MongoDB
```

This separation allows the REST backend and real-time chat service to run independently.

---

# Why Separate the Chat Server?

HTTP API traffic and WebSocket traffic have different characteristics.

The main backend handles operations such as:

```text
Authentication
Hotels
Bookings
Payments
Dashboards
Notifications
```

The chat server focuses on:

```text
Connections
Messages
Real-Time Events
```

Separating them improves architectural flexibility and allows them to be scaled independently in the future.

---

# Environment Configuration

The exact variable names should match the implementation.

The project may require configuration similar to:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

WEB_PUSH_PUBLIC_KEY=your_public_key
WEB_PUSH_PRIVATE_KEY=your_private_key
```

Never commit real credentials, private keys, API keys, or secrets to source control.

---

# Installation and Setup

## Requirements

Install:

- Node.js
- MongoDB
- npm
- Docker and Docker Compose if running containers

---

## Clone Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create the required `.env` file and configure:

- Database
- Authentication
- OAuth providers
- Stripe
- Cloudinary
- Email
- Push notifications

---

## Start Main Backend

Use the script configured in `package.json`.

For example:

```bash
npm start
```

or:

```bash
npm run dev
```

---

## Run with Docker

The project includes Docker Compose configuration.

```bash
docker compose up --build
```

This can start the configured backend and chat services.

---

# Deployment

The project includes:

```text
vercel.json
```

for Vercel-specific deployment configuration.

Docker configuration is also available for environments that support container-based deployments.

---

# Engineering Highlights

## Complete Booking Workflow

The platform connects hotel discovery, booking, payment, and notifications into one complete workflow.

## Multi-Provider OAuth

The authentication architecture supports Google, GitHub, and Microsoft strategies.

## Payment Webhooks

Stripe webhook handling provides server-to-server payment verification.

## Push Notifications

Web Push and Firebase infrastructure allow notifications to reach user devices outside normal API requests.

## Notification Architecture

Notification controllers, services, models, and push utilities are separated into dedicated components.

## Scheduled Background Work

Cron jobs allow periodic operations to run independently from incoming HTTP requests.

## Separate Real-Time Chat Service

The project separates the standard REST backend from the real-time chat server.

## Containerization

Separate Dockerfiles for the backend and chat service allow independent container execution.

## Multi-Role Dashboards

Users, hotel owners, and administrators have separate dashboard functionality.

## Centralized Validation

Dedicated schemas and middleware validate incoming requests before business logic executes.

## Centralized Error Handling

AppError, ApiResponse, and error middleware provide reusable application-level response handling.

---

# Security Considerations

Important security areas include:

- Token validation
- Protected routes
- OAuth callback validation
- Request validation
- ID validation
- Secure password handling
- Stripe webhook signature verification
- Secure push subscription handling
- File upload validation
- Environment variable protection
- Role and resource authorization

Payment results should always be verified on the backend rather than trusted from the frontend.

---

# Future Enhancements

Possible future improvements include:

- Redis caching
- Advanced Role-Based Access Control
- Distributed WebSocket scaling
- Message queues
- BullMQ background processing
- Booking concurrency protection
- Advanced hotel search
- Geospatial hotel search
- Hotel reviews and ratings
- Recommendation system
- Payment retry handling
- Notification retry queues
- Automated testing
- CI/CD pipelines
- Nginx reverse proxy
- Structured logging
- Error monitoring
- API performance metrics
- Swagger / OpenAPI documentation
- Horizontal scaling

---

# Use Cases

## User

A user can:

- Register
- Login
- Verify their account
- Login with Google
- Login with GitHub
- Login with Microsoft
- Browse hotels
- Create bookings
- Complete payments
- Access their dashboard
- Receive notifications
- Use real-time communication

## Hotel Owner

A hotel owner can:

- Manage hotel information
- Monitor bookings
- Access hotel-specific dashboard functionality
- Monitor hotel activity

## Administrator

An administrator can:

- Monitor users
- Monitor hotels
- Monitor bookings
- Access platform statistics
- Manage platform resources
- Monitor overall platform activity

---

# Final Note

Saifna demonstrates the architecture of a complete hotel booking backend rather than a simple reservation CRUD application.

The project combines hotel management, booking workflows, Stripe payments, server-side payment webhooks, multi-provider OAuth authentication, user and hotel-owner dashboards, push notifications, Firebase messaging, scheduled cron jobs, cloud media storage, email services, real-time chat, validation, centralized error handling, and Docker-based service separation.

The separation between the main REST backend and the real-time chat server, combined with dedicated notification, authentication, payment, and dashboard modules, provides a strong foundation for evolving the platform into a larger production booking system.

---

# Author

**Omar Elhelaly**

Backend Developer specializing in:

- Node.js
- Express.js
- MongoDB
- RESTful APIs
- Authentication
- OAuth
- Stripe Payments
- Payment Webhooks
- WebSockets
- Push Notifications
- Firebase Cloud Messaging
- Cron Jobs
- Docker
- Cloudinary
- Booking Systems
- Backend Architecture

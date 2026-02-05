# Writty - Modern NoSQL Chat Application

![Writty Logo](public/logo.svg)

Writty is a high-performance, real-time chat application built with a modern technology stack. It leverages the power of Laravel for the backend API, React for a dynamic and responsive frontend, and MongoDB as a flexible NoSQL database. Real-time communication is powered by Laravel Reverb, ensuring a smooth and interactive user experience.

## Features

*   **User Authentication**: Secure registration and login, including OAuth with GitHub.
*   **User Profiles**: Customizable user profiles with bio and profile pictures.
*   **Real-time Messaging**: Send and receive text messages instantly.
*   **Image Sharing**: Share images directly within chat conversations.
*   **Online Status**: See which users are currently online.
*   **User Directory**: Browse and connect with other users on the platform.
*   **Admin Panel**: A secure, hidden administration area for platform management (user statistics, message logs, user management).
*   **Beautiful UI/UX**: A modern, intuitive user interface built with React and styled with Tailwind CSS v4, featuring custom colors (Cyan & Violet) and typography (Poppins & Manrope).

## Technology Stack

*   **Backend**: Laravel 12 (PHP 8.3+)
    *   **Database**: MongoDB (via `mongodb/laravel-mongodb`)
    *   **Authentication**: Laravel Breeze (API Stack)
    *   **OAuth**: Laravel Socialite (for GitHub Login)
    *   **Real-time**: Laravel Reverb (WebSockets)
    *   **File Storage**: Laravel Storage (for profile pictures and chat images)
*   **Frontend**: React 18+
    *   **Styling**: Tailwind CSS v4
    *   **Routing**: Inertia.js
    *   **HTTP Client**: Axios
    *   **Real-time Client**: Laravel Echo & Pusher.js
*   **Package Manager**: npm

## Installation

Follow these steps to get Writty up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

*   PHP >= 8.3
*   Composer >= 2.x
*   Node.js >= 22.x
*   pnpm >= 9.x
*   MongoDB >= 7.x (running locally or accessible via Atlas)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fhermas22/writty.git
    cd writty
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    composer require mongodb/laravel-mongodb
    composer require laravel/socialite
    composer require laravel/reverb
    ```

3.  **Configure Environment Variables:**
    Copy the `.env.example` file to `.env` and update the following variables:
    ```env
    APP_NAME="Writty"
    APP_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:5173 # Or your React dev server URL

    DB_CONNECTION=mongodb
    DB_HOST=127.0.0.1
    DB_PORT=27017
    DB_DATABASE=writty_db

    # Reverb Configuration
    REVERB_APP_ID=writty_app_id
    REVERB_APP_KEY=writty_app_key
    REVERB_APP_SECRET=writty_app_secret
    REVERB_HOST="localhost"
    REVERB_PORT=8080
    REVERB_SCHEME=http

    # GitHub OAuth (Register your app on GitHub Developer Settings)
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    GITHUB_REDIRECT_URI="${APP_URL}/auth/github/callback"
    ```
    Generate `REVERB_APP_KEY` and `REVERB_APP_SECRET` by running `php artisan reverb:start` for the first time.

4.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```

5.  **Install Breeze (React Stack):**
    ```bash
    php artisan breeze:install react
    ```

6.  **Run Migrations (for session/cache tables, if needed):**
    ```bash
    php artisan migrate
    ```

7.  **Create Storage Link:**
    ```bash
    php artisan storage:link
    ```

8.  **Start Laravel Development Server:**
    ```bash
    php artisan serve
    ```

9.  **Start Laravel Reverb Server (in a separate terminal):**
    ```bash
    php artisan reverb:start
    ```

### Frontend Setup

1.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```

2.  **Compile Assets and Start Frontend Development Server (in a separate terminal):**
    ```bash
    npm run dev
    ```

Your application should now be accessible at `http://localhost:8000` (or your `APP_URL`). The React frontend will be served by Vite, typically on `http://localhost:5173`.

## Contributing

Feel free to fork the repository, open issues, and submit pull requests. Any contributions are welcome!

## License

The Writty project is open-sourced software licensed under the [MIT license](LICENSE).

---
Developed with ❤️ by [Hermas Francisco (@fhermas22)](https://github.com/fhermas22).

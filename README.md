# FormAI-React-Native
 This is a work in progress, 

There are three distinct user roles within the system:

1. Admin: The admin role manages the overall system, including moderator management, community management, content moderation, monitoring user activity, and more.
2. Moderators: Moderators manage communities, manually review reported posts, and perform other moderation-related tasks.
3. General Users: General users have the ability to make posts, like comments, and perform other actions within the platform.



## Features

- [ ] User authentication and authorization (JWT)
- [ ] User profile creation and management
- [ ] Post creation and management
- [ ] Instant Messgaging
- [ ] Community leaderboards
- [ ] Commenting on posts
- [ ] Liking posts and comments
- [ ] Following/unfollowing users
- [ ] Reporting posts
- [ ] Context-based authentication
- [ ] Email notifications


## Technologies

- React Native
- Redux
- Node.js
- PrismaORM
- TypeScript
- Express.js
- JWT Authentication
- Passport.js with salts
- Nodemailer
- Crypto-js
- AWS S3 Storage
- CloudFront CDN 
  

## Schema Diagram

Here is the a link where you can view the data model in real time 
https://dbdiagram.io/d/FormAI-Databases-65c3867aac844320aea782a4

<img width="509" alt="image" src="https://github.com/mahmoudabdelhadii/FormAI/assets/56850296/cc5f868c-1571-4ff4-8410-88fc4faebef1">


## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- PostgreSQL

### Installation

1. Clone the repository

```bash
git clone https://github.com/mahmoudabdelhadii//FormAI.git
```
2. Go to the project directory and install dependencies for both the client and server

```bash
cd client
npm install
```

```bash
cd server
npm install
```

3. Create a `.env` file in both the `client` and `server` directories and add the environment variables as shown in the `.env.example` files.
4. Start the server

```bash
cd server
npm start
```

5. Start the client

```bash
cd formai-Frontend
npm run start
```


### Configuration



#### `.env` Variables

For email service of context-based authentication, the following variables are required:

```bash
DatabaseURL=

```

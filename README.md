# 🏕️ CampStatix App Project

Welcome to **CampStatix**, a full-stack web application where users can explore, create, update, and review campgrounds! Whether you’re an outdoor enthusiast or a developer learning full-stack web development, this project has something for you.

---

## 🌟 Features

- 🔥 User Authentication (Register, Login, Logout)  
- 🏕️ Campground CRUD (Create, Read, Update, Delete)  
- ✍️ Leave and manage reviews for campgrounds  
- 🖼️ Upload and display images for campgrounds  
- 💸 Campground pricing display  
- 📋 Responsive UI with Bootstrap  
- ⚡ Client-side form validation for a smooth user experience  
- 🛠️ Server-side validation and error handling

---

## 🚀 Technologies Used

| Frontend                                                                                          | Backend                                   | Database                       | Tools & More                  |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------ | ----------------------------- |
| ![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white) <br> ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white) <br> ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) <br> ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) <br> ![EJS](https://img.shields.io/badge/EJS-2C3E50?style=for-the-badge&logo=ejs&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) <br> ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) <br> ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) |

---

## 📂 Project Structure



### Explanation of Key Files and Folders

- **app.js/server.js**  
  Configures the Express server, connects to the database, sets up middleware, and starts the app.

- **models/**  
  Contains Mongoose schemas that define your data structure and validation for campgrounds, reviews, and users.

- **routes/**  
  Defines route handlers for different parts of the application (campgrounds, reviews, users).

- **views/**  
  Holds EJS templates responsible for generating HTML views rendered in the browser. Includes layout files for consistent page structure and partials for reusable UI parts.

- **public/**  
  Stores all static files served directly to clients such as CSS stylesheets, JavaScript scripts, and images.

- **middleware/**  
  Contains custom middleware for request handling, authentication, or error processing.

- **utils/**  
  Utility modules and helper functions used throughout the application to keep code modular and reusable.

---

Adding this overview helps you and other developers quickly understand the organization of your project and where to find or add new code.




---

## 🔧 Installation & Setup

1. **Clone the repo**  
   ```
   git clone https://github.com/yourusername/campstatix.git
   cd campstatix
---
2. **Install dependencies**
```
    npm install
```
---
3. **Set up environment variables**

- Create a ```.env``` file in the root directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret
```
---
4. Start the server
```
npm start
```
---
5. Open your browser
- Go to `http://localhost:3000` and start exploring!
---
## 🧩 How to Use
- View all campgrounds: /campground

- Add a new campground: /campground/new

- Edit or delete a campground: Available on each campground's detail page

- Register & login: To add reviews and manage campgrounds

---

## 🎯 Goal

- Build a robust, real-world full-stack application

- Practice RESTful routing and CRUD operations

- Implement user authentication and authorization

- Improve UI/UX with Bootstrap and client-side validation

---

_Happy Camping!_ ⛺🌲🔥


---


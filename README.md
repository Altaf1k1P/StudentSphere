# Students Management App

## Description
The **Students Management App** is a web-based application for managing student records. It allows users to add, view, edit, and delete student information. The app integrates Firebase for authentication and database services, ensuring secure and efficient handling of user and student data.

---

## Features
- **Authentication**: Secure login/logout using Firebase Authentication.
- **Student Records**:
  - Add new students.
  - View details of all students.
  - Edit student details (by the owner only).
  - Delete student records (by the owner only).
- **Role-based Access Control**:
  - All users can view student records.
  - Only the creator (owner) can update or delete student records.

---

## Technologies Used
### Frontend:
- React.js
- Material-UI (MUI)

### Backend:
- Firebase Firestore (NoSQL Database)
- Firebase Authentication

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd students-management-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Setup Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication and Firestore Database.
   - Obtain your Firebase configuration and replace it in `firebase.js`:
     ```javascript
     const firebaseConfig = {
       apiKey: "<API_KEY>",
       authDomain: "<AUTH_DOMAIN>",
       projectId: "<PROJECT_ID>",
       storageBucket: "<STORAGE_BUCKET>",
       messagingSenderId: "<MESSAGING_SENDER_ID>",
       appId: "<APP_ID>",
     };
     ```

4. **Firestore Rules:**
   Update your Firestore security rules to:
   ```
   service cloud.firestore {
     match /databases/{database}/documents {
       match /students/{studentId} {
         allow read: if request.auth != null;
         allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
       }
     }
   }
   ```

5. **Run the App:**
   ```bash
   npm start
   ```
   The app will be accessible at `http://localhost:3000`.

---

## Usage
1. Log in with your Firebase account.
2. View the list of student records.
3. Add a new student using the **Add Student** button.
4. Edit or delete records you own by clicking the respective icons.
5. View detailed information about a student by clicking the **View** icon.
6. Log out securely using the **Logout** button.

---

## Folder Structure
```
src
├── pages
│   ├── Students.js   // Main component for managing students
│   └── firebase.js   // Firebase configuration and initialization
├── App.js            // Main application component
├── index.js          // Entry point
└── styles.css        // Custom styles
```

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Create a Pull Request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Author
Developed by Altaf Khan.

---

## Acknowledgments
- Firebase for backend services.
- Material-UI for design components.
- OpenAI for support and guidance.


# Retro Flix

**Retro Flix** is a retro-themed movie download website built using **Flask** for the backend, **JavaScript** and **HTML** for the frontend, and **MongoDB** as the database. The platform features a visually appealing retro design with both dark and light themes, a search functionality, and a movie trend display.

---

## Features

- **Retro Theme**: The website has a unique retro aesthetic with options for both dark and light themes.
- **Trending Movies Carousel**: Displays popular movies in a horizontal carousel.
- **Search Movies**: Users can search for movies by title and get results in a neatly formatted list.
- **Responsive Design**: The interface adapts to various screen sizes and devices.
- **MongoDB Integration**: Stores movie data and user interactions securely in a MongoDB database.
- **Flask Backend**: Handles routing, data fetching, and search logic efficiently.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/retro-flix.git
   cd retro-flix
   ```

2. Set up a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up MongoDB:
   - Ensure MongoDB is installed and running.
   - Create a database named `retroflix`.
   - Configure your MongoDB URI in a `.env` file:
     ```env
     MONGO_URI=mongodb://localhost:27017/retroflix
     ```

5. Start the development server:
   ```bash
   flask run
   ```

6. Open the website in your browser:
   ```
   http://127.0.0.1:5000
   ```

---

## Technologies Used

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Retro-inspired design elements

- **Backend**:
  - Flask
  - RESTful API design

- **Database**:
  - MongoDB
  - PyMongo for database interaction

---

## File Structure

```
retro-flix/
|-- static/
|   |-- css/
|   |   |-- styles.css
|   |-- js/
|       |-- scripts.js
|-- templates/
|   |-- base.html
|   |-- index.html
|   |-- search.html
|-- app.py
|-- requirements.txt
|-- .env
|-- README.md
```

---

## Screenshots

### Home Page (Dark Theme)
![Home Page - Dark Theme](screenshots/dark_theme.png)

### Search Page
![Search Page](screenshots/search_page.png)

### Home Page (Light Theme)
![Home Page - Light Theme](screenshots/light_theme.png)

---

## How to Contribute

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on GitHub.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

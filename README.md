# ING Hub Frontend Case Study

A frontend case study project built as part of the ING Hub recruitment process.  
This project demonstrates proficiency in modern web development using **Lit** and **Vite**, emphasizing clean architecture, modular components, and maintainable state management.

---

## 🚀 Tech Stack

- **[Lit](https://lit.dev/):** Lightweight library for building fast, reusable web components.
- **[Vite](https://vitejs.dev/):** Lightning-fast build tool and bundler.
- **[Vaadin Router](https://vaadin.com/router):** Modern client-side router for web components.
- **[Zustand](https://github.com/pmndrs/zustand):** Minimal state management for predictable global state.
- **[i18n](https://www.i18next.com/):** Internationalization and localization support.
- **[Vitest](https://vitest.dev/):** Fast unit testing framework for modern JavaScript projects.
- **Plain CSS:** Custom styling without CSS frameworks, focusing on semantic and maintainable design.

---

## 🧩 Features

- 🔸 Modular web components using Lit
- 🔸 Client-side routing with Vaadin Router
- 🔸 Global state management via Zustand
- 🔸 Internationalization with i18n for multiple language support
- 🔸 Unit testing with Vitest
- 🔸 Optimized development experience powered by Vite
- 🔸 Responsive and accessible design principles

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── components/       # Reusable Lit components
│   ├── pages/            # Routed views
│   ├── store/            # Zustand state management
│   ├── i18n/             # Translation setup and resources
│   ├── router/           # Vaadin Router configuration
│   ├── styles/           # Global and component CSS
│   └── main.js           # Entry point
├── tests/                # Vitest unit tests
├── index.html
└── vite.config.js
```

---

## ⚙️ Setup & Development

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/ing-hub-case-study.git
cd ing-hub-case-study
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

### 4️⃣ Run Tests

```bash
npm run test
```

---

## 🌍 Internationalization

The app uses **i18n** for managing multiple languages.  
Language files are stored under `src/i18n/locales/`.  
You can switch languages dynamically during runtime.

---

## 🧠 Design & Architecture Notes

This project focuses on:

- Component-driven development using the **Lit** ecosystem
- Minimal external dependencies for clarity and maintainability
- Explicit routing and state flow for easy debugging
- Accessibility-first markup
- Production-grade build and test setup using **Vite** and **Vitest**

---

## 🧪 Testing

- Unit tests are written with **Vitest**.
- Each component and utility has a corresponding test file under `tests/`.
- Run all tests with:
  ```bash
  npm run test
  ```

---

## 📦 Build

To create a production build:

```bash
npm run build
```

The build artifacts will be available in the `/dist` folder.

---

## 💼 About

This repository serves as a technical case study for **ING Hub’s Frontend Developer recruitment process**, showcasing:

- Modern Web Component development practices
- Strong code organization and clarity
- State management, routing, testing, and internationalization in a cohesive setup

---

**Author:** [Bera Koç](https://github.com/<your-username>)  
**License:** MIT

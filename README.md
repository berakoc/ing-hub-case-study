# ING Hub Frontend Case Study

A frontend case study project built as part of the ING Hub recruitment process.
This project demonstrates proficiency in modern web development using **Lit**, **Vite**, and **TanStack Forms**, emphasizing clean architecture, modular components, production-ready testing, and CI/CD workflows.

---

## 🚀 Tech Stack

- **[Lit](https://lit.dev/):** Lightweight library for building fast, reusable web components.
- **[Vite](https://vitejs.dev/):** Lightning-fast build tool and bundler.
- **[Vaadin Router](https://vaadin.com/router):** Modern client-side router for web components.
- **[Zustand](https://github.com/pmndrs/zustand):** Minimal state management for predictable global state.
- **[i18n](https://www.i18next.com/):** Internationalization and localization support.
- **[Vitest](https://vitest.dev/):** Fast unit testing framework for modern JavaScript projects.
- **[TanStack Forms](https://tanstack.com/form):** Form handling library.
- **[Zod](https://zod.dev/):** Schema validation for TypeScript/JavaScript.
- **Plain CSS:** Custom styling without CSS frameworks, focusing on semantic and maintainable design.

---

## 🧩 Features

- 🔸 Modular web components using Lit
- 🔸 Client-side routing with Vaadin Router
- 🔸 Global state management via Zustand
- 🔸 Form handling with TanStack Forms and validation with Zod
- 🔸 Internationalization with i18n for multiple languages
- 🔸 Unit testing with Vitest
- 🔸 GitHub CI/CD pipeline for linting and testing on each commit
- 🔸 Production-ready build using Vite
- 🔸 Responsive and accessible design principles

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── components/       # Reusable Lit components
│   ├── layouts/          # Page layouts and structural components
│   ├── lib/              # Utilities, state, and helpers
│   ├── pages/            # Routed views
│   ├── i18n/             # Translation setup and resources
│   ├── main.js           # Entry point
│   └── routes.js         # Router configuration
├── tests/                # Vitest unit tests
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── lint-staged.config.js # Git hooks configuration
├── index.html
└── vite.config.js        # Vite configuration
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

### 4️⃣ Run Unit Tests

```bash
npm run test
```

### 5️⃣ Linting & Formatting

```bash
npm run lint
npm run format
```

---

## 🌍 Internationalization

The app uses **i18n** for managing multiple languages.
Language files are stored under `src/i18n/locales/`.
You can switch languages dynamically during runtime.

---

## 🧠 Design & Architecture Notes

- Component-driven development using **Lit**
- Minimal external dependencies for clarity and maintainability
- Explicit routing and state flow for easy debugging
- Accessibility-first markup
- Production-grade build and test setup using **Vite**, **Vitest**, and GitHub Actions
- Form handling with **TanStack Forms** and validation via **Zod**

---

## 🧪 Testing

- Unit tests are written with **Vitest**.
- Each component and utility has a corresponding test file under `tests/`.
- Run all tests with:

```bash
npm run test
```

---

## 🛠 CI/CD Pipeline

- Every push to GitHub triggers the pipeline
- Pipeline runs:
  - Linting checks
  - Unit tests

- Ensures code quality and prevents broken builds

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
- State management, routing, forms, validation, testing, and CI/CD in a cohesive setup

---

**Author:** [Bera Koç](https://github.com/<your-username>)

# DocuChat Frontend

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-lightgrey.svg)
![Tech](https://img.shields.io/badge/tech-React%20%7C%20Vite%20%7C%20Anime.js-blueviolet.svg)

**DocuChat** is a sophisticated, AI-powered document assistance platform. This frontend application provides a dual-interface system: a comprehensive **Admin Dashboard** for managing AI agents and documents, and a highly embeddable **Chat Widget** for end-user interaction.

---

## 📖 Table of Contents
- [Features](#-features)
- [Technical Architecture](#-technical-architecture)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [API Integration & Security](#-api-integration--security)
- [Project Structure](#-project-structure)

---

## 🚀 Features

### 🛠 Administrative Dashboard
*   **Client Management**: Create and configure distinct AI assistants for different clients or use cases.
*   **Document Ingestion**: Securely upload PDF documents to knowledge bases.
*   **Real-time Indexing**: Trigger backend vectorization processes to update AI knowledge instantly.
*   **Customization**: Live preview of widget settings including:
    *   Bot Name
    *   Welcome Message
    *   Brand Color Scheme

### 💬 Client Widget
*   **Embeddable Design**: Zero-dependency script for easy integration into any website.
*   **Interactive UI**: Smooth animations powered by Lottie and Anime.js.
*   **Contextual Awareness**: Session persistence to maintain chat history across page reloads.

---

## 🏗 Technical Architecture

This project is built as a static Single Page Application (SPA), optimized for performance and ease of deployment.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Core UI library for component-based architecture. |
| **Build Tool** | [Vite](https://vitejs.dev/) | Next-generation frontend tooling for fast builds. |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing for the Admin dashboard. |
| **Animation** | [Anime.js](https://animejs.com/) & [Lottie](https://airbnb.io/lottie/) | High-fidelity UI transitions and character animations. |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG iconography. |

---

## ⚡ Installation & Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-org/docuchat-frontend.git
    cd docuchat-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:5173`.

4.  **Production Build**
    ```bash
    npm run build
    ```
    Output files will be generated in the `dist/` directory, ready for static hosting (Vercel, Netlify, Github Pages).

---

## ⚙ Configuration

The application relies on environment variables for API connectivity. Create a `.env` file in the root directory:

```env
# URL for the backend API service
VITE_API_BASE_URL=https://icas00-docchat.hf.space
```

> **Note**: If not provided, the application may default to hardcoded fallbacks for development. It is strongly recommended to define this variable.

---

## 🔐 API Integration & Security

The frontend interacts with the backend using a **Dual-Key Authentication System**.

### 1. Security Keys

| Key Type | Header / Attribute | Source | Usage |
| :--- | :--- | :--- | :--- |
| **Admin Key** | `X-Admin-Key` | Generated on `/create` | **Critical**. Used for sensitive operations like uploading files, changing settings, and deleting data. Stored in Session Storage. |
| **Widget Key** | `data-api-key` | Generated on `/create` | **Public**. Embedded in the widget script to authenticate chat sessions. |

### 2. Critical Endpoints

| Action | Method | Endpoint | Required Auth | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Create Client** | `POST` | `/api/clients/create` | *None* | Returns the initial `apiKey` and `adminKey`. |
| **Update Settings** | `PUT` | `/api/clients/{clientId}/settings` | `X-Admin-Key` | Updates aesthetics and welcome messages. |
| **Upload Docs** | `POST` | `/api/clients/{clientId}/documents` | `X-Admin-Key` | Multiplayer `FormData` upload. |
| **Trigger Index** | `POST` | `/api/clients/{clientId}/index` | `X-Admin-Key` | Starts the RAG indexing process. |

---

## 📂 Project Structure

```bash
src/
├── animations/         # Lottie JSON animation files (Robot, UI elements)
├── components/         # Reusable UI components
│   ├── assistant-journey/ # Admin dashboard wizard steps
│   └── ...
├── pages/              # Main route views
│   ├── AdminPage.jsx   # Client creation & management portal
│   ├── TestClientPage.jsx # Playground for testing the widget
│   └── ...
├── sections/           # Landing page sections
├── styles/             # Global CSS and utility classes
└── utils/              # Helper functions and API wrappers
```

---

## 🧩 Widget Embedding

To deploy the chat assistant to a customer's website, use the following HTML snippet. Replace `${clientId}` with the actual ID generated from the Admin Panel.

```html
<script 
  src="https://your-frontend-domain.com/widget.js"
  data-api-key="${clientId}"
  id="docuchat-widget-script"
  defer>
</script>
```

---

*Documentation generated for DocuChat Frontend v0.1*

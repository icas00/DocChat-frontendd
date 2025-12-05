# UI-DocChat: Embeddable AI Chat Widget

![Project Banner](https://via.placeholder.com/1200x400?text=UI-DocChat+Banner)

> **Note:** This project is a demonstration of a modern, embeddable AI chat widget designed for multi-tenant SaaS platforms. It features a React frontend and a Spring Boot backend (documented separately).

## 🚀 Project Overview

UI-DocChat is a client-side library and dashboard that allows businesses to embed a custom AI chatbot into their websites. The chatbot uses RAG (Retrieval-Augmented Generation) to answer user queries based on uploaded documents.

**Key Features:**
- **Embeddable Widget:** A single script tag adds a fully functional chat widget to any HTML page.
- **Customizable UI:** Clients can match the widget's color, name, and welcome message to their brand.
- **Real-time Streaming:** Smooth, typewriter-style responses using Server-Sent Events (SSE).
- **Multi-Tenant Support:** Securely isolated data for each client.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS (via CSS variables/modules), Lucide React
- **Backend:** Java 17, Spring Boot 3, PostgreSQL (pgvector), LangChain4j (implied)
- **Deployment:** Docker, Nginx

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional, for containerized run)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ui-docchat.git
    cd ui-docchat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Copy `.env.example` to `.env` and update the values.
    ```bash
    cp .env.example .env
    ```
    *Set `VITE_API_BASE_URL` to your backend URL (default: `http://localhost:8080`).*

4.  **Run the dev server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

### 🐳 Docker Deployment

Build and run the frontend container:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
├── public/
│   └── widget.js       # The standalone script for embedding the widget
├── src/
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom hooks (useSession, etc.)
│   ├── pages/          # Application pages (Dashboard, Test Client)
│   └── utils/          # API helpers and constants
├── Dockerfile          # Frontend container definition
└── nginx.conf          # Nginx configuration for serving the app
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📄 License

MIT

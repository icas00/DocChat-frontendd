# DocChat Frontend — BotForge Chat Widget

React 19 frontend for **BotForge**, a low-latency RAG search platform. Backend: [DocuChat-Backend](https://github.com/icas00/DocuChat-Backend).

## Tech Stack
- **React 19**
- **Server-Sent Events (SSE)** client for streaming responses
- **Shadow DOM** for CSS isolation when embedded on third-party sites

## Key Features
- Embeddable chat widget that can drop into any website without CSS conflicts, via Shadow DOM
- Streams responses token-by-token from the backend over SSE for a fast, responsive feel
- Talks to the BotForge backend's reactive Spring WebFlux API

## Getting Started
```bash
npm install
npm start
```
Set the backend API URL (BotForge backend) via an environment variable before running.

## Related
- Backend: [DocuChat-Backend](https://github.com/icas00/DocuChat-Backend) — Spring Boot WebFlux + pgvector RAG pipeline

## License
MIT — see [LICENSE](LICENSE).

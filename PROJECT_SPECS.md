# Project Specifications & Constants

This document outlines the critical technical details, API endpoints, and logic that must be preserved when refactoring or rebuilding the UI for the DocuChat frontend.

## 1. API Configuration

*   **Base URL**: `https://icas00-docchat.hf.space`
    *   *Recommendation*: Move this to an environment variable (e.g., `VITE_API_BASE_URL`) in `.env` to avoid hardcoding.

## 2. Authentication & Security

The application uses a dual-key system. It is crucial to use the correct key for the correct context.

### A. Admin Actions (Backend Management)
*   **Header Name**: `X-Admin-Key`
*   **Value Source**: `clientData.adminKey` (Received from the `/create` endpoint).
*   **Usage**: Required for all administrative tasks:
    *   Updating settings (Name, Welcome Message, Color)
    *   Uploading documents
    *   Triggering indexing
    *   Deleting system data

### B. Widget / Public Access (Frontend Widget)
*   **Attribute**: `data-api-key`
*   **Value Source**: `clientData.apiKey` (also referred to as `clientId` in some contexts).
*   **Usage**: 
    *   Passed to the widget script tag to authenticate the chat session.
    *   Used in the URL for the Test Client page (`?clientId=...`).

## 3. Critical API Endpoints

These endpoints are currently implemented in `src/pages/AdminPage.jsx`.

| Feature | Method | Endpoint | Required Headers | Body / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Create Client** | `POST` | `/api/clients/create` | *None* | **Returns**: `{ clientId, apiKey, adminKey }`. <br> **Action**: Save this entire object to Session Storage. |
| **Update Settings** | `PUT` | `/api/clients/{clientId}/settings` | `X-Admin-Key` | **Body**: <br> `{ chatbotName, welcomeMessage, widgetColor }` |
| **Upload Document** | `POST` | `/api/clients/{clientId}/documents` | `X-Admin-Key` | **Body**: `FormData` containing the file field named `file`. |
| **Trigger Indexing** | `POST` | `/api/clients/{clientId}/index` | `X-Admin-Key` | **Note**: This request might timeout (504) or return 403. The frontend logic currently ignores these specific errors as the process continues in the background. |
| **System Clear** | `DELETE` | `/api/clients/admin/data` | `X-Admin-Key` | **Note**: This is a "Super Admin" feature. The user must manually input a special key to execute this. |

## 4. Essential Frontend Logic

### Session Management
*   **Storage Key**: `docuChatSession`
*   **Behavior**: 
    *   On app load (`AdminPage`), check `sessionStorage`.
    *   If data exists -> Load it.
    *   If missing -> Automatically call `/api/clients/create` and save the result.
    *   *Why*: This prevents the user from losing their progress (and their Admin Key) if they refresh the page.

### Widget Deployment Script
To successfully embed the widget, the generated HTML must match this structure exactly:

```html
<script 
  src="${window.location.origin}/widget.js"
  data-api-key="${clientId}"
  id="docuchat-widget-script"
  defer>
</script>
```

### Test Page Logic (`TestClientPage.jsx`)
*   **Purpose**: Simulates a real client website to test the widget.
*   **Logic**:
    1.  Checks URL for `?clientId=...`.
    2.  If not found, checks `sessionStorage`.
    3.  Dynamically creates a `<script>` tag and appends it to `document.body`.
    4.  Cleans up (removes script) on component unmount.

## 5. Key Files Reference

*   **`src/pages/AdminPage.jsx`**: Contains the master logic for the multi-step wizard and API calls.
*   **`src/pages/admin/StepDeploy.jsx`**: Handles the generation of the embed code.
*   **`src/pages/TestClientPage.jsx`**: The internal testing playground.
*   **`public/widget.js`**: The static JavaScript file that powers the chat widget itself.

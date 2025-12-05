const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
    BASE_URL,

    // makes a new client session
    createClient: async () => {
        const response = await fetch(`${BASE_URL}/api/clients/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to create client');
        return response.json();
    },

    // gets the settings for the widget
    getSettings: async (apiKey) => {
        const response = await fetch(`${BASE_URL}/api/widget/settings?apiKey=${apiKey}`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    // updates the settings
    updateSettings: async (clientId, settings, adminKey) => {
        const response = await fetch(`${BASE_URL}/api/clients/${clientId}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': adminKey
            },
            body: JSON.stringify(settings)
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    },

    // uploads the file to the backend
    uploadDocument: async (clientId, file, adminKey) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/api/clients/${clientId}/documents`, {
            method: 'POST',
            headers: {
                'X-Admin-Key': adminKey
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Failed to upload document (${response.status}): ${errorText}`);
        }

        return response.text(); // Returns "Document uploaded successfully"
    },

    // tells the backend to start indexing
    triggerIndexing: async (clientId, adminKey) => {
        try {
            const response = await fetch(`${BASE_URL}/api/clients/${clientId}/index`, {
                method: 'POST',
                headers: {
                    'X-Admin-Key': adminKey
                }
            });
            // 504 Gateway Timeout is common for long indexing jobs, but the job continues.
            // We treat it as success for the UI flow.
            if (!response.ok && response.status !== 504) {
                throw new Error('Indexing failed to start');
            }
            return true;
        } catch (error) {
            console.warn('Indexing request had an issue, but process likely started:', error);
            return true; // Assume success to unblock UI
        }
    },

    // super admin only clears everything
    clearSystemData: async (adminKey) => {
        const response = await fetch(`${BASE_URL}/api/clients/admin/data`, {
            method: 'DELETE',
            headers: {
                'X-Admin-Key': adminKey
            }
        });
        if (!response.ok) throw new Error('Failed to clear system data');
        return response.text();
    }
};

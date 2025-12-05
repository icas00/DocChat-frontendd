import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Settings, Palette, MessageSquare, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import '../styles/TestClientPage.css';

const TestClientPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const scriptRef = useRef(null);
    const [apiKey, setApiKey] = useState(null);

    // Customizer State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [settings, setSettings] = useState({
        widgetColor: '#007aff',
        chatbotName: 'AI Assistant',
        welcomeMessage: 'Hi! How can I help you today?'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Get API Key from URL or Session
        const urlApiKey = searchParams.get('clientId');
        const sessionData = sessionStorage.getItem('docuChatSession');
        let key = urlApiKey;

        if (!key && sessionData) {
            key = JSON.parse(sessionData).apiKey;
        }

        if (key) {
            setApiKey(key);

            // Fetch initial settings
            api.getSettings(key).then(data => {
                if (data) setSettings(prev => ({ ...prev, ...data }));
            }).catch(err => console.error("Failed to fetch settings:", err));

            // Inject Widget Script
            if (!document.getElementById('docuchat-widget-script')) {
                const script = document.createElement('script');
                script.id = 'docuchat-widget-script';
                script.src = '/widget.js';
                script.setAttribute('data-api-key', key);
                script.setAttribute('data-backend-url', 'https://icas00-docchat.hf.space'); // Explicitly set backend
                script.defer = true;
                document.body.appendChild(script);
                scriptRef.current = script;
            }
        } else {
            navigate('/');
        }

        return () => {
            const script = document.getElementById('docuchat-widget-script');
            const host = document.getElementById('docuchat-widget-host');
            if (script) script.remove();
            if (host) host.remove();
        };
    }, [searchParams, navigate]);

    const handleUpdate = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        // Live Preview
        if (window.DocuChat && window.DocuChat.updateSettings) {
            window.DocuChat.updateSettings(newSettings);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const sessionData = sessionStorage.getItem('docuChatSession');
            const session = sessionData ? JSON.parse(sessionData) : null;

            if (session && session.adminKey && session.clientId) {
                await api.updateSettings(session.clientId, settings, session.adminKey);
                // Visual feedback could be added here
            } else {
                console.warn('Cannot save: Missing admin permissions.');
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!apiKey) return null;

    return (
        <div className="test-client-container">
            {/* Customizer Sidebar */}
            <div className={`customizer-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
                <button
                    className="customizer-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Settings size={20} />
                    <h2 style={{ margin: 0, fontSize: '1.2em' }}>Customizer</h2>
                </div>

                <div className="customizer-group">
                    <label><Palette size={16} style={{ display: 'inline', marginRight: '8px' }} /> Widget Color</label>
                    <input
                        type="color"
                        className="customizer-input"
                        style={{ height: '40px', padding: '5px' }}
                        value={settings.widgetColor}
                        onChange={(e) => handleUpdate('widgetColor', e.target.value)}
                    />
                </div>

                <div className="customizer-group">
                    <label><MessageSquare size={16} style={{ display: 'inline', marginRight: '8px' }} /> Chatbot Name</label>
                    <input
                        type="text"
                        className="customizer-input"
                        value={settings.chatbotName}
                        onChange={(e) => handleUpdate('chatbotName', e.target.value)}
                    />
                </div>

                <div className="customizer-group">
                    <label>Welcome Message</label>
                    <textarea
                        className="customizer-input"
                        rows="3"
                        value={settings.welcomeMessage}
                        onChange={(e) => handleUpdate('welcomeMessage', e.target.value)}
                    />
                </div>

                <button
                    className="customizer-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="main-content">
                <h1>Test Your AI Assistant</h1>
                <p>Your chatbot has been successfully deployed to this test environment.</p>

                <div className="demo-card">
                    <h2>Instructions</h2>
                    <p>The chat widget should appear in the bottom-right corner of this page.</p>
                    <p>Try asking questions related to the documents you uploaded to verify the RAG pipeline is working correctly.</p>
                    <p style={{ marginTop: '10px', color: 'var(--accent)', fontWeight: '500' }}>
                        Tip: Use the sidebar to customize the widget's appearance in real-time!
                    </p>
                </div>

                <div className="nav-link">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
                        <ArrowLeft style={{ display: 'inline', width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle' }} />
                        Back to Admin Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TestClientPage;

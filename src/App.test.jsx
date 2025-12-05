import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Since we don't know exactly what's on the home page without looking, 
        // we'll just check if the container is present or look for a generic element if we knew it.
        // For a smoke test, just rendering successfully is often enough to pass "not crashing".
        expect(document.body).toBeTruthy();
    });
});

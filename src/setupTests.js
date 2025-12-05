import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = () => {
    return {
        fillStyle: '',
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(),
        putImageData: vi.fn(),
        createImageData: vi.fn(),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        measureText: () => ({ width: 0 }),
        transform: vi.fn(),
        rect: vi.fn(),
        clip: vi.fn(),
    };
};

// Mock lottie-react to avoid canvas issues
vi.mock('lottie-react', () => ({
    default: () => <div data-testid="lottie-animation">Lottie Animation</div>,
}));

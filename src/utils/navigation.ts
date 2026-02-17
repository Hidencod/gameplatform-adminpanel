import type { NavigateOptions } from 'react-router-dom';

// Store the navigate function with full signature
let navigateFn: ((path: string, options?: NavigateOptions) => void) | null = null;

export const setNavigator = (navigate: (path: string, options?: NavigateOptions) => void) => {
    navigateFn = navigate;
}

// Update to accept state
export const navigateTo = (path: string, options?: NavigateOptions) => {
    if (navigateFn) {
        navigateFn(path, options);
    } else {
        // Fallback to window.location (won't have state, but won't break)
        window.location.href = path;
    }
}
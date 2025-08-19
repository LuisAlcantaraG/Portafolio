// Transaction storage utility for managing persistent data
const TRANSACTIONS_KEY = 'warehouse_transactions';

// Get transactions from localStorage
export const getStoredTransactions = () => {
    try {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    } catch (error) {
        console.error('Error loading transactions from storage:', error);
        return [];
    }
};

// Save transactions to localStorage
export const saveTransactions = (transactions) => {
    try {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transactions to storage:', error);
        return false;
    }
};

// Add a single transaction
export const addTransaction = (transaction) => {
    try {
        const existingTransactions = getStoredTransactions();
        const newTransaction = {
            ...transaction,
            id: Date.now() + Math.random(), // Ensure unique ID
            timestamp: new Date()?.toISOString()
        };

        const updatedTransactions = [newTransaction, ...existingTransactions];
        saveTransactions(updatedTransactions);
        return newTransaction;
    } catch (error) {
        console.error('Error adding transaction:', error);
        return null;
    }
};

// Clear all transactions
export const clearAllTransactions = () => {
    try {
        localStorage.removeItem(TRANSACTIONS_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing transactions:', error);
        return false;
    }
};

// Initialize with default transactions if none exist
export const initializeDefaultTransactions = () => {
    const existing = getStoredTransactions();
    if (existing?.length === 0) {
        const defaultTransactions = [
            {
                id: 1,
                date: '2025-08-17',
                timestamp: '2025-08-17T10:30:00',
                classification: 'bodega',
                material: 'Tornillos M8x20',
                quantity: 500,
                type: 'entrada'
            },
            {
                id: 2,
                date: '2025-08-17',
                timestamp: '2025-08-17T11:45:00',
                classification: 'solventes',
                material: 'Acetona Industrial',
                quantity: 25,
                type: 'salida'
            },
            {
                id: 3,
                date: '2025-08-17',
                timestamp: '2025-08-17T14:20:00',
                classification: 'poliuretano',
                material: 'Resina Poliuretano A',
                quantity: 100,
                type: 'entrada'
            }
        ];
        saveTransactions(defaultTransactions);
        return defaultTransactions;
    }
    return existing;
};
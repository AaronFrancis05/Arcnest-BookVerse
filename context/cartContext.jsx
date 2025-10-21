// context/cartContext.js
'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item =>
                item.id === action.payload.id && item.type === action.payload.type
            );
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id && item.type === action.payload.type
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item =>
                    !(item.id === action.payload.id && item.type === action.payload.type)
                )
            };

        case 'UPDATE_QUANTITY':
            if (action.payload.quantity < 1) {
                return {
                    ...state,
                    items: state.items.filter(item =>
                        !(item.id === action.payload.id && item.type === action.payload.type)
                    )
                };
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id && item.type === action.payload.type
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        case 'LOAD_CART':
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : []
            };

        default:
            return state;
    }
};

const initialState = {
    items: []
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('bookverse-cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                dispatch({
                    type: 'LOAD_CART',
                    payload: Array.isArray(parsedCart) ? parsedCart : []
                });
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            dispatch({ type: 'LOAD_CART', payload: [] });
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('bookverse-cart', JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [state.items]);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (item) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    };

    const updateQuantity = (item, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return Array.isArray(state.items)
            ? state.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
            : 0;
    };

    const getCartItemsCount = () => {
        return Array.isArray(state.items)
            ? state.items.reduce((total, item) => total + (item.quantity || 1), 0)
            : 0;
    };

    const value = {
        cartItems: Array.isArray(state.items) ? state.items : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        // Return a safe fallback if context is not available
        return {
            cartItems: [],
            addToCart: () => console.warn('Cart context not available'),
            removeFromCart: () => console.warn('Cart context not available'),
            updateQuantity: () => console.warn('Cart context not available'),
            clearCart: () => console.warn('Cart context not available'),
            getCartTotal: () => 0,
            getCartItemsCount: () => 0
        };
    }
    return context;
}
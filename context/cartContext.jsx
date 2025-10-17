'use client'
// context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Load cart from localStorage
const loadCartFromStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            const savedCart = localStorage.getItem('bookverse-cart');
            return savedCart ? JSON.parse(savedCart) : { cartItems: [] };
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return { cartItems: [] };
        }
    }
    return { cartItems: [] };
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('bookverse-cart', JSON.stringify(state));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }
};

const cartReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case 'ADD_TO_CART':
            // Check if item already exists in cart
            const existingItemIndex = state.cartItems.findIndex(
                item => item.id === action.payload.id && item.type === action.payload.type
            );

            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                newState = {
                    ...state,
                    cartItems: state.cartItems.map((item, index) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            } else {
                // Add new item
                newState = {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload }]
                };
            }
            break;

        case 'REMOVE_FROM_CART':
            newState = {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload)
            };
            break;

        case 'CLEAR_CART':
            newState = {
                ...state,
                cartItems: []
            };
            break;

        case 'UPDATE_QUANTITY':
            newState = {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
            break;

        case 'LOAD_CART':
            return action.payload;

        default:
            return state;
    }

    // Save to localStorage after each action
    saveCartToStorage(newState);
    return newState;
};

const initialState = {
    cartItems: []
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = loadCartFromStorage();
        dispatch({ type: 'LOAD_CART', payload: savedCart });
    }, []);

    const addToCart = (book, type) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                ...book,
                type,
                quantity: 1,
                id: `${book.id}-${type}` // Unique ID combining book ID and type
            }
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
    };

    const getTotalPrice = () => {
        return state.cartItems.reduce((total, item) => {
            const price = item.type === 'borrow' ? item.borrowPrice || 5 : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems: state.cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            getTotalPrice,
            getTotalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
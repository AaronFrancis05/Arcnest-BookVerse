"use client"
// context/cartContext.js
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item =>
                item.id === action.payload.id && item.type === action.payload.type
            );

            if (existingItem) {
                console.log('Item already in cart, increasing quantity:', existingItem.title);
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id && item.type === action.payload.type
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }

            console.log('Adding new item to cart:', action.payload.title);
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.itemId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return { ...state, items: [] };

        default:
            return state;
    }
};

const initialState = {
    items: []
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        console.log('Dispatching ADD_TO_CART for:', item.title, 'type:', item.type);
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotalPrice = () => {
        return state.items.reduce((total, item) => {
            const itemPrice = item.type === 'borrow' ? (item.borrowPrice || 5) : item.price;
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const getCartItemsCount = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
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
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
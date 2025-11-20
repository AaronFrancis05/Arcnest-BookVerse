"use client"
// components/BookCart.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTrash2,
    FiPlus,
    FiMinus,
    FiCreditCard,
    FiSmartphone,
    FiArrowLeft,
    FiShoppingBag,
    FiUser,
    FiAlertCircle,
    FiBook,
    FiClock
} from 'react-icons/fi';
import { useCart } from '@context/cartContext';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function BookCart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [selectedPayment, setSelectedPayment] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const { user, isSignedIn } = useUser();

    // Separate purchased and borrowed items
    const purchasedItems = cartItems.filter(item => item.type === 'purchase');
    const borrowedItems = cartItems.filter(item => item.type === 'borrow');

    // Group items by author for better organization
    const groupItemsByAuthor = (items) => {
        const grouped = {};
        items.forEach(item => {
            if (!grouped[item.author]) {
                grouped[item.author] = [];
            }
            grouped[item.author].push(item);
        });
        return grouped;
    };

    const purchasedByAuthor = groupItemsByAuthor(purchasedItems);
    const borrowedByAuthor = groupItemsByAuthor(borrowedItems);

    // Calculate totals correctly for each item
    const getPurchasedTotal = () => {
        return purchasedItems.reduce((total, item) => {
            const itemPrice = getItemPrice(item);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const getBorrowedTotal = () => {
        return borrowedItems.reduce((total, item) => {
            const itemPrice = getItemPrice(item);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const getTotalPrice = () => {
        return getPurchasedTotal() + getBorrowedTotal();
    };

    // Format currency in UGX
    const formatUGX = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Get item price - each item has its own independent price
    const getItemPrice = (item) => {
        if (item.type === 'borrow') {
            return 5000; // Fixed 5000 UGX for borrowing
        }
        
        // For purchase, use the actual price from the item
        // Each book maintains its own price independently
        if (item.price && typeof item.price === 'number') {
            return item.price;
        }
        
        // Fallback price if not provided (shouldn't happen with proper data)
        return 15000; // Default fallback price
    };

    // Get item display type
    const getItemTypeDisplay = (item) => {
        return item.type === 'borrow' ? 'Borrow' : 'Purchase';
    };

    // Track cart view event
    useEffect(() => {
        if (cartItems.length > 0) {
            fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'page_view',
                    userId: user?.id,
                    metadata: { 
                        page: 'cart', 
                        itemCount: cartItems.length,
                        purchasedCount: purchasedItems.length,
                        borrowedCount: borrowedItems.length
                    }
                }),
            });
        }
    }, [cartItems.length, purchasedItems.length, borrowedItems.length, user?.id]);

    const handlePayment = async () => {
        if (!isSignedIn) {
            setShowLoginPrompt(true);
            return;
        }

        if (!selectedPayment || !phoneNumber) {
            alert('Please select payment method and enter phone number');
            return;
        }

        // Validate phone number format for Uganda numbers
        const isValidPhone = validateUgandaPhoneNumber(phoneNumber);
        if (!isValidPhone) {
            alert('Please enter a valid Uganda phone number\n\nAccepted formats:\n• 07XXXXXXXX (e.g., 07448388323)\n• 256XXXXXXXXX (e.g., 2567448388323)\n• +256XXXXXXXXX (e.g., +2567448388323)');
            return;
        }

        setIsProcessing(true);

        try {
            // Log payment attempt event
            await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'payment_attempt',
                    userId: user.id,
                    metadata: {
                        provider: selectedPayment,
                        amount: getTotalPrice(),
                        itemCount: cartItems.length,
                        purchasedCount: purchasedItems.length,
                        borrowedCount: borrowedItems.length,
                        phoneNumber: formatPhoneForAPI(phoneNumber)
                    }
                }),
            });

            // Create order in database
            const orderData = {
                items: cartItems.map(item => ({
                    bookId: item.id,
                    title: item.title,
                    author: item.author,
                    type: item.type,
                    price: getItemPrice(item),
                    quantity: item.quantity,
                    borrowDuration: item.type === 'borrow' ? 14 : undefined
                })),
                totalAmount: getTotalPrice(),
                paymentMethod: selectedPayment,
                paymentStatus: 'pending',
                customerPhone: formatPhoneForAPI(phoneNumber),
                shippingAddress: {
                    phone: formatPhoneForAPI(phoneNumber)
                }
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const order = await response.json();

                // Simulate payment processing
                const paymentSuccess = await processMobilePayment({
                    provider: selectedPayment,
                    phoneNumber: formatPhoneForAPI(phoneNumber),
                    amount: getTotalPrice(),
                    orderId: order.orderId
                });

                if (paymentSuccess) {
                    // Update order status to paid
                    await fetch(`/api/orders/${order._id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentStatus: 'paid',
                            status: 'completed',
                            transactionId: 'TX' + Date.now()
                        }),
                    });

                    // Log successful payment event
                    await fetch('/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'payment_success',
                            userId: user.id,
                            metadata: {
                                orderId: order.orderId,
                                amount: getTotalPrice(),
                                purchasedAmount: getPurchasedTotal(),
                                borrowedAmount: getBorrowedTotal(),
                                transactionId: 'TX' + Date.now(),
                                phoneNumber: formatPhoneForAPI(phoneNumber)
                            }
                        }),
                    });

                    // Log purchase events for each item
                    cartItems.forEach(item => {
                        fetch('/api/events', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                type: item.type === 'borrow' ? 'book_borrow' : 'book_purchase',
                                userId: user.id,
                                metadata: {
                                    bookId: item.id,
                                    title: item.title,
                                    author: item.author,
                                    quantity: item.quantity,
                                    price: getItemPrice(item),
                                    orderId: order.orderId
                                }
                            }),
                        });
                    });

                    alert(`Payment successful! 🎉\nOrder ID: ${order.orderId}\n\nPurchased: ${formatUGX(getPurchasedTotal())}\nBorrowed: ${formatUGX(getBorrowedTotal())}\nTotal: ${formatUGX(getTotalPrice())}\n\nYou will receive a ${selectedPayment === 'airtel' ? 'Airtel Money' : 'MTN Mobile Money'} prompt on ${formatPhoneForDisplay(phoneNumber)} shortly.`);
                    clearCart();
                } else {
                    throw new Error('Payment processing failed');
                }
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            // Log payment failure event
            await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'payment_failed',
                    userId: user?.id,
                    metadata: {
                        error: error.message,
                        phoneNumber: formatPhoneForAPI(phoneNumber)
                    }
                }),
            });

            alert('Payment error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper functions
    const validateUgandaPhoneNumber = (phone) => {
        const cleanPhone = phone.replace(/\s/g, '');

        const phonePatterns = [
            /^(07[0-9]{8})$/,
            /^(2567[0-9]{8})$/,
            /^(\+2567[0-9]{8})$/,
        ];

        return phonePatterns.some(pattern => pattern.test(cleanPhone));
    };

    const formatPhoneForAPI = (phone) => {
        const cleanPhone = phone.replace(/\s/g, '');

        if (cleanPhone.startsWith('07')) {
            return '256' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('+256')) {
            return cleanPhone.substring(1);
        }

        return cleanPhone;
    };

    const formatPhoneForDisplay = (phone) => {
        const cleanPhone = phone.replace(/\s/g, '');

        if (cleanPhone.startsWith('07') && cleanPhone.length === 10) {
            return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        } else if ((cleanPhone.startsWith('256') || cleanPhone.startsWith('+256')) && cleanPhone.length >= 12) {
            const digits = cleanPhone.replace('+', '');
            return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        }

        return phone;
    };

    const formatPhoneInput = (value) => {
        const cleanValue = value.replace(/[^\d+]/g, '');

        if (cleanValue.startsWith('+256') && cleanValue.length > 13) {
            return cleanValue.substring(0, 13);
        } else if (cleanValue.startsWith('256') && cleanValue.length > 12) {
            return cleanValue.substring(0, 12);
        } else if (cleanValue.startsWith('07') && cleanValue.length > 10) {
            return cleanValue.substring(0, 10);
        } else if (!cleanValue.startsWith('07') && !cleanValue.startsWith('256') && !cleanValue.startsWith('+256') && cleanValue.length > 10) {
            return cleanValue.substring(0, 10);
        }

        return cleanValue;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneInput(e.target.value);
        setPhoneNumber(formatted);
    };

    const processMobilePayment = async (paymentData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1;
                resolve(success);
            }, 3000);
        });
    };

    // Quantity functions - each item is independent
    const increaseQuantity = (item) => {
        updateQuantity(item.id, item.type, item.quantity + 1);

        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'cart_update',
                userId: user?.id,
                metadata: {
                    action: 'increase_quantity',
                    bookId: item.id,
                    title: item.title,
                    author: item.author,
                    type: item.type,
                    newQuantity: item.quantity + 1
                }
            }),
        });
    };

    const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.type, item.quantity - 1);

            fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'cart_update',
                    userId: user?.id,
                    metadata: {
                        action: 'decrease_quantity',
                        bookId: item.id,
                        title: item.title,
                        author: item.author,
                        type: item.type,
                        newQuantity: item.quantity - 1
                    }
                }),
            });
        }
    };

    const handleRemoveFromCart = (item) => {
        removeFromCart(item.id, item.type);

        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'cart_remove',
                userId: user?.id,
                metadata: {
                    bookId: item.id,
                    title: item.title,
                    author: item.author,
                    type: item.type
                }
            }),
        });
    };

    const handleClearCart = () => {
        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'cart_clear',
                userId: user?.id,
                metadata: {
                    itemCount: cartItems.length,
                    purchasedCount: purchasedItems.length,
                    borrowedCount: borrowedItems.length,
                    totalAmount: getTotalPrice()
                }
            }),
        });

        clearCart();
    };

    // Render cart item component - each item is independent
    const CartItem = ({ item }) => {
        const itemPrice = getItemPrice(item);
        const totalPrice = itemPrice * item.quantity;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Book Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 shadow-md ${
                            item.type === 'borrow' 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        }`}>
                            {item.type === 'borrow' ? <FiClock className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiBook className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                by {item.author}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                    item.type === 'borrow'
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}>
                                    {getItemTypeDisplay(item)}
                                </span>
                                {item.type === 'borrow' && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <FiClock className="w-3 h-3 mr-1" />
                                        14 days
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">
                                    {formatUGX(itemPrice)} each
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Controls and Price */}
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-lg p-1">
                            <button
                                onClick={() => decreaseQuantity(item)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium text-gray-700">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => increaseQuantity(item)}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-white transition-colors"
                                aria-label="Increase quantity"
                            >
                                <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="text-right">
                                <div className="font-semibold text-gray-800 text-sm sm:text-base">
                                    {formatUGX(totalPrice)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.quantity} × {formatUGX(itemPrice)}
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveFromCart(item)}
                                className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove item"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Render author section
    const AuthorSection = ({ author, items, type }) => (
        <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    type === 'borrow' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                    <span className={`font-bold text-sm ${
                        type === 'borrow' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                        {author.charAt(0)}
                    </span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{author}</h3>
                    <p className="text-xs text-gray-500">
                        {items.length} {items.length === 1 ? 'book' : 'books'} to {type}
                    </p>
                </div>
            </div>
            <div className="space-y-3">
                <AnimatePresence>
                    {items.map((item) => (
                        <CartItem key={`${item.id}-${item.type}`} item={item} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 px-4"
            >
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <FiShoppingBag className="text-3xl text-gray-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some books to get started with your reading journey!</p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FiArrowLeft className="text-lg" />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            {/* Login Prompt Modal */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLoginPrompt(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <FiAlertCircle className="text-yellow-500 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-800">Sign In Required</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Please sign in to complete your purchase and access your reading history.
                            </p>
                            <div className="flex space-x-3">
                                <Link
                                    href="/sign-in"
                                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-center hover:bg-indigo-700 transition-colors"
                                    onClick={() => setShowLoginPrompt(false)}
                                >
                                    Sign In
                                </Link>
                                <button
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 py-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Review your items and proceed to checkout
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </span>
                        {purchasedItems.length > 0 && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {purchasedItems.length} to purchase
                            </span>
                        )}
                        {borrowedItems.length > 0 && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {borrowedItems.length} to borrow
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {isSignedIn && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiUser className="text-indigo-500" />
                            <span>Hello, {user.firstName || user.username}</span>
                        </div>
                    )}
                    <button
                        onClick={handleClearCart}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 p-2 sm:p-0 transition-colors"
                    >
                        <FiTrash2 className="text-lg" />
                        <span className="text-sm sm:text-base">Clear Cart</span>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Purchased Items Section */}
                    {purchasedItems.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <FiBook className="text-blue-600 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Books to Purchase</h2>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {purchasedItems.length} books
                                </span>
                            </div>
                            <div className="space-y-4">
                                {Object.keys(purchasedByAuthor).map(author => (
                                    <AuthorSection 
                                        key={`purchase-${author}`}
                                        author={author}
                                        items={purchasedByAuthor[author]}
                                        type="purchase"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Borrowed Items Section */}
                    {borrowedItems.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <FiClock className="text-green-600 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Books to Borrow</h2>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {borrowedItems.length} books
                                </span>
                            </div>
                            <div className="space-y-4">
                                {Object.keys(borrowedByAuthor).map(author => (
                                    <AuthorSection 
                                        key={`borrow-${author}`}
                                        author={author}
                                        items={borrowedByAuthor[author]}
                                        type="borrow"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Payment Summary</h2>

                        {/* Items List */}
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                            {purchasedItems.length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold text-blue-600 mb-2">PURCHASE ITEMS</div>
                                    {purchasedItems.map((item) => (
                                        <div key={`${item.id}-purchase-summary`} className="flex justify-between text-xs sm:text-sm mb-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="text-gray-600 truncate font-medium">
                                                    {item.title}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    by {item.author}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {item.quantity} × {formatUGX(getItemPrice(item))} • Purchase
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-800 ml-2 flex-shrink-0">
                                                {formatUGX(getItemPrice(item) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {borrowedItems.length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold text-green-600 mb-2 mt-3">BORROW ITEMS</div>
                                    {borrowedItems.map((item) => (
                                        <div key={`${item.id}-borrow-summary`} className="flex justify-between text-xs sm:text-sm mb-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="text-gray-600 truncate font-medium">
                                                    {item.title}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    by {item.author}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {item.quantity} × {formatUGX(getItemPrice(item))} • Borrow (14 days)
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-800 ml-2 flex-shrink-0">
                                                {formatUGX(getItemPrice(item) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6 space-y-2">
                            {purchasedItems.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Purchase Total:</span>
                                    <span className="font-medium text-blue-600">{formatUGX(getPurchasedTotal())}</span>
                                </div>
                            )}
                            {borrowedItems.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Borrow Total:</span>
                                    <span className="font-medium text-green-600">{formatUGX(getBorrowedTotal())}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="font-bold text-gray-800 text-sm sm:text-base">Total Amount:</span>
                                <span className="font-bold text-lg sm:text-xl text-indigo-600">
                                    {formatUGX(getTotalPrice())}
                                </span>
                            </div>
                        </div>

                        {/* User Status */}
                        {!isSignedIn && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                            >
                                <div className="flex items-center space-x-2 text-yellow-800">
                                    <FiUser className="text-sm" />
                                    <span className="text-sm font-medium">Sign in for faster checkout</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Payment Method Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPayment('airtel')}
                                    className={`p-2 sm:p-3 border-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 transition-all text-xs sm:text-sm ${selectedPayment === 'airtel'
                                        ? 'border-red-600 bg-red-50 text-red-600 shadow-sm'
                                        : 'border-gray-300 hover:border-red-600 bg-white'
                                        }`}
                                >
                                    <FiSmartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Airtel Money</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedPayment('mtn')}
                                    className={`p-2 sm:p-3 border-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 transition-all text-xs sm:text-sm ${selectedPayment === 'mtn'
                                        ? 'border-yellow-600 bg-yellow-50 text-yellow-600 shadow-sm'
                                        : 'border-gray-300 hover:border-yellow-600 bg-white'
                                        }`}
                                >
                                    <FiSmartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>MTN Mobile</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Phone Number Input */}
                        {selectedPayment && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-4"
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {selectedPayment === 'airtel' ? 'Airtel' : 'MTN'} Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="07448388323 or 2567448388323 or +2567448388323"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <div className="text-xs text-gray-500 mt-1 space-y-1">
                                    <p>✓ Accepts Uganda numbers only</p>
                                    <p>✓ Formats: 07XXXXXXXX, 256XXXXXXXXX, +256XXXXXXXXX</p>
                                    <p>✓ Works with both MTN and Airtel</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Checkout Button */}
                        <motion.button
                            whileHover={{ scale: selectedPayment && phoneNumber ? 1.02 : 1 }}
                            whileTap={{ scale: selectedPayment && phoneNumber ? 0.98 : 1 }}
                            onClick={handlePayment}
                            disabled={isProcessing || !selectedPayment || !phoneNumber}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 text-sm sm:text-base font-medium shadow-lg disabled:shadow-none"
                        >
                            {isProcessing ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            <span>
                                {isProcessing ? 'Processing...' : `Pay ${formatUGX(getTotalPrice())}`}
                            </span>
                        </motion.button>

                        {/* Payment Instructions */}
                        {selectedPayment && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-700"
                            >
                                <p className="font-medium mb-1">Payment Instructions:</p>
                                <p>
                                    {selectedPayment === 'airtel'
                                        ? `You will receive an Airtel Money prompt on ${formatPhoneForDisplay(phoneNumber)}. Enter your PIN to complete payment.`
                                        : `You will receive an MTN Mobile Money prompt on ${formatPhoneForDisplay(phoneNumber)}. Enter your PIN to complete payment.`
                                    }
                                </p>
                            </motion.div>
                        )}

                        {/* Security Notice */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                🔒 Secure payment • 📚 Instant access • 👍 100% Satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
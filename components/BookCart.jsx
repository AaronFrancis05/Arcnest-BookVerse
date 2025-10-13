"use client"
// components/BookCart.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { useCart } from '@context/cartContext';

export default function BookCart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
    const [selectedPayment, setSelectedPayment] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (!selectedPayment || !phoneNumber) {
            alert('Please select payment method and enter phone number');
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate API call to payment gateway
            const paymentData = {
                provider: selectedPayment,
                phoneNumber,
                amount: getTotalPrice(),
                items: cartItems
            };

            // Here you would integrate with actual Airtel/MTN APIs
            const response = await processMobilePayment(paymentData);

            if (response.success) {
                alert('Payment successful!');
                clearCart();
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            alert('Payment error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const processMobilePayment = async (paymentData) => {
        // Simulate API call - Replace with actual Airtel/MTN integration
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, transactionId: 'TX' + Date.now() });
            }, 2000);
        });
    };

    const increaseQuantity = (item) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    const getItemPrice = (item) => {
        return item.type === 'borrow' ? item.borrowPrice || 5 : item.price;
    };

    if (cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
                <p className="text-gray-500">Add some books to get started!</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 flex items-center space-x-2"
                >
                    <FiTrash2 />
                    <span>Clear Cart</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                        {item.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.author}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'borrow'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {item.type === 'borrow' ? 'Borrow' : 'Purchase'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => decreaseQuantity(item)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item)}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-800">
                                            ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ${getItemPrice(item)} each
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

                    <div className="space-y-3 mb-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.title} ({item.type})
                                </span>
                                <span>${(getItemPrice(item) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3 mb-6">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setSelectedPayment('airtel')}
                                className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'airtel'
                                        ? 'border-red-600 bg-red-50 text-red-600'
                                        : 'border-gray-300 hover:border-red-600'
                                    }`}
                            >
                                <FiSmartphone />
                                <span>Airtel Money</span>
                            </button>
                            <button
                                onClick={() => setSelectedPayment('mtn')}
                                className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'mtn'
                                        ? 'border-yellow-600 bg-yellow-50 text-yellow-600'
                                        : 'border-gray-300 hover:border-yellow-600'
                                    }`}
                            >
                                <FiSmartphone />
                                <span>MTN Mobile</span>
                            </button>
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
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </motion.div>
                    )}

                    {/* Checkout Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={isProcessing || !selectedPayment || !phoneNumber}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        <FiCreditCard />
                        <span>
                            {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
                        </span>
                    </motion.button>

                    {/* Payment Instructions */}
                    {selectedPayment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700"
                        >
                            {selectedPayment === 'airtel'
                                ? 'You will receive an Airtel Money prompt on your phone to complete the payment.'
                                : 'You will receive an MTN Mobile Money prompt on your phone to complete the payment.'
                            }
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
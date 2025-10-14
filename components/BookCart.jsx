// "use client"
// // components/BookCart.js
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiTrash2, FiPlus, FiMinus, FiCreditCard, FiSmartphone } from 'react-icons/fi';
// import { useCart } from '@context/cartContext';

// export default function BookCart() {
//     const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
//     const [selectedPayment, setSelectedPayment] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handlePayment = async () => {
//         if (!selectedPayment || !phoneNumber) {
//             alert('Please select payment method and enter phone number');
//             return;
//         }

//         setIsProcessing(true);

//         try {
//             // Simulate API call to payment gateway
//             const paymentData = {
//                 provider: selectedPayment,
//                 phoneNumber,
//                 amount: getTotalPrice(),
//                 items: cartItems
//             };

//             // Here you would integrate with actual Airtel/MTN APIs
//             const response = await processMobilePayment(paymentData);

//             if (response.success) {
//                 alert('Payment successful!');
//                 clearCart();
//             } else {
//                 alert('Payment failed. Please try again.');
//             }
//         } catch (error) {
//             alert('Payment error: ' + error.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     const processMobilePayment = async (paymentData) => {
//         // Simulate API call - Replace with actual Airtel/MTN integration
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve({ success: true, transactionId: 'TX' + Date.now() });
//             }, 2000);
//         });
//     };

//     const increaseQuantity = (item) => {
//         updateQuantity(item.id, item.quantity + 1);
//     };

//     const decreaseQuantity = (item) => {
//         if (item.quantity > 1) {
//             updateQuantity(item.id, item.quantity - 1);
//         }
//     };

//     const getItemPrice = (item) => {
//         return item.type === 'borrow' ? item.borrowPrice || 5 : item.price;
//     };

//     if (cartItems.length === 0) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12"
//             >
//                 <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
//                 <p className="text-gray-500">Add some books to get started!</p>
//             </motion.div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="max-w-4xl mx-auto"
//         >
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
//                 <button
//                     onClick={clearCart}
//                     className="text-red-600 hover:text-red-700 flex items-center space-x-2"
//                 >
//                     <FiTrash2 />
//                     <span>Clear Cart</span>
//                 </button>
//             </div>

//             <div className="grid lg:grid-cols-3 gap-8">
//                 {/* Cart Items */}
//                 <div className="lg:col-span-2 space-y-4">
//                     <AnimatePresence>
//                         {cartItems.map((item) => (
//                             <motion.div
//                                 key={item.id}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 exit={{ opacity: 0, x: 20 }}
//                                 className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
//                                         {item.title.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-gray-800">{item.title}</h3>
//                                         <p className="text-sm text-gray-600">{item.author}</p>
//                                         <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'borrow'
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-blue-100 text-blue-800'
//                                             }`}>
//                                             {item.type === 'borrow' ? 'Borrow' : 'Purchase'}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center space-x-4">
//                                     {/* Quantity Controls */}
//                                     <div className="flex items-center space-x-2">
//                                         <button
//                                             onClick={() => decreaseQuantity(item)}
//                                             className="p-1 rounded-full hover:bg-gray-100"
//                                         >
//                                             <FiMinus className="w-4 h-4" />
//                                         </button>
//                                         <span className="w-8 text-center">{item.quantity}</span>
//                                         <button
//                                             onClick={() => increaseQuantity(item)}
//                                             className="p-1 rounded-full hover:bg-gray-100"
//                                         >
//                                             <FiPlus className="w-4 h-4" />
//                                         </button>
//                                     </div>

//                                     {/* Price */}
//                                     <div className="text-right">
//                                         <div className="font-semibold text-gray-800">
//                                             ${(getItemPrice(item) * item.quantity).toFixed(2)}
//                                         </div>
//                                         <div className="text-sm text-gray-600">
//                                             ${getItemPrice(item)} each
//                                         </div>
//                                     </div>

//                                     {/* Remove Button */}
//                                     <button
//                                         onClick={() => removeFromCart(item.id)}
//                                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                     >
//                                         <FiTrash2 className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </AnimatePresence>
//                 </div>

//                 {/* Payment Section */}
//                 <div className="bg-white rounded-lg shadow-md p-6 h-fit">
//                     <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

//                     <div className="space-y-3 mb-6">
//                         {cartItems.map((item) => (
//                             <div key={item.id} className="flex justify-between text-sm">
//                                 <span className="text-gray-600">
//                                     {item.title} ({item.type})
//                                 </span>
//                                 <span>${(getItemPrice(item) * item.quantity).toFixed(2)}</span>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="border-t pt-3 mb-6">
//                         <div className="flex justify-between font-bold text-lg">
//                             <span>Total:</span>
//                             <span>${getTotalPrice().toFixed(2)}</span>
//                         </div>
//                     </div>

//                     {/* Payment Method Selection */}
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select Payment Method
//                         </label>
//                         <div className="grid grid-cols-2 gap-2">
//                             <button
//                                 onClick={() => setSelectedPayment('airtel')}
//                                 className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'airtel'
//                                         ? 'border-red-600 bg-red-50 text-red-600'
//                                         : 'border-gray-300 hover:border-red-600'
//                                     }`}
//                             >
//                                 <FiSmartphone />
//                                 <span>Airtel Money</span>
//                             </button>
//                             <button
//                                 onClick={() => setSelectedPayment('mtn')}
//                                 className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'mtn'
//                                         ? 'border-yellow-600 bg-yellow-50 text-yellow-600'
//                                         : 'border-gray-300 hover:border-yellow-600'
//                                     }`}
//                             >
//                                 <FiSmartphone />
//                                 <span>MTN Mobile</span>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Phone Number Input */}
//                     {selectedPayment && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 'auto' }}
//                             className="mb-4"
//                         >
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 {selectedPayment === 'airtel' ? 'Airtel' : 'MTN'} Phone Number
//                             </label>
//                             <input
//                                 type="tel"
//                                 value={phoneNumber}
//                                 onChange={(e) => setPhoneNumber(e.target.value)}
//                                 placeholder="Enter phone number"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </motion.div>
//                     )}

//                     {/* Checkout Button */}
//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={handlePayment}
//                         disabled={isProcessing || !selectedPayment || !phoneNumber}
//                         className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
//                     >
//                         <FiCreditCard />
//                         <span>
//                             {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
//                         </span>
//                     </motion.button>

//                     {/* Payment Instructions */}
//                     {selectedPayment && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700"
//                         >
//                             {selectedPayment === 'airtel'
//                                 ? 'You will receive an Airtel Money prompt on your phone to complete the payment.'
//                                 : 'You will receive an MTN Mobile Money prompt on your phone to complete the payment.'
//                             }
//                         </motion.div>
//                     )}
//                 </div>
//             </div>
//         </motion.div>
//     );
// }

"use client"
// components/BookCart.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiCreditCard, FiSmartphone, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@context/cartContext';
import Link from 'next/link';

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
                className="text-center py-12 px-4"
            >
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag className="text-3xl text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some books to get started!</p>
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
            className="max-w-4xl mx-auto px-4 sm:px-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 py-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="text-xl" />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
                <button
                    onClick={clearCart}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 p-2 sm:p-0"
                >
                    <FiTrash2 className="text-lg" />
                    <span className="text-sm sm:text-base">Clear Cart</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    {/* Book Info */}
                                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                                            {item.title.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                {item.author}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'borrow'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {item.type === 'borrow' ? 'Borrow' : 'Purchase'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ${getItemPrice(item)} each
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls and Price */}
                                    <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <button
                                                onClick={() => decreaseQuantity(item)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => increaseQuantity(item)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>

                                        {/* Price and Remove */}
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Payment Section - Sticky on mobile */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Payment Summary</h2>

                        {/* Items List */}
                        <div className="space-y-2 sm:space-y-3 mb-4 max-h-40 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-gray-600 truncate">
                                            {item.title}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {item.quantity} × ${getItemPrice(item)}
                                        </div>
                                    </div>
                                    <span className="font-medium ml-2 flex-shrink-0">
                                        ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-sm sm:text-base">Total:</span>
                                <span className="font-bold text-lg sm:text-xl text-indigo-600">
                                    ${getTotalPrice().toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setSelectedPayment('airtel')}
                                    className={`p-2 sm:p-3 border rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm ${selectedPayment === 'airtel'
                                        ? 'border-red-600 bg-red-50 text-red-600'
                                        : 'border-gray-300 hover:border-red-600'
                                        }`}
                                >
                                    <FiSmartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Airtel Money</span>
                                </button>
                                <button
                                    onClick={() => setSelectedPayment('mtn')}
                                    className={`p-2 sm:p-3 border rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm ${selectedPayment === 'mtn'
                                        ? 'border-yellow-600 bg-yellow-50 text-yellow-600'
                                        : 'border-gray-300 hover:border-yellow-600'
                                        }`}
                                >
                                    <FiSmartphone className="w-3 h-3 sm:w-4 sm:h-4" />
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
                                    placeholder="07X XXX XXX"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </motion.div>
                        )}

                        {/* Checkout Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePayment}
                            disabled={isProcessing || !selectedPayment || !phoneNumber}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                            <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>
                                {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
                            </span>
                        </motion.button>

                        {/* Payment Instructions */}
                        {selectedPayment && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 p-3 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700"
                            >
                                {selectedPayment === 'airtel'
                                    ? 'You will receive an Airtel Money prompt on your phone to complete the payment.'
                                    : 'You will receive an MTN Mobile Money prompt on your phone to complete the payment.'
                                }
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
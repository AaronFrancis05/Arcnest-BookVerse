// pages/api/payment/process.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider, phoneNumber, amount, items } = req.body;

  try {
    let result;

    if (provider === "airtel") {
      result = await processAirtelPayment(phoneNumber, amount);
    } else if (provider === "mtn") {
      result = await processMTNPayment(phoneNumber, amount);
    }

    if (result.success) {
      // Save transaction to database
      await saveTransaction({
        transactionId: result.transactionId,
        provider,
        phoneNumber,
        amount,
        items,
        status: "completed",
      });

      res.status(200).json({
        success: true,
        transactionId: result.transactionId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Payment processing failed",
    });
  }
}

// Mock Airtel Money integration
async function processAirtelPayment(phoneNumber, amount) {
  // Replace with actual Airtel Money API integration
  const airtelApiKey = process.env.AIRTEL_API_KEY;

  // Example API call structure:
  // const response = await fetch('https://api.airtel.com/payments', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${airtelApiKey}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     subscriber: phoneNumber,
  //     amount: amount,
  //     currency: 'USD',
  //     reference: `BOOK_${Date.now()}`
  //   })
  // });

  // Simulate API response
  return {
    success: true,
    transactionId: "AT" + Date.now(),
  };
}

// Mock MTN Mobile Money integration
async function processMTNPayment(phoneNumber, amount) {
  // Replace with actual MTN Mobile Money API integration
  const mtnApiKey = process.env.MTN_API_KEY;

  // Example API call structure:
  // const response = await fetch('https://api.mtn.com/v1/collections', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${mtnApiKey}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     subscriber: phoneNumber,
  //     amount: amount,
  //     currency: 'USD',
  //     externalId: `BOOK_${Date.now()}`
  //   })
  // });

  // Simulate API response
  return {
    success: true,
    transactionId: "MTN" + Date.now(),
  };
}

const axios = require('axios');

const MEDUSA_BACKEND_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'test@peflora.com';
const ADMIN_PASSWORD = 'Test123!';

async function testRazorpayPayment() {
  console.log("🧪 Testing Razorpay Payment Integration...\n");

  try {
    // Step 1: Login to get admin token
    console.log("1️⃣ Logging in to admin panel...");
    const loginResponse = await axios.post(`${MEDUSA_BACKEND_URL}/admin/auth`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    const adminToken = loginResponse.data.access_token;
    console.log("✅ Admin login successful\n");

    // Step 2: Get regions
    console.log("2️⃣ Fetching regions...");
    const regionsResponse = await axios.get(`${MEDUSA_BACKEND_URL}/admin/regions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const region = regionsResponse.data.regions[0];
    console.log(`✅ Found region: ${region.name} (${region.id})\n`);

    // Step 3: Get payment providers for the region
    console.log("3️⃣ Checking payment providers...");
    const providersResponse = await axios.get(`${MEDUSA_BACKEND_URL}/admin/payment-providers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const razorpayProvider = providersResponse.data.payment_providers.find(
      provider => provider.id === 'pp_razorpay_razorpay'
    );
    
    if (razorpayProvider) {
      console.log(`✅ Razorpay provider found: ${razorpayProvider.id}`);
      console.log(`   Enabled: ${razorpayProvider.is_enabled}`);
    } else {
      console.log("❌ Razorpay provider not found");
      return;
    }

    // Step 4: Create a test cart
    console.log("\n4️⃣ Creating test cart...");
    const cartResponse = await axios.post(`${MEDUSA_BACKEND_URL}/store/carts`, {
      region_id: region.id,
      currency_code: region.currency_code
    });
    
    const cart = cartResponse.data.cart;
    console.log(`✅ Cart created: ${cart.id}\n`);

    // Step 5: Create payment collection
    console.log("5️⃣ Creating payment collection...");
    const paymentCollectionResponse = await axios.post(`${MEDUSA_BACKEND_URL}/store/payment-collections`, {
      region_id: region.id,
      amount: 1000, // ₹10.00 in paise
      currency: region.currency_code
    });
    
    const paymentCollection = paymentCollectionResponse.data.payment_collection;
    console.log(`✅ Payment collection created: ${paymentCollection.id}\n`);

    // Step 6: Create payment session with Razorpay
    console.log("6️⃣ Creating Razorpay payment session...");
    const paymentSessionResponse = await axios.post(
      `${MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollection.id}/payment-sessions`,
      {
        provider_id: 'pp_razorpay_razorpay',
        amount: 1000,
        currency: region.currency_code
      }
    );
    
    const paymentSession = paymentSessionResponse.data.payment_session;
    console.log(`✅ Razorpay payment session created: ${paymentSession.id}`);
    console.log(`   Amount: ₹${paymentSession.amount / 100}`);
    console.log(`   Currency: ${paymentSession.currency}`);
    console.log(`   Data:`, JSON.stringify(paymentSession.data, null, 2));

    console.log("\n🎉 Razorpay Payment Integration Test SUCCESSFUL!");
    console.log("\n📋 Next Steps:");
    console.log("1. Use the payment session data to create Razorpay order on frontend");
    console.log("2. Complete payment flow with Razorpay Checkout");
    console.log("3. Handle webhook notifications for payment status");

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log("\n💡 Tip: Make sure you're logged in with correct credentials");
    } else if (error.response?.status === 400) {
      console.log("\n💡 Tip: Check if the region and payment provider are properly configured");
    }
  }
}

if (require.main === module) {
  testRazorpayPayment()
    .then(() => {
      console.log("\n✅ Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test failed:", error.message);
      process.exit(1);
    });
}

module.exports = { testRazorpayPayment };

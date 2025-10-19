# 🧪 Razorpay Payment Integration Testing Guide

## Overview
This guide will help you test the Razorpay payment integration with your Peflora Medusa.js backend.

## Prerequisites
- ✅ Medusa backend running on `http://localhost:9000`
- ✅ Razorpay plugin properly configured
- ✅ Test Razorpay credentials available

## Testing Methods

### Method 1: HTML Test Page (Recommended)

1. **Open the test page**:
   ```bash
   open test-payment.html
   ```
   Or navigate to: `file:///Users/sarwagya/Desktop/vestcodes/peflora/peflora-backend/test-payment.html`

2. **Follow the test steps**:
   - Click "Test Backend" to verify connection
   - Click "Check Razorpay Provider" to verify provider is available
   - Click "Create Payment Session" to create a test payment
   - Click "Test Razorpay Checkout" to open Razorpay payment form

3. **Complete the payment**:
   - Use Razorpay test card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - Name: Any name

### Method 2: API Testing with cURL

#### Step 1: Test Backend Connection
```bash
curl -s http://localhost:9000/store/regions | jq .
```

#### Step 2: Check Payment Providers
```bash
# Get region ID first
REGION_ID=$(curl -s http://localhost:9000/store/regions | jq -r '.regions[0].id')

# Check payment providers
curl -s "http://localhost:9000/store/payment-providers?region_id=$REGION_ID" | jq .
```

#### Step 3: Create Payment Collection
```bash
curl -X POST "http://localhost:9000/store/payment-collections" \
  -H "Content-Type: application/json" \
  -d "{
    \"region_id\": \"$REGION_ID\",
    \"amount\": 1000,
    \"currency\": \"INR\"
  }" | jq .
```

#### Step 4: Create Payment Session
```bash
# Use the payment collection ID from step 3
PAYMENT_COLLECTION_ID="your_collection_id_here"

curl -X POST "http://localhost:9000/store/payment-collections/$PAYMENT_COLLECTION_ID/payment-sessions" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider_id\": \"pp_razorpay_razorpay\",
    \"amount\": 1000,
    \"currency\": \"INR\"
  }" | jq .
```

### Method 3: Using the Test Script

```bash
node test-razorpay-payment.js
```

## Expected Results

### ✅ Success Indicators
- Backend responds with 200 status
- Razorpay provider appears in payment providers list
- Payment session created with Razorpay order ID
- Razorpay checkout opens successfully
- Payment completes with success response

### ❌ Common Issues & Solutions

#### Issue: "Publishable API key required"
**Solution**: This is expected for store API calls. Use admin API or the HTML test page.

#### Issue: "Payment provider not found"
**Solution**: 
1. Check if Razorpay plugin is installed: `pnpm list medusa-plugin-razorpay-v2`
2. Verify configuration in `medusa-config.ts`
3. Restart the server

#### Issue: "Unauthorized" for admin API
**Solution**: 
1. Create admin user: `npx medusa user --email test@peflora.com --password Test123!`
2. Or use the HTML test page which doesn't require admin authentication

#### Issue: Razorpay checkout doesn't open
**Solution**:
1. Check browser console for JavaScript errors
2. Verify Razorpay test key is correct
3. Ensure payment session data is valid

## Test Cards for Razorpay

### Successful Payment
- **Card**: `4111 1111 1111 1111`
- **CVV**: `123`
- **Expiry**: Any future date
- **Name**: Any name

### Failed Payment
- **Card**: `4000 0000 0000 0002`
- **CVV**: `123`
- **Expiry**: Any future date

## Webhook Testing

To test webhooks, you'll need to:

1. **Set up ngrok** (for local testing):
   ```bash
   ngrok http 9000
   ```

2. **Configure webhook in Razorpay dashboard**:
   - URL: `https://your-ngrok-url.ngrok.io/hooks/payment/razorpay_razorpay`
   - Events: `payment.captured`, `payment.failed`

3. **Test webhook delivery**:
   - Complete a test payment
   - Check webhook logs in Razorpay dashboard
   - Verify webhook is received by your backend

## Production Checklist

Before going live:

- [ ] Replace test Razorpay keys with live keys
- [ ] Update webhook URLs to production domain
- [ ] Test with real payment methods
- [ ] Verify refund functionality
- [ ] Test payment failure scenarios
- [ ] Configure proper error handling
- [ ] Set up monitoring and logging

## Troubleshooting

### Check Server Logs
```bash
# View server logs
npm run dev
```

### Verify Plugin Installation
```bash
pnpm list medusa-plugin-razorpay-v2
```

### Check Configuration
```bash
# Verify medusa-config.ts has correct Razorpay settings
cat medusa-config.ts | grep -A 20 "razorpay"
```

### Test Database Connection
```bash
# Check if payment providers are in database
npx medusa exec "console.log(await container.resolve('paymentModuleService').listPaymentProviders())"
```

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all configuration settings
3. Test with the HTML test page first
4. Use browser developer tools to debug frontend issues
5. Check Razorpay dashboard for payment logs

---

**Happy Testing! 🎉**

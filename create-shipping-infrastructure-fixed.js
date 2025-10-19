const { Client } = require('pg');
require('dotenv').config({ path: '.env.development' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createShippingInfrastructure() {
  try {
    await client.connect();
    console.log('Connected to database');

    const now = new Date().toISOString();
    
    // Step 1: Create Fulfillment Set
    const fulfillmentSetId = 'fs_' + Math.random().toString(36).substr(2, 9);
    await client.query(`
      INSERT INTO fulfillment_set (id, name, type, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [fulfillmentSetId, `India Fulfillment Set ${Date.now()}`, 'shipping', now, now, null]);
    console.log('✅ Created fulfillment set:', fulfillmentSetId);

    // Step 2: Create Service Zone with country info in metadata
    const serviceZoneId = 'sz_' + Math.random().toString(36).substr(2, 9);
    await client.query(`
      INSERT INTO service_zone (id, name, fulfillment_set_id, metadata, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      serviceZoneId, 
      `India Service Zone ${Date.now()}`, 
      fulfillmentSetId, 
      JSON.stringify({ 
        countries: ['in'], 
        auto_select: true,
        region: 'India'
      }), 
      now, 
      now, 
      null
    ]);
    console.log('✅ Created service zone with country metadata:', serviceZoneId);

    // Step 3: Create Shipping Option Type
    const shippingOptionTypeId = 'sot_' + Math.random().toString(36).substr(2, 9);
    await client.query(`
      INSERT INTO shipping_option_type (id, label, code, created_at, updated_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [shippingOptionTypeId, 'Free Shipping', 'free_shipping', now, now, null]);
    console.log('✅ Created shipping option type:', shippingOptionTypeId);

    // Step 4: Create Shipping Option with the specific ID you requested
    const shippingOptionId = 'sloc_01K7X24EGRNY4DKG3RS3SE03G9'; // Your requested ID
    await client.query(`
      INSERT INTO shipping_option (
        id, name, price_type, service_zone_id, shipping_profile_id,
        provider_id, data, metadata, shipping_option_type_id,
        created_at, updated_at, deleted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      shippingOptionId,
      'Free Shipping',
      'flat',
      serviceZoneId,
      'sp_01K7V1QZD4A8J6JJ8G1NRAVN24', // Use existing shipping profile
      'manual_manual', // Use existing fulfillment provider
      JSON.stringify({
        name: 'Free Shipping',
        description: 'Free shipping within India',
        amount: 0
      }),
      JSON.stringify({ 
        delivery_days: '3-5 business days', 
        free_shipping: true,
        auto_select: true, // Flag for automatic selection
        countries: ['in'],
        region: 'India'
      }),
      shippingOptionTypeId,
      now,
      now,
      null
    ]);
    console.log('✅ Created shipping option with your requested ID:', shippingOptionId);

    console.log('\n🎉 Complete shipping infrastructure created successfully!');
    console.log('📋 Summary:');
    console.log(`   - Fulfillment Set: ${fulfillmentSetId}`);
    console.log(`   - Service Zone: ${serviceZoneId}`);
    console.log(`   - Shipping Option Type: ${shippingOptionTypeId}`);
    console.log(`   - Shipping Option: ${shippingOptionId}`);
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Shipping method is ready for automatic selection');
    console.log('   2. Test the checkout flow');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createShippingInfrastructure();

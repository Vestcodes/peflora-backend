const { Client } = require('pg');

async function createShippingOption() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_DT4AOWhZuY7q@ep-tiny-firefly-a1aicy5a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check table schema and constraints
    const schemaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'shipping_option'
      ORDER BY ordinal_position;
    `);
    console.log('Shipping option table schema:', schemaResult.rows);

    // Check constraints
    const constraintResult = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'shipping_option'::regclass 
      AND conname LIKE '%price_type%';
    `);
    console.log('Price type constraints:', constraintResult.rows);

    // Check existing service zones
    const serviceZoneResult = await client.query('SELECT id, name FROM service_zone LIMIT 5');
    console.log('Existing service zones:', serviceZoneResult.rows);

    // Check existing shipping profiles
    const shippingProfileResult = await client.query('SELECT id, name FROM shipping_profile LIMIT 5');
    console.log('Existing shipping profiles:', shippingProfileResult.rows);

    // Check existing shipping option types
    const shippingOptionTypeResult = await client.query('SELECT id FROM shipping_option_type LIMIT 5');
    console.log('Existing shipping option types:', shippingOptionTypeResult.rows);

    // Check existing fulfillment providers
    const fulfillmentProviderResult = await client.query('SELECT id FROM fulfillment_provider LIMIT 5');
    console.log('Existing fulfillment providers:', fulfillmentProviderResult.rows);

    // Check service zone schema
    const serviceZoneSchemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'service_zone'
      ORDER BY ordinal_position;
    `);
    console.log('Service zone table schema:', serviceZoneSchemaResult.rows);

    // Create a fulfillment set first
    const fulfillmentSetId = 'fs_' + Math.random().toString(36).substr(2, 9);
    const fulfillmentSetQuery = `
      INSERT INTO fulfillment_set (
        id, name, type, created_at, updated_at, deleted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;
    
    const now = new Date().toISOString();
    await client.query(fulfillmentSetQuery, [
      fulfillmentSetId,
      `India Fulfillment Set ${Date.now()}`,
      'shipping',
      now,
      now,
      null
    ]);
    console.log('✅ Created fulfillment set:', fulfillmentSetId);

    // Create a service zone
    const serviceZoneId = 'sz_' + Math.random().toString(36).substr(2, 9);
    const serviceZoneQuery = `
      INSERT INTO service_zone (
        id, name, fulfillment_set_id, created_at, updated_at, deleted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;
    
    await client.query(serviceZoneQuery, [
      serviceZoneId,
      `India Service Zone ${Date.now()}`,
      fulfillmentSetId,
      now,
      now,
      null
    ]);
    console.log('✅ Created service zone:', serviceZoneId);

    // Create a shipping option type
    const shippingOptionTypeId = 'sot_' + Math.random().toString(36).substr(2, 9);
    const shippingOptionTypeQuery = `
      INSERT INTO shipping_option_type (
        id, label, code, created_at, updated_at, deleted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;
    
    await client.query(shippingOptionTypeQuery, [
      shippingOptionTypeId,
      'Standard Shipping',
      'standard_shipping',
      now,
      now,
      null
    ]);
    console.log('✅ Created shipping option type:', shippingOptionTypeId);

    // Create a new shipping option
    const shippingOptionId = 'so_' + Math.random().toString(36).substr(2, 9);
    const insertQuery = `
      INSERT INTO shipping_option (
        id, name, price_type, service_zone_id, shipping_profile_id, 
        provider_id, data, metadata, shipping_option_type_id,
        created_at, updated_at, deleted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `;
    
    const values = [
      shippingOptionId,
      'Standard Shipping',
      'flat',
      serviceZoneId,
      'sp_01K7V1QZD4A8J6JJ8G1NRAVN24', // Use existing shipping profile
      'manual_manual', // Use existing fulfillment provider
      JSON.stringify({ 
        name: 'Standard Shipping', 
        description: 'Free standard shipping within India',
        amount: 0
      }),
      JSON.stringify({ delivery_days: '3-5 business days', free_shipping_threshold: 999 }),
      shippingOptionTypeId,
      now,
      now,
      null
    ];

    await client.query(insertQuery, values);
    console.log('✅ Created shipping option:', shippingOptionId);

    console.log('🎉 Shipping option created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createShippingOption();

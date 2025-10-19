# Peflora Product Setup Script

This script automatically creates all 33 products for the Peflora store, including collections, categories, and product variants.

## What the Script Does

### 1. **Fetches Existing Data**
- Lists all existing product collections
- Lists all existing product categories
- Checks for existing products to avoid duplicates

### 2. **Creates Collections**
- **Body Perfumes** - Main perfume collection
- **Attar Collection** - Traditional attar fragrances
- **Sugandhit Spray** - Room fresheners
- **Gifting Sets** - Combo packages

### 3. **Creates Categories**
- **Unisex** - For all genders
- **Mens** - Men's fragrances
- **Female** - Women's fragrances
- **Room Freshener** - Home fragrances
- **For all** - Universal products

### 4. **Creates Products**
The script creates **33 products** across 4 categories:

#### Body Perfumes (15 products)
1. Secret Killer (Old Pack) - 100ml
2. Velvet Temptation - 100ml
3. Luminous Aura - 100ml
4. Secret Killer - 35ml
5. Secret Crush - 35ml
6. Dark Night - 35ml
7. Passion - 100ml
8. Musk - 100ml
9. OUD - 100ml
10. Glam - 100ml
11. Soft Love - 100ml
12. Dark Night - 100ml
13. Secret Killer (New Pack) - 100ml
14. Secret Crush - 100ml
15. Candy - 100ml

#### Attar Collection (10 products)
16. Sandal Wood - 12ml
17. Jasmine Night - 12ml
18. Lotus Blue - 12ml
19. Rose Gold - 12ml
20. Rooh 786 attar - 12ml
21. AL - Rooh - 12ml
22. Arabian Oud - 12ml
23. Eazizi Musk - 12ml
24. AL - Ahnaf - 12ml
25. Jannatul Laiba attar - 12ml

#### Sugandhit Spray (6 products)
26. Chandan [Sandal Wood] - 100ml
27. Gulab [Rose] - 100ml
28. Bela [Jasmine] - 100ml
29. Fulwari [Flowers] - 100ml
30. Khatu Shyam - 100ml
31. Tulsi - 100ml

#### Gifting Sets (2 products)
32. Magic Blend - 100ml × 3
33. Classy Combo - 100ml × 3

## How to Run

### Method 1: Using npm script (Recommended)
```bash
npm run setup-products
```

### Method 2: Using medusa exec directly
```bash
medusa exec ./src/scripts/setup-products.js
```

### Method 3: Using the runner script
```bash
node run-setup.js
```

## Prerequisites

1. **Backend must be running** on `localhost:9000`
2. **Database connection** must be configured
3. **Environment variables** must be set properly
4. **Admin user** should exist (contact@vestcodes.co)

## What Gets Created

### For Each Product:
- **Product title** and **handle** (SEO-friendly URL)
- **Description** with marketing copy
- **Status**: Published
- **Collection assignment** based on product type
- **Category assignment** based on target audience
- **Metadata** including:
  - Size information
  - MRP (Maximum Retail Price)
  - Selling Price
  - Fragrance notes (Top, Middle, Base)
  - Product type

### For Each Product Variant:
- **Variant title** with size
- **SKU** (Stock Keeping Unit)
- **Inventory management** enabled
- **Pricing** in INR
- **Stock quantity** set to 100
- **Metadata** with size and MRP

## Error Handling

The script includes comprehensive error handling:
- **Duplicate detection** - Skips existing products
- **Collection/Category reuse** - Uses existing ones if found
- **Individual product errors** - Continues processing if one fails
- **Detailed logging** - Shows progress and results

## Output

The script provides detailed console output:
```
🚀 Starting Peflora Product Setup...
✅ Medusa App initialized successfully

📋 Fetching existing collections and categories...
Found 0 existing collections
Found 0 existing categories

Creating collection: Body Perfumes
✅ Created collection: Body Perfumes
...

🛍️ Creating products...
✅ Created product: Secret Killer (Old Pack) (100 ml)
✅ Created product: Velvet Temptation (100 ml)
...

🎉 Product setup completed!
📊 Summary:
   - Created: 33 products
   - Skipped: 0 products
   - Total processed: 33 products
```

## Troubleshooting

### Common Issues:

1. **"Medusa App not initialized"**
   - Ensure backend is running
   - Check database connection
   - Verify environment variables

2. **"Collection already exists"**
   - This is normal - script reuses existing collections
   - No action needed

3. **"Product creation failed"**
   - Check individual product data
   - Verify collection/category IDs
   - Check database permissions

4. **"Script hangs"**
   - Check Redis connection
   - Verify database is responsive
   - Check for deadlocks

### Verification:

After running the script, verify in admin panel:
1. Go to `http://localhost:5173`
2. Login with `contact@vestcodes.co` / `Sarwagya@07`
3. Check Products section
4. Verify collections and categories
5. Check product details and pricing

## Customization

To modify the script:
1. Edit `src/scripts/setup-products.js`
2. Update product data array
3. Modify collection/category names
4. Adjust pricing or descriptions
5. Re-run the script

## Notes

- Script is **idempotent** - safe to run multiple times
- **Existing products** are skipped automatically
- **Collections and categories** are reused if they exist
- **All prices** are in INR (Indian Rupees)
- **Inventory** is set to 100 units per product
- **Products** are published immediately

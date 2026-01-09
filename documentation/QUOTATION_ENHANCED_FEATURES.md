# Quotation Manager - Enhanced Features

## Overview
The quotation manager now supports advanced features for creating detailed and flexible quotations with product variations, custom pricing, and discount management.

## New Features

### 1. Product Variation Selection

**Description**: Select specific product variations with different pricing when creating quotations.

**How it works**:
- When a product is selected, if it has variations (material, color, finish combinations), a variation dropdown appears
- Each variation shows its price modifier (e.g., "+$50" for premium materials)
- The system automatically calculates the variation price: `basePrice + priceModifier`
- Variation details are stored in the quotation item for reference

**Example**:
```
Product: Luxury Chandelier (Base: $500)
Variations:
  - White Marble with Brass (+$150) = $650
  - Black Granite with Gold (+$200) = $700
```

### 2. Custom Pricing per Product

**Description**: Override product prices with custom pricing at quotation creation time.

**Features**:
- **Original Price**: Read-only field showing the product/variation base price
- **Custom Price**: Editable field allowing price adjustments (increase/decrease)
- Price changes are tracked by storing both `originalPrice` and `unitPrice`

**Use Cases**:
- Bulk order discounts
- Special customer pricing
- Promotional offers
- Negotiated rates

**Example**:
```
Product: Premium Lamp
Original Price: $300
Custom Price: $250 (negotiated discount)
```

### 3. Overall Quotation Discount

**Description**: Apply fixed amount or percentage-based discounts to the entire quotation.

**Discount Types**:
- **None**: No discount applied
- **Fixed**: Subtract a specific amount (e.g., $100 off)
- **Percentage**: Subtract a percentage of subtotal (e.g., 10% off)

**Calculation**:
```
Subtotal = Sum of (quantity × unitPrice) for all items
Discount Amount = 
  - Fixed: min(discountValue, subtotal)
  - Percentage: (subtotal × discountValue) / 100
Grand Total = Subtotal - Discount Amount
```

**Example**:
```
Subtotal: $1,500
Discount: 10% = $150
Grand Total: $1,350
```

## Data Structure Changes

### QuotationItem Interface
```typescript
{
  productId?: string;
  productName: string;
  variationId?: string;        // NEW
  variationName?: string;      // NEW
  quantity: number;
  originalPrice: number;       // NEW - tracks base price
  unitPrice: number;           // Custom/revised price
  total: number;
  description?: string;
}
```

### Quotation Entity
```typescript
{
  // ... existing fields
  discount?: {                 // NEW
    type: 'fixed' | 'percentage';
    value: number;
  };
  discountTotal: number;       // Calculated discount amount
  subtotal: number;
  grandTotal: number;
}
```

## UI Components

### Quotation Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Product Selection                                            │
├──────────────┬──────────────┬─────┬──────────┬──────────────┤
│ Product      │ Variation    │ Qty │ Original │ Custom Price │
│ [Dropdown]   │ [Dropdown]   │ [1] │ [$500]   │ [$450]      │
└──────────────┴──────────────┴─────┴──────────┴──────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Totals                                                       │
├─────────────────────────────────────────────────────────────┤
│ Subtotal:                                        $1,500.00  │
│                                                              │
│ Discount: ○ None  ● Fixed  ○ Percentage                    │
│           [100] $ = -$100.00                                │
│                                                              │
│ Grand Total:                                     $1,400.00  │
└─────────────────────────────────────────────────────────────┘
```

## API Changes

### Create Quotation Payload
```json
{
  "clientName": "ABC Corp",
  "clientEmail": "contact@abc.com",
  "currency": "USD",
  "items": [
    {
      "productId": "prod_123",
      "productName": "Luxury Chandelier",
      "variationId": "var_456",
      "variationName": "White Marble with Brass",
      "quantity": 2,
      "originalPrice": 650,
      "unitPrice": 600,
      "total": 1200,
      "description": "Custom size requested"
    }
  ],
  "subtotal": 1200,
  "discount": {
    "type": "percentage",
    "value": 10
  },
  "discountTotal": 120,
  "grandTotal": 1080
}
```

## Business Logic

### Price Calculation Flow
1. User selects product → `originalPrice = product.basePrice`
2. User selects variation → `originalPrice = basePrice + variation.priceModifier`
3. User modifies custom price → `unitPrice = customValue`
4. System calculates item total → `total = quantity × unitPrice`
5. System calculates subtotal → `subtotal = Σ(item.total)`
6. User applies discount → `discountTotal = calculated based on type`
7. System calculates grand total → `grandTotal = subtotal - discountTotal`

### Validation Rules
- Custom price must be ≥ 0
- Quantity must be ≥ 1
- Fixed discount cannot exceed subtotal
- Percentage discount must be between 0-100
- At least one item required

## Usage Examples

### Example 1: Standard Quotation with Variation
```typescript
// User selects: Chandelier → White Marble variation → Qty: 2
Item: {
  productId: "prod_123",
  productName: "Luxury Chandelier",
  variationId: "var_456",
  variationName: "White Marble with Brass",
  quantity: 2,
  originalPrice: 650,  // 500 + 150
  unitPrice: 650,
  total: 1300
}
```

### Example 2: Custom Pricing with Discount
```typescript
// User negotiates price down and applies 5% discount
Item: {
  productId: "prod_123",
  productName: "Premium Lamp",
  quantity: 10,
  originalPrice: 300,
  unitPrice: 250,      // Negotiated
  total: 2500
}

Quotation: {
  subtotal: 2500,
  discount: { type: "percentage", value: 5 },
  discountTotal: 125,
  grandTotal: 2375
}
```

## Migration Notes

### Existing Quotations
- Old quotations without `originalPrice` will continue to work
- `originalPrice` defaults to `unitPrice` for backward compatibility
- Discount field is optional and defaults to null

### Database Updates
No migration required - new fields are optional and have defaults.

## Testing Checklist

- [ ] Product selection populates correct base price
- [ ] Variation selection updates price correctly
- [ ] Custom price can be modified independently
- [ ] Fixed discount calculates correctly
- [ ] Percentage discount calculates correctly
- [ ] Discount cannot exceed subtotal
- [ ] Grand total updates in real-time
- [ ] Form validation works for all fields
- [ ] Quotation saves with all new fields
- [ ] Existing quotations still load correctly

## Future Enhancements

1. **Item-level discounts**: Apply discounts to individual items
2. **Tax calculation**: Add tax support with configurable rates
3. **Bulk pricing tiers**: Automatic discounts based on quantity
4. **Price history**: Track price changes over time
5. **Approval workflow**: Require approval for custom pricing beyond threshold

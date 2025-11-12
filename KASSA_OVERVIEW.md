# Kassa App - Functional Overview

## Purpose
The Kassa app is a comprehensive point-of-sale (POS) system designed for LatinPassion bar/restaurant operations, handling everything from product sales to cash reconciliation.

## Core Functionality

### 1. Shift Management
- **Opening Shift**: Staff must open the kassa at the start of their shift by recording the initial cash amount in the register
- **Closing Shift**: At shift end, staff count the cash and record the closing amount
  - System automatically calculates the envelope amount (cash to be deposited)
  - Optional notes can be added for discrepancies or important information
- **Shift Tracking**: Tracks who opened/closed shifts and when, preventing sales when the kassa is closed

### 2. Product Catalog & Cart
- **Product Display**: Shows all available items organized by categories (Beer, Cocktails, Shots, Soft Drinks, Hot Drinks, Food, Event Tickets, Other)
- **Search Functionality**: Real-time search to quickly find products by name
- **Stock Tracking**:
  - Shows current stock levels for all products
  - Warns when items are out of stock but allows sales to continue
  - Special handling for cocktails - calculates available servings based on ingredient availability
- **Custom Items**: Ability to add custom-priced items for special circumstances
- **Cart Management**: Add/remove items, adjust quantities, clear cart

### 3. Pricing & Discounts
- **Discount System**: Apply percentage-based discounts (10%, 20%, or 50%)
  - Some items are excluded from discounts (coffee, tea)
  - Discounts cannot be combined with vouchers
- **Voucher System**:
  - Scan QR code vouchers using camera or enter codes manually
  - Validates vouchers haven't been used and aren't expired
  - Applies voucher to the most expensive item in cart
  - One voucher per transaction
  - Tracks which item received the discount

### 4. Payment Methods

#### SumUp Solo (Card Payments)
- Integrates with SumUp Solo card reader for contactless/card payments
- Sends payment request to physical terminal
- Creates unique reference for each transaction
- **Payment Verification System**:
  - Marks payment as "pending verification" after sending to device
  - Automatically verifies payment status after 1 minute
  - Polls for verification results in real-time
  - Updates transaction status to "verified" or "failed"

#### Cash Payments
- Records cash transactions immediately as completed
- Updates shift totals for cash reconciliation

#### Voucher Payments
- Processes voucher-only transactions (€0.00 total)
- Marks voucher as used with timestamp and user
- Instant completion without payment verification

### 5. Failed Payment Recovery
- **Monitoring**: Displays alert banner showing number of failed payments in last 24 hours
- **Details**: Shows payment amount, timestamp, cashier name, items, and reference number
- **Recovery Options**:
  - **Add to Cart**: Loads failed payment items into current cart for retry
  - **Delete**: Removes failed transaction record after confirmation
- **Automatic Updates**: Refreshes when verification status changes from pending to failed

### 6. Inventory Management
- **Automatic Stock Updates**: After successful payment, automatically deducts items from inventory
- **Regular Products**: Direct stock deduction based on quantity sold
- **Cocktails**: Deducts individual ingredients based on recipe quantities
  - Example: Selling 1 Mojito deducts rum (4cl), mint leaves (5 pieces), lime (1 piece), etc.
- **Error Handling**:
  - Validates stock availability before processing
  - Allows negative stock but logs warnings
  - Provides detailed error messages if inventory update fails

### 7. Order Status Tracking
- All new transactions marked as "pending" for bartender display
- Bartenders can see orders in real-time (separate bartender interface)
- Orders progress from pending → in progress → completed

### 8. Transaction Recording
- **Full Transaction Details**: Records all sales with:
  - Items purchased (name, price, quantity)
  - Total amount and payment method
  - Discount information (percentage or voucher)
  - Timestamp and cashier who processed it
  - Payment verification status
  - SumUp reference numbers (for card payments)
- **Audit Trail**: Complete history for reporting and reconciliation

## User Interface Features

### Mobile-Friendly Design
- Responsive layout works on tablets and phones
- Touch-optimized buttons and controls
- Floating cart button on mobile for quick access
- Smooth scrolling to cart section

### Visual Feedback
- Stock level badges on each product
- Color-coded alerts (shift status, failed payments)
- Real-time cart updates
- Loading states during payment processing
- Success/error messages for all operations

### Category Filters
- Quick filtering by product category
- "All" view to see entire catalog
- Visual category buttons for fast navigation

## Workflow Example

1. **Start of Shift**: Cashier opens kassa with €192 starting cash
2. **Customer Orders**: 2 beers, 1 cocktail, 1 shot
3. **Cart Building**: Add items to cart, see real-time totals
4. **Apply Discount**: Customer has staff discount - apply 20% off
5. **Payment**: Customer pays by card via SumUp Solo
6. **Verification**: System sends payment to terminal, marks as pending
7. **Completion**: Payment verifies after 1 minute, stock updates automatically, order appears for bartender
8. **End of Shift**: Count cash (€450), enter closing amount, system calculates €258 envelope to deposit

## Key Business Rules

- Kassa must be open to process sales
- Stock warnings don't prevent sales (allows manual override)
- One voucher per transaction maximum
- Vouchers and percentage discounts cannot be combined
- Coffee/tea items exempt from percentage discounts
- All card payments require verification before completion
- Ingredient-based stock calculation for cocktails
- 24-hour window for failed payment recovery

## Technical Notes

### Database Tables Used
- `products` - Product catalog with stock levels
- `transactions` - Sales records
- `vouchers` - Digital voucher codes
- `kassa_shifts` - Shift open/close tracking
- `recipe_ingredients` - Cocktail ingredient recipes
- `profiles` - User/staff information

### Key Files
- `/src/app/cashier/page.tsx` - Main cashier interface
- `/src/app/api/payments/route.ts` - Payment processing logic
- `/src/app/api/payment-status/route.ts` - Payment verification
- `/src/components/voucher-scanner.tsx` - QR code scanning
- `/src/lib/sumup-verification.ts` - SumUp payment verification

### External Integrations
- **SumUp API** - Card payment processing
- **Supabase** - Database and real-time updates
- **@zxing/browser** - QR code scanning library

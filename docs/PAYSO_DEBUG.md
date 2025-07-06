# PaySolutions Integration Debug Guide

## Current Issue: 500 Error

### Possible Causes:

1. **Field Name Issues**
   - Changed from `merchantId` to `customerId` (PaySolutions may expect this)
   - Added email and phone fields (might be required)

2. **Missing Required Fields**
   Common PaySolutions required fields:
   - `customerId` - Merchant/Customer ID (62551562)
   - `refNo` - Unique reference number
   - `amount` - Amount in decimal format (e.g., "1.00")
   - `currencyCode` - Currency code (THB)
   - `productDetail` - Product description
   - `customerName` - Customer name
   - `customerEmail` - Customer email
   - `customerPhone` - Customer phone
   - `lang` - Language (TH/EN)

3. **Additional Fields That Might Be Required**
   - `paymentChannel` - Payment method selection
   - `backendReturnUrl` - URL for backend callback
   - `frontendReturnUrl` - URL for frontend redirect after payment
   - `merchantDefined1-5` - Custom fields

4. **Format Issues**
   - Amount should be formatted with 2 decimal places
   - Phone number format validation
   - Email format validation

## Debug Steps:

1. **Check Browser Console** - Look for the form data being submitted
2. **Network Tab** - See the exact POST request to PaySolutions
3. **Use Debug Form** - Submit manually to see specific error messages
4. **Contact PaySolutions** - Get exact field requirements for merchant 62551562

## Test Flow:

1. Go to `/payment/redirect?orderId=test123&amount=1`
2. Check the debug info shown
3. Click "Submit to PaySolutions (Debug)" manually
4. Note any error messages or responses

## Common PaySolutions Error Codes:

- 500 - Server error (usually missing/invalid fields)
- 400 - Bad request (invalid data format)
- 401 - Authentication issue (invalid customerId)
- 403 - Forbidden (merchant not authorized)
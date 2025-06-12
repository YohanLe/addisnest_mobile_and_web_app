# How to Test Property Edit From UI

This guide explains how to test the property edit functionality directly through the Addinest UI application.

## Starting the Application

1. **Start the backend server**:
   ```
   cd src
   node server.js
   ```

2. **Start the frontend application** (in a separate terminal):
   ```
   cd src
   npm run dev
   ```

3. **Open your browser** to:
   ```
   http://localhost:5173/
   ```

## Testing Steps

1. **Sign in to your account**
   - Use your existing credentials
   - Or create a new account if needed

2. **Navigate to Property Listings**
   - Click on your profile or account icon (usually in top-right)
   - Select "My Account" or "Dashboard"
   - Go to the "My Listings" tab

3. **Find a Property to Edit**
   - You should see a list of your properties
   - Each property row has an "Action" dropdown button on the right

4. **Edit the Property**
   - Click the "Action" dropdown on a property
   - Select "Edit" from the dropdown menu
   - This will navigate to `/property-edit/{id}` where `{id}` is the property ID
   - The form should automatically load with all property data pre-populated

5. **Verify MongoDB ID Support**
   - Check the URL in your browser - if the property has a MongoDB ID, it should show a 24-character hexadecimal string
   - All property fields should be correctly populated
   - This confirms that MongoDB ID properties are handled correctly

6. **Make Changes and Save**
   - Edit some fields (e.g., price, description)
   - Click "Save" or "Update" button
   - Verify you're redirected back to listings or a success page
   - Navigate back to "My Listings" and confirm the changes are reflected

## What to Look For

- **URL Format**: The property edit URL should show the correct ID format:
  ```
  http://localhost:5173/property-edit/6849bd6a2b9f36399990f4fb
  ```

- **Form Population**: All fields should be pre-populated with the property's data

- **MongoDB ID Handling**: Properties with MongoDB-style IDs (24-character hex strings) should work identically to properties with other ID formats

- **Data Persistence**: After saving, changes should be reflected in the property listings

## Common Issues

- **Empty Form**: If the form loads empty, check that:
  - The property ID in the URL is correct
  - You're logged in as the owner of the property
  - The backend server is running

- **Save Errors**: If saving fails, check the browser console for errors

- **Navigation Issues**: If clicking Edit doesn't navigate correctly, verify that the PropertyListingsTab component is using the correct property ID format

## Behind the Scenes

When you click "Edit" in the PropertyListingsTab, these actions happen:

1. The property data is stored in localStorage with these keys:

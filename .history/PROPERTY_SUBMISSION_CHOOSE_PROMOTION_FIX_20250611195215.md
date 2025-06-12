# Property Submission Fix - Choose Promotion Page

## Issue Description

There was a bug in the property submission flow where users would get stuck on the "Choose Promotion" page. The property wasn't being saved to the database when they tried to proceed. This happened because:

1. The original `ChoosePropmotion.jsx` component had issues with the data formatting when sending to the API

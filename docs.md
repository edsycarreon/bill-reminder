# Bill Tracker App Documentation

## Overview

The Bill Tracker App is a mobile application built with Expo React Native that helps users track and manage their recurring bills. The app provides notifications for upcoming bills, allows users to mark bills as paid, and maintains a history of bill payments across months.

## Features

### Bill Management

- Add new recurring bills with name, amount, due day, and optional details like description and category
- Edit existing bills to update information
- Delete bills that are no longer needed
- View detailed information about each bill, including payment history

### Monthly Bill Tracking

- View all bills for the current month on the home screen
- Mark bills as paid/unpaid with a single tap
- Navigate between months to view historical payment data
- Automatically track payment status for each month separately

### Notifications

- Receive reminders before bills are due
- Customize how many days in advance to receive notifications for each bill
- Notifications are automatically canceled when bills are marked as paid

### Statistics

- See summary of total, paid, and unpaid bill amounts for each month
- View percentage of bills paid in a visual progress bar

## Technical Implementation

### Data Storage

- Uses React Native AsyncStorage for local persistent storage
- Data is structured as:
  - Bills: Record of bill definitions with unique IDs
  - Monthly Status: Record of payment status for each bill in each month

### State Management

- Uses Zustand for global state management
- Persists data between app sessions using Zustand persist middleware with AsyncStorage
- Provides actions for all CRUD operations on bills and payment status

### UI Components

- Implements a clean, user-friendly interface with TWRNC (Tailwind React Native Classes)
- Responsive design that works across different device sizes
- Visual indicators for bill status (paid, due soon, overdue)

### Navigation

- Uses Expo Router for type-safe navigation between screens
- Includes screens for bill listing, adding/editing bills, and viewing bill details

### Validation

- Uses Zod for form validation
- Ensures all required fields are provided and have valid values

## Frontend-Only Implementation

This is a frontend-only implementation that stores all data locally on the device using AsyncStorage. There is no backend or cloud synchronization. All bill and payment data is stored directly on the user's device.

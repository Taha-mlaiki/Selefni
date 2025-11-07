# Credit Simulation & Request App - Setup Guide

## 📋 Project Overview

A complete credit simulation and management application built with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Backend**: json-server (mock API)
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation
- **Export**: jsPDF for PDF generation, CSV export

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Servers

You need to run both the frontend and backend simultaneously:

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```

**Terminal 2 - Backend (json-server):**
```bash
node server.js
```

### Alternative: Run Concurrently

Add this to your `package.json` scripts:
```json
"scripts": {
  "dev": "vite",
  "server": "node server.js",
  "start": "concurrently \"npm run dev\" \"npm run server\""
}
```

Then install concurrently:
```bash
npm install -D concurrently
```

Now you can run both with:
```bash
npm start
```

## 📂 Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   ├── AdminLayout.tsx      # Admin dashboard layout
│   │   └── GuestLayout.tsx      # Guest-facing layout
│   ├── simulation/
│   │   ├── SimulationForm.tsx   # Credit simulation form
│   │   ├── SimulationResults.tsx # Results display
│   │   └── AmortizationTable.tsx # Payment schedule table
│   ├── request/
│   │   └── RequestForm.tsx      # Credit request form
│   └── ui/                      # shadcn components
├── pages/
│   ├── SimulationPage.tsx       # Guest simulation page
│   ├── RequestPage.tsx          # Guest request page
│   └── admin/
│       ├── Dashboard.tsx        # Admin overview
│       ├── RequestsPage.tsx     # Request list
│       └── RequestDetailPage.tsx # Request details
├── lib/
│   ├── calculations.ts          # Financial calculations
│   ├── exportPDF.ts            # PDF export logic
│   └── exportCSV.ts            # CSV export logic
├── services/
│   └── api.ts                  # API service layer
├── stores/
│   └── notificationStore.ts    # Zustand notification store
└── types/
    └── index.ts                # TypeScript types
```

## 🎯 Features

### Guest Side
- ✅ Credit simulation calculator
- ✅ Real-time monthly payment calculation
- ✅ Amortization schedule generation
- ✅ Credit request form with validation
- ✅ PDF export of simulation + request
- ✅ Success confirmation page

### Admin Side
- ✅ Dashboard with statistics
- ✅ Request list with filters (status, search)
- ✅ Request details view
- ✅ Status management (pending → in progress → accepted/rejected)
- ✅ Priority flagging
- ✅ Notes system
- ✅ Status history tracking
- ✅ CSV export of all requests
- ✅ Notification system

## 🔧 API Endpoints (json-server)

Base URL: `http://localhost:3001`

### Simulations
- `GET /simulations` - Get all simulations
- `POST /simulations` - Create simulation
- `GET /simulations/:id` - Get simulation by ID

### Requests
- `GET /requests` - Get all requests
- `POST /requests` - Create request
- `GET /requests/:id` - Get request by ID
- `PATCH /requests/:id` - Update request
- `DELETE /requests/:id` - Delete request

### Notifications
- `GET /notifications` - Get all notifications
- `POST /notifications` - Create notification
- `PATCH /notifications/:id` - Update notification

## 📊 Financial Calculations

### Monthly Payment Formula
```
monthlyPayment = (P * r * (1 + r)^n) / ((1 + r)^n - 1)

Where:
P = Principal (loan amount)
r = Monthly interest rate (annual rate / 12)
n = Number of payments (duration in months)
```

### TAEG (APR) Calculation
Simplified formula:
```
TAEG = ((totalPaid - principal) / principal / years) * 100
```

### Amortization Schedule
For each month:
- Interest = Remaining Capital × Monthly Rate
- Principal = Monthly Payment - Interest
- Remaining Capital = Previous Remaining - Principal

## 🎨 Design System

### Colors (HSL)
```css
Primary: hsl(215, 75%, 25%)    /* Deep blue - trust */
Accent: hsl(160, 65%, 45%)     /* Emerald - success */
Warning: hsl(38, 92%, 50%)     /* Orange - alerts */
Success: hsl(160, 65%, 45%)    /* Emerald - positive */
Destructive: hsl(0, 72%, 51%)  /* Red - errors */
```

### Component Variants
All components use semantic tokens from the design system. No direct color classes (e.g., no `text-white`, `bg-blue-500`).

## 🧪 Testing the Application

### Guest Flow
1. Visit `http://localhost:8080/`
2. Fill in the simulation form
3. Click "Calculate"
4. Review results and amortization table
5. Click "Proceed to Request"
6. Fill in personal information
7. Submit request
8. See success confirmation

### Admin Flow
1. Visit `http://localhost:8080/admin`
2. View dashboard statistics
3. Navigate to "Requests"
4. Use filters and search
5. Click "View" on any request
6. Change status, add notes, toggle priority
7. Export CSV or PDF

## 📝 Form Validation

### Simulation Form
- Amount: 1,000€ - 500,000€
- Duration: 6 - 360 months
- Rate: 0% - 20%
- Fees: ≥ 0€
- Insurance: ≥ 0€

### Request Form
- First Name: min 2 characters
- Last Name: min 2 characters
- Email: valid email format
- Phone: min 10 digits
- Income: ≥ 0€
- Job Situation: required selection

## 🔐 Data Persistence

All data is stored in `db.json`:
- **Simulations**: Calculation history
- **Requests**: Credit applications with status
- **Notifications**: Admin notifications for new requests

The json-server automatically persists changes to disk.

## 🎯 Next Steps

### Possible Enhancements
- Add authentication (admin login)
- Integrate real backend API
- Add email notifications
- Implement document upload
- Add credit score calculation
- Create analytics dashboard
- Add multi-language support
- Implement dark mode toggle

### Production Deployment
1. Replace json-server with real backend
2. Add environment variables
3. Implement proper authentication
4. Add API rate limiting
5. Optimize bundle size
6. Add error tracking (Sentry)
7. Set up CI/CD pipeline

## 📚 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "zustand": "latest",
  "react-hook-form": "^7.61.1",
  "zod": "^3.25.76",
  "jspdf": "latest",
  "jspdf-autotable": "latest",
  "json-server": "latest",
  "tailwindcss": "^3.4.1",
  "@radix-ui/*": "latest"
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080 or 3001
lsof -ti:8080 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### CORS Issues
json-server automatically enables CORS. If issues persist, check your browser console.

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## 📞 Support

For issues or questions, please check:
1. This README
2. TypeScript types in `src/types/index.ts`
3. Component documentation in respective files
4. Browser console for runtime errors

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**

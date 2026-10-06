import { chart, colors, avatarFills } from './theme.js';

const cardSeries = [colors.accent, colors.ink, colors.primary, colors.sky];

// Seed data for every page. The store (store.jsx) copies this into state,
// so everything here can be changed from the UI. Replace with API calls later.

export const navItems = [
  { key: 'dashboard', label: 'Dashboard', title: 'Overview', icon: 'home' },
  { key: 'transactions', label: 'Transactions', icon: 'transfer' },
  { key: 'accounts', label: 'Accounts', icon: 'user' },
  { key: 'investments', label: 'Investments', icon: 'chart' },
  { key: 'cards', label: 'Credit Cards', icon: 'card' },
  { key: 'loans', label: 'Loans', icon: 'loan' },
  { key: 'services', label: 'Services', icon: 'service' },
  { key: 'privileges', label: 'My Privileges', icon: 'bulb' },
  { key: 'settings', label: 'Setting', icon: 'settings' },
];

export const seedCards = [
  { id: 1, variant: 'primary', bank: 'DBL Bank', type: 'Secondary', balance: 5756, holder: 'Eddy Cusuma', validThru: '12/22', number: '3778 4545 9685 1234', blocked: false },
  { id: 2, variant: 'light', bank: 'BRC Bank', type: 'Primary', balance: 5756, holder: 'Eddy Cusuma', validThru: '12/22', number: '3778 1245 6541 5600', blocked: false },
  { id: 3, variant: 'dark', bank: 'ABM Bank', type: 'Secondary', balance: 3210, holder: 'Eddy Cusuma', validThru: '09/25', number: '4532 7788 0012 9087', blocked: false },
];

// amount < 0 = expense, > 0 = income
export const seedTransactions = [
  { id: 1, desc: 'Spotify Subscription', txId: '#12548796', type: 'Shopping', cardId: 1, date: '2026-01-28T12:30', amount: -2500 },
  { id: 2, desc: 'Freepik Sales', txId: '#12548796', type: 'Transfer', cardId: 2, date: '2026-01-25T10:40', amount: 750 },
  { id: 3, desc: 'Mobile Service', txId: '#12548796', type: 'Service', cardId: 1, date: '2026-01-20T10:40', amount: -150 },
  { id: 4, desc: 'Wilson', txId: '#12548796', type: 'Transfer', cardId: 2, date: '2026-01-15T03:29', amount: -1050 },
  { id: 5, desc: 'Emilly', txId: '#12548796', type: 'Transfer', cardId: 1, date: '2026-01-14T10:40', amount: 840 },
  { id: 6, desc: 'Deposit Paypal', txId: '#12548797', type: 'Transfer', cardId: 1, date: '2026-01-12T09:10', amount: 2500 },
  { id: 7, desc: 'Jemi Wilson', txId: '#12548798', type: 'Transfer', cardId: 2, date: '2026-01-10T16:05', amount: 5400 },
  { id: 8, desc: 'Amazon Order', txId: '#12548799', type: 'Shopping', cardId: 3, date: '2026-01-08T19:22', amount: -320 },
  { id: 9, desc: 'Electricity Bill', txId: '#12548800', type: 'Service', cardId: 1, date: '2026-01-05T08:00', amount: -180 },
  { id: 10, desc: 'Salary', txId: '#12548801', type: 'Transfer', cardId: 2, date: '2026-01-01T09:00', amount: 5600 },
  { id: 11, desc: 'Netflix', txId: '#12548802', type: 'Service', cardId: 3, date: '2025-12-28T21:15', amount: -15 },
  { id: 12, desc: 'Apple Store', txId: '#12548803', type: 'Shopping', cardId: 1, date: '2025-12-22T13:45', amount: -450 },
];

export const monthlyExpense = [
  { month: 'Aug', value: 12500 },
  { month: 'Sep', value: 21000 },
  { month: 'Oct', value: 9500 },
  { month: 'Nov', value: 16000 },
  { month: 'Dec', value: 12500 },
  { month: 'Jan', value: 23000 },
];

export const weeklyActivity = [
  { day: 'Sat', deposit: 480, withdraw: 230 },
  { day: 'Sun', deposit: 350, withdraw: 120 },
  { day: 'Mon', deposit: 320, withdraw: 260 },
  { day: 'Tue', deposit: 480, withdraw: 360 },
  { day: 'Wed', deposit: 150, withdraw: 230 },
  { day: 'Thu', deposit: 390, withdraw: 230 },
  { day: 'Fri', deposit: 390, withdraw: 320 },
];

export const debitCredit = [
  { day: 'Sat', debit: 260, credit: 580 },
  { day: 'Sun', debit: 340, credit: 460 },
  { day: 'Mon', debit: 280, credit: 320 },
  { day: 'Tue', debit: 400, credit: 520 },
  { day: 'Wed', debit: 180, credit: 360 },
  { day: 'Thu', debit: 300, credit: 380 },
  { day: 'Fri', debit: 350, credit: 470 },
];

export const expenses = [
  { name: 'Entertainment', value: 30, color: chart.categorical[0] },
  { name: 'Bill Expense', value: 15, color: chart.categorical[1] },
  { name: 'Investment', value: 20, color: chart.categorical[2] },
  { name: 'Others', value: 35, color: chart.categorical[3] },
];

export const cardExpense = [
  { name: 'DBL Bank', value: 25, color: cardSeries[2] },
  { name: 'BRC Bank', value: 25, color: cardSeries[1] },
  { name: 'ABM Bank', value: 25, color: cardSeries[3] },
  { name: 'MCP Bank', value: 25, color: cardSeries[0] },
];

export const contacts = [
  { id: 1, name: 'Livia Bator', role: 'CEO', color: avatarFills[0], avatar: '/avatars/livia.jpg' },
  { id: 2, name: 'Randy Press', role: 'Director', color: avatarFills[1], avatar: '/avatars/randy.jpg' },
  { id: 3, name: 'Workman', role: 'Designer', color: avatarFills[2], avatar: '/avatars/workman.jpg' },
  { id: 4, name: 'Anna Ross', role: 'Manager', color: avatarFills[3], avatar: '/avatars/anna.jpg' },
  { id: 5, name: 'Omar Khan', role: 'Engineer', color: avatarFills[4], avatar: '/avatars/omar.jpg' },
];

export const balanceHistory = [
  { month: 'Jul', balance: 120 },
  { month: 'Aug', balance: 320 },
  { month: 'Sep', balance: 460 },
  { month: 'Oct', balance: 780 },
  { month: 'Nov', balance: 240 },
  { month: 'Dec', balance: 560 },
  { month: 'Jan', balance: 610 },
];

export const invoices = [
  { id: 1, name: 'Apple Store', ago: '5h ago', amount: 450, tone: 'sky' },
  { id: 2, name: 'Michael', ago: '2 days ago', amount: 160, tone: 'amber' },
  { id: 3, name: 'Playstation', ago: '5 days ago', amount: 1085, tone: 'teal' },
  { id: 4, name: 'William', ago: '10 days ago', amount: 90, tone: 'rose' },
];

export const yearlyInvestment = [
  { year: '2016', value: 5000 },
  { year: '2017', value: 22000 },
  { year: '2018', value: 16000 },
  { year: '2019', value: 36000 },
  { year: '2020', value: 20000 },
  { year: '2021', value: 30000 },
];

export const monthlyRevenue = [
  { year: '2016', value: 8000 },
  { year: '2017', value: 22000 },
  { year: '2018', value: 18000 },
  { year: '2019', value: 34000 },
  { year: '2020', value: 26000 },
  { year: '2021', value: 38000 },
];

export const seedInvestments = [
  { id: 1, name: 'Apple Store', category: 'E-commerce, Marketplace', value: 54000, ret: 16, tone: 'rose' },
  { id: 2, name: 'Samsung Mobile', category: 'E-commerce, Marketplace', value: 25300, ret: -4, tone: 'teal' },
  { id: 3, name: 'Tesla Motors', category: 'Electric Vehicles', value: 8200, ret: 25, tone: 'amber' },
];

export const trendingStocks = [
  { id: 1, name: 'Trivago', price: 520, ret: 5 },
  { id: 2, name: 'Canon', price: 480, ret: 10 },
  { id: 3, name: 'Uber Food', price: 350, ret: -3 },
  { id: 4, name: 'Nokia', price: 940, ret: 2 },
  { id: 5, name: 'Tiktok', price: 670, ret: -12 },
];

export const seedLoans = [
  { id: 1, amount: 100000, left: 40500, months: 8, rate: 12 },
  { id: 2, amount: 500000, left: 250000, months: 36, rate: 10 },
  { id: 3, amount: 900000, left: 40500, months: 12, rate: 12 },
  { id: 4, amount: 50000, left: 40500, months: 25, rate: 5 },
  { id: 5, amount: 50000, left: 40500, months: 5, rate: 16 },
  { id: 6, amount: 80000, left: 25500, months: 14, rate: 8 },
  { id: 7, amount: 12000, left: 5500, months: 9, rate: 13 },
  { id: 8, amount: 160000, left: 100800, months: 3, rate: 12 },
];

export const services = [
  { id: 1, name: 'Business loans', sub: 'It is a long established', icon: 'loan', tone: 'rose',
    cols: [['Lorem Ipsum', 'Many publishing'], ['Lorem Ipsum', 'Many publishing'], ['Lorem Ipsum', 'Many publishing']],
    detail: 'Flexible financing for growing businesses. Borrow from $10,000 to $1,000,000 with terms up to 7 years.' },
  { id: 2, name: 'Checking accounts', sub: 'It is a long established', icon: 'briefcase', tone: 'amber',
    cols: [['No monthly fee', 'With direct deposit'], ['Free ATM', '40,000+ locations'], ['Overdraft', 'Protection included']],
    detail: 'Everyday checking with no minimum balance, free debit card and instant transfers between BankDash accounts.' },
  { id: 3, name: 'Savings accounts', sub: 'It is a long established', icon: 'chart', tone: 'rose',
    cols: [['4.10% APY', 'Variable rate'], ['No minimum', 'To open'], ['Auto-save', 'Round-ups']],
    detail: 'High-yield savings with daily compounding. Set goals and automate transfers from checking.' },
  { id: 4, name: 'Debit and credit cards', sub: 'It is a long established', icon: 'card', tone: 'teal',
    cols: [['Cashback', 'Up to 3%'], ['No annual fee', 'First year'], ['Virtual cards', 'Instant issue']],
    detail: 'Choose from cashback, travel and secured cards. Freeze, unfreeze and set limits from Credit Cards.' },
  { id: 5, name: 'Life Insurance', sub: 'It is a long established', icon: 'shield', tone: 'sky',
    cols: [['Term life', '10–30 years'], ['Whole life', 'Lifetime cover'], ['Quote', 'In 2 minutes']],
    detail: 'Protect your family with term or whole life policies underwritten by our insurance partners.' },
  { id: 6, name: 'Business loans', sub: 'It is a long established', icon: 'loan', tone: 'rose',
    cols: [['SBA loans', 'Government-backed'], ['Equipment', 'Financing'], ['Lines of credit', 'Revolving']],
    detail: 'SBA-backed and equipment financing options for small businesses.' },
];

export const perks = [
  { id: 1, title: 'Airport Lounge Access', desc: '2 free visits per quarter at 1,200+ lounges.', cost: 3000, icon: 'plane' },
  { id: 2, title: '5% Cashback on Dining', desc: 'Boost dining cashback for 30 days.', cost: 1500, icon: 'gift' },
  { id: 3, title: 'Zero Forex Markup', desc: 'No foreign transaction fees for 60 days.', cost: 2500, icon: 'globe' },
  { id: 4, title: 'Movie Tickets', desc: 'Buy 1 get 1 free on weekend shows.', cost: 800, icon: 'star' },
  { id: 5, title: 'Priority Support', desc: 'Dedicated relationship manager for 90 days.', cost: 4000, icon: 'headset' },
  { id: 6, title: 'Fee Waiver', desc: 'Waive one annual card fee.', cost: 5000, icon: 'shield' },
];

export const seedProfile = {
  name: 'Charlene Reed',
  username: 'Charlene Reed',
  email: 'charlenereed@gmail.com',
  password: '**********',
  dob: '1990-01-25',
  presentAddress: 'San Jose, California, USA',
  permanentAddress: 'San Jose, California, USA',
  city: 'San Jose',
  postalCode: '45962',
  country: 'USA',
  avatar: '/profile.jpg',
};

export const seedPrefs = {
  currency: 'USD',
  timezone: '(GMT-12:00) International Date Line West',
  theme: 'light',
  notifyDigital: true,
  notifyMerchant: false,
  notifyRecommendations: true,
  twoFactor: true,
};

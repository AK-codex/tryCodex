import './globals.css';

export const metadata = {
  title: 'Daily Expense Dashboard',
  description: 'Track daily expenses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

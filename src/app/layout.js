import './globals.css';

export const metadata = {
  title: 'OmniCard | Dynamic Smart Digital Visiting Card Platform',
  description: 'Enterprise-grade dynamic digital visiting card & professional identity platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

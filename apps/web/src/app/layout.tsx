import './global.css';
import { lato } from './fonts';

export const metadata = {
  title: 'Multibrand Platform',
  description: 'Multibrand retail platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body>{children}</body>
    </html>
  );
}

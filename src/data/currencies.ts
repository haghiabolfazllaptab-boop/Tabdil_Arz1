export interface Currency {
  code: string;
  nameFa: string;
  nameEn: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', nameFa: 'دلار آمریکا', nameEn: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', nameFa: 'یورو', nameEn: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', nameFa: 'پوند انگلیس', nameEn: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', nameFa: 'ین ژاپن', nameEn: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', nameFa: 'دلار کانادا', nameEn: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', nameFa: 'دلار استرالیا', nameEn: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', nameFa: 'فرانک سوئیس', nameEn: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', nameFa: 'یوان چین', nameEn: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'HKD', nameFa: 'دلار هنگ‌کنگ', nameEn: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', nameFa: 'دلار نیوزیلند', nameEn: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', nameFa: 'کرون سوئد', nameEn: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', nameFa: 'کرون نروژ', nameEn: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', nameFa: 'کرون دانمارک', nameEn: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'SGD', nameFa: 'دلار سنگاپور', nameEn: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'KRW', nameFa: 'وون کره جنوبی', nameEn: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'INR', nameFa: 'روپیه هند', nameEn: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'RUB', nameFa: 'روبل روسیه', nameEn: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', nameFa: 'لیر ترکیه', nameEn: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'AED', nameFa: 'درهم امارات', nameEn: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', nameFa: 'ریال عربستان', nameEn: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'QAR', nameFa: 'ریال قطر', nameEn: 'Qatari Riyal', symbol: '﷼', flag: '🇶🇦' },
  { code: 'KWD', nameFa: 'دینار کویت', nameEn: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'BHD', nameFa: 'دینار بحرین', nameEn: 'Bahraini Dinar', symbol: '.د.ب', flag: '🇧🇭' },
  { code: 'OMR', nameFa: 'ریال عمان', nameEn: 'Omani Rial', symbol: '﷼', flag: '🇴🇲' },
  { code: 'IQD', nameFa: 'دینار عراق', nameEn: 'Iraqi Dinar', symbol: 'ع.د', flag: '🇮🇶' },
  { code: 'AFN', nameFa: 'افغانی افغانستان', nameEn: 'Afghan Afghani', symbol: '؋', flag: '🇦🇫' },
  { code: 'PKR', nameFa: 'روپیه پاکستان', nameEn: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'THB', nameFa: 'بات تایلند', nameEn: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', nameFa: 'رینگیت مالزی', nameEn: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', nameFa: 'روپیه اندونزی', nameEn: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'IRR', nameFa: 'ریال ایران', nameEn: 'Iranian Rial', symbol: '﷼', flag: '🇮🇷' },
];

const CURRENCY_MAP: Record<string, Currency> = CURRENCIES.reduce(
  (acc, c) => { acc[c.code] = c; return acc; },
  {} as Record<string, Currency>
);

export function getCurrency(code: string): Currency | undefined {
  return CURRENCY_MAP[code];
}

export function isSupported(code: string): boolean {
  return code in CURRENCY_MAP;
}

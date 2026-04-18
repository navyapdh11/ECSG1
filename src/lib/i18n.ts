export type Language = 'en' | 'zh' | 'vi' | 'hi';

export interface Translations {
  [key: string]: Record<Language, string>;
}

export const translations: Translations = {
  'bookNow': { en: 'Book Now', zh: '立即预订', vi: 'Đặt ngay', hi: 'अभी बुक करें' },
  'viewPricing': { en: 'View Pricing', zh: '查看价格', vi: 'Xem giá', hi: 'मूल्य देखें' },
  'aiAssistant': { en: 'AI Assistant', zh: 'AI助手', vi: 'Trợ lý AI', hi: 'AI सहायक' },
  'selectServices': { en: 'Select Services', zh: '选择服务', vi: 'Chọn dịch vụ', hi: 'सेवाएँ चुनें' },
  'dateTime': { en: 'Date & Time', zh: '日期和时间', vi: 'Ngày & Giờ', hi: 'दिनांक और समय' },
  'yourDetails': { en: 'Your Details', zh: '您的详细信息', vi: 'Chi tiết của bạn', hi: 'आपका विवरण' },
  'confirmation': { en: 'Confirmation', zh: '确认', vi: 'Xác nhận', hi: 'पुष्टि' },
  'bookingConfirmed': { en: 'Booking Confirmed!', zh: '预订已确认！', vi: 'Đã xác nhận đặt phòng!', hi: 'बुकिंग की पुष्टि!' },
  'total': { en: 'Total', zh: '总计', vi: 'Tổng', hi: 'कुल' },
  'payWithStripe': { en: 'Pay with Stripe', zh: '使用Stripe支付', vi: 'Thanh toán bằng Stripe', hi: 'Stripe से भुगतान करें' },
  'specialInstructions': { en: 'Special Instructions', zh: '特殊说明', vi: 'Hướng dẫn đặc biệt', hi: 'विशेष निर्देश' },
  'services': { en: 'Services', zh: '服务', vi: 'Dịch vụ', hi: 'सेवाएँ' },
  'pricing': { en: 'Pricing', zh: '定价', vi: 'Bảng giá', hi: 'मूल्य' },
  'rewards': { en: 'Rewards', zh: '奖励', vi: 'Phần thưởng', hi: 'इनाम' },
  'home': { en: 'Home', zh: '首页', vi: 'Trang chủ', hi: 'होम' },
};

export function t(key: string, lang: Language = 'en'): string {
  return translations[key]?.[lang] || key;
}

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇦🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

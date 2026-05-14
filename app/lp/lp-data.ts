// ── LP DATA — 5 Audience Versions ──
// Slug → audience-specific copy for all SWAP sections

export type LPSlug = 'lp' | 'lp-2' | 'lp-3' | 'lp-4' | 'lp-5';

export interface LPData {
  slug: LPSlug;
  audience: string;
  lang: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    headlineEm: string;
    headlineEnd: string;
    subheadline: string;
    cta: string;
    urgency: string;
  };
  problem: {
    sectionLabel: string;
    title: string;
    pains: string[];
    bridge: string;
  };
  form: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  midCta: { headline: string; cta: string };
  finalCta: { headline: string; body: string; cta: string };
  benefits: { icon: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { quote: string; name: string; location: string; flag: string }[];
}

export const LP_DATA: Record<LPSlug, LPData> = {

  // ── LP-1: Universal / All International ──
  'lp': {
    slug: 'lp',
    audience: 'Universal',
    lang: 'EN',
    meta: {
      title: 'Kado Bajo — Authentic NTT Souvenirs at Komodo Airport',
      description: 'Order online. Personal shopper prepares everything. Pick up at Komodo Airport before you fly home.',
    },
    hero: {
      eyebrow: 'Komodo Airport · Labuan Bajo · NTT',
      headline: 'The Best of East Nusa Tenggara —',
      headlineEm: 'Ready at Komodo Airport',
      headlineEnd: 'Before You Fly Home',
      subheadline: 'Order online. Your personal shopper prepares everything. Pick up right before check-in — zero stress, zero luggage hassle.',
      cta: 'Reserve My Gifts Now →',
      urgency: '⏰ Order before your flight. We\'ll have everything packed and ready.',
    },
    problem: {
      sectionLabel: 'Sound familiar?',
      title: 'The souvenir problem every traveller knows',
      pains: [
        'Running out of time to shop after a packed Komodo trip',
        'Souvenir shops at the airport — limited selection, inflated prices',
        'Buying something rushed and regretting it on the plane home',
      ],
      bridge: "That's exactly what Kado Bajo exists to fix.",
    },
    form: {
      headline: 'Tell Us About Your Trip — We\'ll Handle the Rest',
      subheadline: 'No payment now. Just tell us your flight date and what you\'re looking for.',
      cta: 'Reserve My Order — Free →',
    },
    midCta: {
      headline: 'Ready to order?',
      cta: 'Order Now — Pick Up at Komodo Airport →',
    },
    finalCta: {
      headline: "Don't Leave Komodo Without a Piece of It",
      body: 'Order now → we prepare everything → pick up before check-in. Zero hassle.',
      cta: 'Order Now & Pick Up at the Airport →',
    },
    benefits: [
      { icon: '🧵', title: 'The most complete NTT collection', desc: 'Tenun Ikat, Flores coffee, wild honey, Komodo carvings, pearls — curated from the best local makers, not tourist-trap rejects.' },
      { icon: '✈️', title: 'Airport pickup — zero detour', desc: 'Our store is right at Komodo Airport. Pick up your order minutes before check-in. No extra trip, no time wasted.' },
      { icon: '🎁', title: 'Not sure what to get? We choose for you', desc: 'Tell us who you\'re buying for and your budget. Your personal shopper selects, packs, and gift-wraps everything. Completely free.' },
      { icon: '📦', title: 'Packed to survive the journey', desc: 'Professional packing with carry-on safe materials. Fragile items wrapped properly. Nothing arrives broken.' },
      { icon: '🤝', title: 'Every purchase supports local artisans', desc: 'We work directly with weavers, carvers, and farmers across NTT. Your souvenir carries a real story.' },
    ],
    faqs: [
      { q: 'When should I order?', a: 'At least 4 hours before your flight. Ordering the day before or earlier is ideal — gives us time to prepare everything perfectly.' },
      { q: 'Where exactly do I pick up?', a: 'Kado Bajo store is located right at Komodo Airport (LBJ), in front of the departure terminal. You\'ll see us before the check-in counters.' },
      { q: 'I don\'t know what to buy — is that okay?', a: 'Completely fine. Just tell us your budget and who you\'re buying for. Your personal shopper will select the best items for you.' },
      { q: 'Is packing really free?', a: 'Yes — gift wrapping, tissue, ribbon, and a custom Kado Bajo box are all included at no extra charge.' },
      { q: 'What payment methods are accepted?', a: 'Cash (IDR, USD, AUD, SGD), all major credit/debit cards, and bank transfer. No hidden charges.' },
    ],
    testimonials: [
      { quote: 'I was running around Labuan Bajo with no time to shop. Ordered from Kado Bajo at the hotel, picked up at the airport. Easiest souvenir experience I\'ve ever had.', name: 'Sarah M.', location: 'Melbourne, Australia', flag: '🇦🇺' },
      { quote: 'The Tenun Ikat they helped me choose is the most-asked-about thing in my home. Completely unique. Nothing like it.', name: 'James K.', location: 'London, UK', flag: '🇬🇧' },
      { quote: 'Perfect solution for last-minute gift shopping. The personal shopper knew exactly what would work for my family.', name: 'Priya S.', location: 'Singapore', flag: '🇸🇬' },
    ],
  },

  // ── LP-2: EU / US ──
  'lp-2': {
    slug: 'lp-2',
    audience: 'EU / US',
    lang: 'EN',
    meta: {
      title: 'Kado Bajo — Artisan NTT Souvenirs for Discerning Travellers',
      description: 'Curated authentic souvenirs from East Nusa Tenggara. Personal shopper service. Ready at Komodo Airport.',
    },
    hero: {
      eyebrow: 'Komodo Airport · Labuan Bajo · NTT Indonesia',
      headline: 'The Last Thing You\'ll Do in Komodo —',
      headlineEm: 'And the One You\'ll Talk About Most',
      headlineEnd: '',
      subheadline: 'Handcrafted pieces from local artisans. A personal shopper selects, packs, and gift-wraps your order. Ready at Komodo Airport before you fly.',
      cta: 'Reserve My Gifts Now →',
      urgency: '⏰ Order before your flight. We\'ll have everything packed and ready at the airport.',
    },
    problem: {
      sectionLabel: 'You\'ve been there.',
      title: 'The souvenir trap at the end of every great trip',
      pains: [
        'The airport shop: overpriced mass-produced items with no story behind them',
        'No time left to find something genuinely artisan after a full Komodo itinerary',
        'Bringing home something that felt good in the moment — forgettable a week later',
      ],
      bridge: 'Kado Bajo exists for travellers who want souvenirs with actual meaning.',
    },
    form: {
      headline: 'Tell Us About Your Trip — We\'ll Handle the Rest',
      subheadline: 'No payment now. Tell us your flight date, budget, and who you\'re buying for.',
      cta: 'Reserve My Order — Free →',
    },
    midCta: {
      headline: 'Ready to bring home something real?',
      cta: 'Order Now — Pick Up at Komodo Airport →',
    },
    finalCta: {
      headline: "Don't Leave Komodo Without a Piece of It",
      body: 'You came this far to see something extraordinary. The souvenirs should match. Order now → pickup at airport.',
      cta: 'Reserve My Gifts Now →',
    },
    benefits: [
      { icon: '🧵', title: 'Artisan quality, not tourist tat', desc: 'Every piece is sourced from local weavers, carvers, and farmers across NTT — not factory-produced replicas. Real craft, real provenance.' },
      { icon: '✈️', title: 'Pick up right at the airport', desc: 'No extra stop. Our store is at Komodo Airport (LBJ). You collect before check-in and that\'s it.' },
      { icon: '🌍', title: 'Direct community impact', desc: 'We work directly with artisan communities across Flores and NTT. Your purchase funds local craft, not middlemen.' },
      { icon: '📦', title: 'Packed for international travel', desc: 'Carry-on safe, fragile-item protected, customs-cleared categories. We know what travels well.' },
      { icon: '🎁', title: 'Personal curation — completely free', desc: 'Not sure what to choose? Your dedicated shopper selects based on your brief and budget. Gift-wrapped and ready.' },
    ],
    faqs: [
      { q: 'When should I order?', a: 'At least 4 hours before your flight. The day before is ideal for large or complex orders.' },
      { q: 'Can I pay in USD or EUR?', a: 'Yes. We accept USD, EUR, AUD, GBP, and SGD in cash, plus all major international credit cards.' },
      { q: 'Are the products genuinely handmade?', a: 'Yes — we work directly with makers. No mass-produced items. We can tell you exactly who made each piece.' },
      { q: 'Where exactly is the pickup?', a: 'Kado Bajo is at Komodo Airport (LBJ), before the departure check-in counters. You\'ll walk past us naturally.' },
      { q: 'Is the personal shopper service really free?', a: 'Completely free. Tell us your budget and brief — your shopper does the rest at no extra charge.' },
    ],
    testimonials: [
      { quote: 'I gave them a budget and said "something for someone who appreciates craft." The Tenun Ikat they chose is genuinely stunning. I\'ve never seen anything like it in a European museum shop.', name: 'Marcus T.', location: 'Berlin, Germany', flag: '🇩🇪' },
      { quote: 'The honesty of the service surprised me. They told me which items weren\'t worth the price. That kind of integrity made me spend more, not less.', name: 'Claire F.', location: 'San Francisco, USA', flag: '🇺🇸' },
      { quote: 'Picked up at the airport with 20 minutes to spare. Everything was wrapped beautifully. My family thought I had planned it for weeks.', name: 'Emma R.', location: 'London, UK', flag: '🇬🇧' },
    ],
  },

  // ── LP-3: SEA (Singapore, Malaysia, etc) ──
  'lp-3': {
    slug: 'lp-3',
    audience: 'SEA',
    lang: 'EN',
    meta: {
      title: 'Kado Bajo — NTT Souvenirs Ready at Komodo Airport',
      description: 'Order online, pick up at Komodo Airport. Personal shopper included — free. Trusted by travellers from 30+ countries.',
    },
    hero: {
      eyebrow: 'Komodo Airport · Labuan Bajo · NTT',
      headline: 'You Just Saw the World\'s Most Legendary Lizards.',
      headlineEm: 'Now Take Home Something as Extraordinary.',
      headlineEnd: '',
      subheadline: 'Order online in 2 minutes. Personal shopper prepares your gifts. Pick up at Komodo Airport — done.',
      cta: 'Order Now →',
      urgency: '✅ Trusted by travellers from 30+ countries',
    },
    problem: {
      sectionLabel: 'We get it.',
      title: 'No time to shop after a packed Komodo trip',
      pains: [
        'No time to shop properly after a packed Komodo itinerary',
        'Souvenir shops in Labuan Bajo — inconsistent quality, hard to pick',
        'Buying something last-minute and regretting it on the flight home',
      ],
      bridge: "That's why thousands of SEA travellers use Kado Bajo.",
    },
    form: {
      headline: 'Get Your Gifts Ready in 2 Minutes',
      subheadline: 'No payment now. Fill in your details and we\'ll handle everything.',
      cta: 'Reserve My Order — Free →',
    },
    midCta: {
      headline: 'Already convinced?',
      cta: 'Order Now — Pick Up at Komodo Airport →',
    },
    finalCta: {
      headline: "Your Friends Are Going to Ask Where You Got That.",
      body: 'Order now → we prepare → airport pickup. Simple as that.',
      cta: 'Order Now & Pick Up at the Airport →',
    },
    benefits: [
      { icon: '🛍️', title: 'Best selection in Labuan Bajo', desc: 'Tenun Ikat, Flores coffee, wild honey, Komodo carvings, pearls. Curated from top local makers — stuff your friends will actually ask about.' },
      { icon: '✈️', title: 'Pick up at the airport — no detour', desc: 'Right at Komodo Airport (LBJ). Collect before check-in. Zero extra trip.' },
      { icon: '🎁', title: 'Personal shopper included — totally free', desc: 'Tell us budget and who you\'re buying for. We select, pack, and gift-wrap. You just pick up.' },
      { icon: '📦', title: 'Gift-ready packing included', desc: 'Every order comes beautifully wrapped and ready to give. No extra charge.' },
      { icon: '⭐', title: 'Authentic. Not tourist-trap stuff.', desc: '5-star rated. Real artisan products sourced directly from NTT makers. Not mass-produced souvenirs.' },
    ],
    faqs: [
      { q: 'When should I order?', a: 'At least 4 hours before your flight. Ordering the night before is ideal.' },
      { q: 'Can I add items when I collect?', a: 'Yes — just let us know in the notes. We\'ll have recommendations ready for you at pickup.' },
      { q: 'Is the personal shopper really free?', a: 'Yes. No extra charge. We\'re included in the service.' },
      { q: 'Where is the pickup exactly?', a: 'Kado Bajo store at Komodo Airport (LBJ) — right before the check-in counters.' },
      { q: 'What payment methods?', a: 'Cash (IDR, SGD, MYR, USD), Visa, Mastercard, bank transfer. No hidden fees.' },
    ],
    testimonials: [
      { quote: 'Ordered at 9pm, picked up at 10am next day. Everything was wrapped and ready. The Tenun cloth they chose for my mom was perfect — she loved it.', name: 'Ravi K.', location: 'Singapore', flag: '🇸🇬' },
      { quote: 'Was sceptical at first but wow — the service is real. Personal shopper WhatsApp\'d me to confirm what I wanted. Super professional.', name: 'Aisha B.', location: 'Kuala Lumpur, Malaysia', flag: '🇲🇾' },
      { quote: 'Best souvenir experience I\'ve had in Indonesia. No stress, no haggling, everything done. Will use again next trip.', name: 'Kevin L.', location: 'Bangkok, Thailand', flag: '🇹🇭' },
    ],
  },

  // ── LP-4: AUS / NZ ──
  'lp-4': {
    slug: 'lp-4',
    audience: 'AUS / NZ',
    lang: 'EN',
    meta: {
      title: 'Kado Bajo — Real Komodo Souvenirs, No Faff',
      description: 'Sort your souvenirs before you fly. Personal shopper, airport pickup, zero stress. Right at Komodo Airport.',
    },
    hero: {
      eyebrow: 'Komodo Airport · Labuan Bajo · NTT',
      headline: 'You Survived Komodo Dragons.',
      headlineEm: 'Souvenirs Shouldn\'t Be the Hard Part.',
      headlineEnd: '',
      subheadline: 'Tell us what you need. We sort it, pack it, and have it ready at Komodo Airport before you fly.',
      cta: 'Sort My Souvenirs →',
      urgency: "🦘 Don't be the one who flew home with nothing worth showing.",
    },
    problem: {
      sectionLabel: 'Sounds familiar?',
      title: 'The classic end-of-trip souvenir scramble',
      pains: [
        'Completely out of time after the Komodo tour — no energy left for shopping',
        'Airport shops: overpriced rubbish with "Bali" written on everything',
        'Buying something random at the last second because you felt obligated',
      ],
      bridge: "Yeah, we built Kado Bajo specifically for this situation.",
    },
    form: {
      headline: 'Chuck Us Your Details — We\'ll Sort It',
      subheadline: 'No payment now. Just tell us your flight and what you\'re after.',
      cta: 'Reserve My Order — Free →',
    },
    midCta: {
      headline: 'Ready to sort it?',
      cta: 'Order Now — Pick Up at Komodo Airport →',
    },
    finalCta: {
      headline: "Don't Go Home Regretting You Didn't.",
      body: 'Order online → we sort everything → pick up at the airport. Dead simple.',
      cta: 'Sort My Souvenirs Now →',
    },
    benefits: [
      { icon: '✅', title: 'The real deal — not tourist tat', desc: 'Handwoven Tenun Ikat, single-origin Flores coffee, wild NTT honey, hand-carved Komodo figures. Sourced directly from local makers. Nothing mass-produced.' },
      { icon: '✈️', title: 'Airport pickup — couldn\'t be easier', desc: 'We\'re right at Komodo Airport (LBJ). Grab your order before check-in. Done. No extra trip anywhere.' },
      { icon: '🤝', title: 'Your money goes to actual people', desc: 'We buy directly from weavers, carvers, farmers in NTT. Not via a middleman chain. Real community impact.' },
      { icon: '📦', title: 'Packed properly — yeah, for real', desc: 'Professional packing, carry-on safe, nothing arrives broken. We\'ve done this enough times to know what works.' },
      { icon: '🎁', title: 'Not sure what to get? Just ask.', desc: 'Personal shopper. Free. Tell us budget + who it\'s for. We pick, we wrap, we have it ready. You just show up.' },
    ],
    faqs: [
      { q: 'When do I need to order by?', a: 'At least 4 hours before your flight. Night before is better for bigger orders.' },
      { q: 'Is packing included or is that a catch?', a: 'No catch. Gift wrapping is included in the service. Zero extra charge. We wouldn\'t mess around with that.' },
      { q: 'Can I pay in AUD?', a: 'Yes — AUD, NZD, USD, IDR all fine. Cash or card. No faff.' },
      { q: 'What if I don\'t know what I want?', a: 'Tell the personal shopper your budget and who it\'s for. They\'ll sort it. That\'s literally the service.' },
      { q: 'Where exactly is the pickup?', a: 'Kado Bajo is at Komodo Airport (LBJ), right before the check-in counters. You\'ll walk past us.' },
    ],
    testimonials: [
      { quote: 'Mate, it actually works. Ordered from the hotel, rocked up to the airport, grabbed my stuff. The personal shopper picked something genuinely beautiful. No regrets.', name: 'Tom H.', location: 'Sydney, Australia', flag: '🇦🇺' },
      { quote: 'I was totally sceptical — too good to be true vibe. But nah, it\'s legit. The Tenun cloth is properly gorgeous. Everyone asks about it.', name: 'Brooke S.', location: 'Auckland, NZ', flag: '🇳🇿' },
      { quote: 'Three kids, zero time. This was a lifesaver. Ordered at dinner, picked up the next morning. All sorted.', name: 'Dan & Amy K.', location: 'Melbourne, Australia', flag: '🇦🇺' },
    ],
  },

  // ── LP-5: Indonesia ──
  'lp-5': {
    slug: 'lp-5',
    audience: '🇮🇩 Indonesia',
    lang: 'ID',
    meta: {
      title: 'Kado Bajo — Oleh-Oleh NTT Terlengkap di Bandara Komodo',
      description: 'Pesan online, personal shopper siapkan semua, ambil di Bandara Komodo sebelum terbang. Gratis packing & gift wrap.',
    },
    hero: {
      eyebrow: 'Bandara Komodo · Labuan Bajo · NTT',
      headline: 'Oleh-Oleh NTT Terbaik —',
      headlineEm: 'Siap di Bandara Komodo',
      headlineEnd: 'Sebelum Kamu Pulang',
      subheadline: 'Pesan online, personal shopper kami siapkan semuanya, ambil di depan bandara sebelum check-in. Praktis banget.',
      cta: 'Pesan Sekarang →',
      urgency: '⏰ Pesan sebelum penerbangan — semua sudah siap di bandara.',
    },
    problem: {
      sectionLabel: 'Pernah ngalamin ini?',
      title: 'Masalah oleh-oleh yang selalu muncul di akhir perjalanan',
      pains: [
        'Mau beli oleh-oleh tapi tidak tahu yang mana worth it dan mana yang tidak',
        'Takut barang rusak di koper atau tidak bisa dibawa di kabin pesawat',
        'Harga di toko turis mahal tapi kualitas tidak jelas — beli jadi ragu-ragu',
      ],
      bridge: 'Makanya Kado Bajo ada — khusus untuk kamu yang mau oleh-oleh yang worth it tanpa ribet.',
    },
    form: {
      headline: 'Beritahu Kami, Kami Urus Semuanya',
      subheadline: 'Tidak ada pembayaran dulu. Cukup isi data, personal shopper kami akan hubungi kamu.',
      cta: 'Pesan Sekarang — Gratis →',
    },
    midCta: {
      headline: 'Sudah yakin?',
      cta: 'Pesan Sekarang — Ambil di Bandara →',
    },
    finalCta: {
      headline: "Jangan Pulang Tanpa Kenangan yang Worth It.",
      body: 'Pesan sekarang → kami siapkan → ambil di bandara sebelum check-in. Gampang.',
      cta: 'Pesan Sekarang & Ambil di Bandara →',
    },
    benefits: [
      { icon: '🧵', title: 'Terlengkap dan terpercaya di Labuan Bajo', desc: 'Tenun Ikat, kopi Flores, madu hutan NTT, ukiran Komodo, mutiara — dikurasi langsung dari pengrajin lokal terbaik.' },
      { icon: '✈️', title: 'Langsung di Bandara Komodo — tidak perlu mampir', desc: 'Toko Kado Bajo ada persis di depan Bandara Komodo (LBJ). Ambil sebelum check-in. Tidak perlu detour kemana-mana.' },
      { icon: '🎁', title: 'Personal shopper gratis — bantu pilih yang terbaik', desc: 'Tidak tahu mau beli apa? Kasih tahu budget dan untuk siapa. Shopper kami yang pilih, kemas, dan gift wrap semuanya.' },
      { icon: '📦', title: 'Packing aman — aman dibawa naik pesawat', desc: 'Dikemas secara profesional, aman untuk kabin, barang pecah belah dibungkus dengan benar. Tidak perlu khawatir.' },
      { icon: '🤝', title: 'Langsung dukung pengrajin lokal NTT', desc: 'Kami beli langsung dari penenun, pemahat, dan petani di NTT. Uangmu langsung sampai ke mereka.' },
    ],
    faqs: [
      { q: 'Kapan harus pesan?', a: 'Minimal 4 jam sebelum penerbangan. Pesan malamnya atau sehari sebelum lebih nyaman — kami punya waktu menyiapkan dengan baik.' },
      { q: 'Bisa bayar QRIS atau transfer?', a: 'Bisa. Kami terima QRIS, transfer bank, kartu kredit/debit, dan tunai (IDR, USD, SGD). Tidak ada biaya tambahan.' },
      { q: 'Kalau berubah pikiran gimana?', a: 'Tidak masalah. Hubungi kami via WhatsApp — kami fleksibel selama pesanan belum terlanjur dikemas.' },
      { q: 'Produknya aman dibawa di kabin?', a: 'Kami sudah tahu kategori mana yang boleh masuk kabin dan mana yang harus bagasi. Packing disesuaikan otomatis.' },
      { q: 'Dimana tepatnya toko Kado Bajo?', a: 'Toko Kado Bajo ada di depan Bandara Komodo (LBJ), sebelum counter check-in. Kamu pasti lewat sana.' },
    ],
    testimonials: [
      { quote: 'Pesan lewat WhatsApp semalam sebelumnya, besoknya tinggal ambil di bandara. Bungkusannya cantik banget — langsung jadi kado tanpa wrap lagi. Recommended!', name: 'Dewi R.', location: 'Jakarta', flag: '🇮🇩' },
      { quote: 'Tadinya ragu karena biasanya oleh-oleh bandara mahal dan biasa. Tapi Kado Bajo beda — personal shoppernya bantu pilih tenun yang beneran bagus. Worth it!', name: 'Budi S.', location: 'Surabaya', flag: '🇮🇩' },
      { quote: 'Kopi Flores yang mereka rekomendasiin jadi favorit di kantor. Semua nanya belinya dimana. Sudah kasih nomor WA Kado Bajo ke beberapa teman.', name: 'Rina M.', location: 'Bali', flag: '🇮🇩' },
    ],
  },
};

export const VALID_SLUGS: LPSlug[] = ['lp', 'lp-2', 'lp-3', 'lp-4', 'lp-5'];

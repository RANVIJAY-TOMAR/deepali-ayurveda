export const BRAND_NAME = "Deepali Ayurveda";
export const BRAND_ESTABLISHED = 1997;
export const BRAND_LOCATION = "Unnao, Uttar Pradesh, India";
export const BRAND_TAGLINE = "Tradition of Ayurveda. Trust Through Generations.";
export const BRAND_HERO_HEADLINE = "THE WISDOM OF AYURVEDA. REIMAGINED FOR TODAY.";
export const BRAND_HERO_SUBTEXT = "Rooted in Unnao, on the banks of the sacred River Ganga. Classical Ayurvedic formulations trusted across generations since 1997.";
export const BRAND_HERO_CTA = "EXPLORE PRODUCTS";
export const BRAND_STORYLINE_GANGA = "Rooted in Unnao, on the banks of the sacred River Ganga.";
export const BRAND_STORYLINE_HERITAGE = "Rooted in the heritage of Unnao. Inspired by the timeless wisdom of Ayurveda.";

// Contact Details
export const BRAND_WHATSAPP_NUMBER = "919140086856";
export const BRAND_SUPPORT_PHONE = "9140086856";
export const BRAND_SUPPORT_PHONE_DISPLAY = "+91 91400 86856";
export const BRAND_SUPPORT_EMAIL = "deepaliintouch@gmail.com";
export const BRAND_ADDRESS = "C-9, Awas Vikas Colony, Unnao, Uttar Pradesh, India.";

// Vaidya Consultation
export const VAIDYA_CONSULTATION_FEE = 200;

export const CATEGORIES = [
  "All Products",
  "Ayurvedic Medicines",
  "Herbal Formulations",
  "Digestive Wellness",
];

export const CATEGORY_DETAILS = [
  {
    id: "ayurvedic-medicines",
    title: "Ayurvedic Medicines",
    hindiTitle: "शास्त्रीय औषधियाँ",
    description: "Classical Shastriya formulations prepared following authentic Ayurvedic texts to address chronic bodily imbalances, de-addiction recovery, and deep tissue rejuvenation.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    badge: "Classical Shastriya Standards",
    productCount: 1
  },
  {
    id: "herbal-formulations",
    title: "Herbal Formulations",
    hindiTitle: "प्राकृतिक जड़ी-बूटी योग",
    description: "Whole-plant nutraceuticals replenishing essential micronutrients, cellular antioxidants, and nerve vitality without chemical isolates.",
    image: "https://images.unsplash.com/photo-1570283988059-af8412f4fe91?auto=format&fit=crop&w=800&q=80",
    badge: "100% Plant Synergy",
    productCount: 2
  },
  {
    id: "digestive-wellness",
    title: "Digestive Wellness",
    hindiTitle: "पाचन एवं जठराग्नि कल्याण",
    description: "Time-tested herbal blends that kindle Jatharagni (digestive fire), clear metabolic toxins (Ama), and restore harmony to the gut-brain axis.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    badge: "Gut-Brain Restoration",
    productCount: 2
  }
];

export const VERIFIED_TESTIMONIALS = [
  {
    id: 1,
    name: "Rameshwar Sharma",
    location: "Unnao, Uttar Pradesh",
    verifiedPurchase: true,
    rating: 5,
    productName: "Daaru Mukti Powder",
    review: "Our family has trusted Deepali Ayurveda for years. When a close relative struggled with alcohol cravings, we gave this powder with food. In 4 weeks, the cravings dropped drastically, and sleep returned to normal. 100% discreet plain packaging gave us complete peace of mind.",
    date: "Verified Customer • October 2026"
  },
  {
    id: 2,
    name: "Dr. Anita Kulkarni",
    location: "Pune, Maharashtra",
    verifiedPurchase: true,
    rating: 5,
    productName: "Plant Vitamin B12 + D3 + K2 + Calcium",
    review: "As a vegetarian doctor, I routinely found synthetic B12 supplements caused digestive discomfort. Deepali Ayurveda's plant-based 4-in-1 is remarkable. My peripheral tingling in feet stopped within 3 weeks, and serum B12 levels normalized.",
    date: "Verified Customer • September 2026"
  },
  {
    id: 3,
    name: "Vikramjit Singh",
    location: "Ludhiana, Punjab",
    verifiedPurchase: true,
    rating: 5,
    productName: "Digest Guru Churan",
    review: "Severe post-dinner bloating and acid reflux had been troubling me for months. 1 teaspoon of Digest Guru in lukewarm water worked from day 2. Unlike over-the-counter antacids, it gently restored natural morning bowel regularity without dependency.",
    date: "Verified Customer • August 2026"
  },
  {
    id: 4,
    name: "Sunita Mehra",
    location: "New Delhi",
    verifiedPurchase: true,
    rating: 5,
    productName: "Sea Buckthorn Pure Berry Extract",
    review: "The natural Omega 7 and Vitamin C in Sea Buckthorn cleared up my chronic skin dryness and seasonal allergy sneezes. The authenticity of Deepali Ayurveda's ingredients since 1997 is evident in the quality.",
    date: "Verified Customer • November 2026"
  }
];

export const HERITAGE_TIMELINE = [
  {
    year: "1997",
    milestone: "Founding in Unnao, Uttar Pradesh",
    description: "Deepali Ayurveda was established in Unnao on the fertile banks of the sacred River Ganga, adhering strictly to Charaka and Sushruta Samhita classical Ayurvedic principles."
  },
  {
    year: "2006",
    milestone: "Classical Decoctions & Kwath Mastery",
    description: "Refined traditional low-heat water decoction (Kwath) extraction to preserve volatile botanical phytochemicals without chemical solvents."
  },
  {
    year: "2016",
    milestone: "Rigorous Quality Assurance Standards",
    description: "Enhanced clean compounding protocols, NABL heavy metal batch testing, and zero-synthetic filler commitments while honoring 100% classical recipes."
  },
  {
    year: "Present",
    milestone: "Direct-to-Customer Store & Vaidya Care",
    description: "Bringing authentic Ayurvedic remedies, fresh batch preparations, discreet plain box packaging, and personalized Vaidya phone guidance (₹200) directly to patrons nationwide."
  }
];

export const COMMON_SYMPTOMS = [
  { id: "alcohol-craving", label: "Alcohol Urges & Liver Health", tag: "De-Addiction" },
  { id: "b12-d3-deficiency", label: "B12 & D3 Deficiency (Nerves/Bones)", tag: "Deficiency" },
  { id: "gut-acidity-gas", label: "Gas, Acidity & Digestion", tag: "Gut Health" },
  { id: "aging-dull-skin", label: "Skin Hydration & Antioxidants", tag: "Cellular Care" },
  { id: "cravings-weight", label: "Metabolism & Heavy Cravings", tag: "Metabolism" },
];

export const PRODUCTS = [
  {
    id: "daaru-mukti-powder",
    name: "Daaru Mukti Powder",
    sanskritName: "दारू मुक्ति चूर्ण (व्यसन मुक्ति योग)",
    subName: "100% Classical Herbal Anti-Alcohol & Liver Detox Formula",
    category: "Ayurvedic Medicines",
    price: 1100,
    originalPrice: 1599,
    rating: 4.96,
    reviewCount: 842,
    inStock: true,
    tag: "1 Month Supply (30 Sachets) • 100% Discreet Packaging",
    badgeColor: "bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]",
    volume: "1 Month Supply (30 Sachets)",
    serving: "30 Daily Sachets (1 Sachet Each Day)",
    shelfLife: "24 Months",
    scientificFact: "Kudzu root contains natural isoflavones (puerarin) that blunt alcohol cravings in the brain's dopamine reward centers, while Bhumi Amla rapidly metabolizes toxic acetaldehyde to protect liver cells.",
    shortDescription: "1 Month Supply of time-tested classical Ayurvedic formula consisting of 30 individual daily sachets (1 sachet each day for 30 days) to curb alcohol cravings, soothe withdrawal restlessness, and regenerate fatty liver cells. Can be taken openly or mixed discreetly into food.",
    heroBenefit: "Eliminates alcohol cravings, calms withdrawal tremors & anxiety, repairs alcohol-damaged liver cells. 1 Month Supply containing 30 daily sachets (1 sachet each day for 30 days). 100% Plain Box Discreet Packaging Guaranteed.",

    symptoms: [
      "Compulsive alcohol cravings & urge to drink daily",
      "Severe withdrawal symptoms: hand tremors, anxiety, sweating & restlessness",
      "Alcohol-induced liver damage, fatty liver & elevated liver enzymes (SGOT/SGPT)",
      "Alcohol-dependent sleep, restless nights & morning hangovers",
      "Severe stomach acidity, nausea, loss of appetite & burning in chest",
      "Nervous exhaustion, brain fog & loss of emotional self-control",
      "Family emotional distress & financial strain caused by addiction"
    ],

    whyYouNeedIt: [
      "30 Individual Daily Sachets (1 Sachet Each Day): Pre-measured daily dosage ensures exact potency, effortless consumption, and a disciplined 30-day course with zero waste.",
      "Blunts Alcohol Reward Pathways in the Brain: Kudzu Root (Vidarikand) is clinically revered in herbal medicine for its ability to regulate dopamine surges, significantly diminishing the psychological urge and pleasure associated with alcohol.",
      "Deep Hepatocyte (Liver Cell) Regeneration: Bhumi Amla and Kalmegh act as potent hepatoprotective agents that cleanse toxic acetaldehyde deposits, reverse alcohol-induced fatty liver, and normalize elevated liver enzymes.",
      "Calms Withdrawal Tremors & Agitation: Ashwagandha, Brahmi, and Shankhpushpi stabilize the hyper-excited central nervous system, stopping tremors, panic, and mood swings during the de-addiction phase.",
      "Can Be Given Discreetly: Formulated as a micro-pulverized natural herbal blend that can easily be mixed into curries, dal, dough, or milk without alerting the consumer, or taken openly with lukewarm water.",
      "100% Discreet & Confidential Delivery: Delivered in plain, sealed brown outer packaging with zero mention of 'alcohol' or 'addiction' on the exterior box to ensure complete privacy."
    ],

    whoShouldTake: "Individuals seeking to quit alcohol dependency safely, family members wanting to help a loved one overcome drinking habits without conflict, and those wanting to detox their liver from years of alcohol consumption.",

    keyIngredients: [
      {
        name: "Vidarikand (Kudzu Root)",
        source: "Pueraria tuberosa High Isoflavone Extract",
        amount: "Premier Anti-Craving Herb",
        benefit: "Blocks dopamine spikes that trigger alcohol urges and reduces the physical quantity of alcohol consumed."
      },
      {
        name: "Bhumi Amla (Phyllanthus niruri)",
        source: "Whole Herb Wild Extract",
        amount: "Potent Liver Regenerator",
        benefit: "Flushes toxic acetaldehyde, heals alcoholic fatty liver, and normalizes SGOT/SGPT levels."
      },
      {
        name: "Kalmegh (Andrographis paniculata)",
        source: "King of Bitters",
        amount: "Deep Toxin Cleanser",
        benefit: "Eliminates deep metabolic toxins (Ama) from blood and bile ducts, reviving natural appetite."
      },
      {
        name: "Ashwagandha & Shankhpushpi",
        source: "Medhya Rasayana Synergy",
        amount: "Nervine Calming Complex",
        benefit: "Calms withdrawal shakiness, eliminates nervous anxiety, and induces natural restful sleep."
      },
      {
        name: "Punarnava & Arjuna Bark",
        source: "Cardio-Renal Detoxifier",
        amount: "Whole Botanical Bark & Root",
        benefit: "Flushes accumulated water retention from alcohol and protects the heart muscle against cardiac strain."
      }
    ],

    dosage: "Take 1 sachet daily with lukewarm water, OR mix 1 sachet discreetly into daily meals (dal, vegetable curry, roti dough, tea, or milk). 1 sachet each day for 30 days (30 sachets total).",
    bestTime: "1 sachet daily, either morning with breakfast or evening with dinner.",
    course: "1 Month Supply protocol (30 sachets, 1 sachet each day). Complete 2 to 3 months course recommended for comprehensive de-addiction and liver cell rejuvenation.",

    whoShouldNotTake: "Pregnant women, nursing mothers, or individuals with end-stage decompensated liver failure unless monitored by an Ayurvedic Vaidya.",

    certifications: [
      "1 Month Complete Supply (30 Sachets)",
      "1 Sachet Each Day for 30 Days",
      "100% Classical Ayurvedic Formulation",
      "AYUSH Compliant Standard",
      "Heavy Metal Tested (Lead, Mercury, Arsenic Free)",
      "100% Plain Box Discreet Packaging Guarantee"
    ],

    image: "/images/products/daaru-mukti-powder.png",
    colorScheme: "bronze"
  },
  {
    id: "vitamin-b12-d3-k2-calcium",
    name: "Vitamin B12 + D3 + K2 + Calcium (4 in 1)",
    sanskritName: "अस्थि एवं मज्जा पोषक योग",
    subName: "Plant Based Premium Nutraceutical by Deepali Ayurveda",
    category: "Herbal Formulations",
    price: 599,
    originalPrice: 899,
    rating: 4.92,
    reviewCount: 428,
    inStock: true,
    tag: "Essential Daily (4-in-1)",
    badgeColor: "bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]",
    volume: "60 Veg Capsules (1000mg)",
    serving: "1 Bottle = 60 Capsules",
    shelfLife: "24 Months",
    scientificFact: "70%–90% of Indians suffer from Vitamin D3 deficiency, and nearly 1 out of 2 are B12 deficient. Without K2, calcium deposits into arteries instead of bones.",
    shortDescription: "Complete synergy of 4 essential nutrients derived from 16+ whole plant foods. Restores nerve myelin, reverses fatigue, and directs calcium straight into bones.",
    heroBenefit: "Reverses chronic fatigue, brain fog, tingling nerve numbness, and fortifies bone density naturally.",

    symptoms: [
      "Brain fog, poor memory & lack of daily concentration",
      "Tingling sensations, numbness in hands & feet (Nerve weakness)",
      "Extreme morning weakness, low stamina & afternoon muscle fatigue",
      "Bone pain, joint stiffness, weak dental enamel & fracture risk",
      "Megaloblastic anemia signs: pale skin, shortness of breath, dizziness & fast heartbeat",
      "Mood swings, anxiety, low motivation & disrupted sleep",
      "Weak immune defense & hair fall / brittle nails"
    ],

    whyYouNeedIt: [
      "All 4 Nutrients Are Synergistically Connected: Taking calcium alone causes arterial plaque or kidney stones. Vitamin D3 absorbs calcium from the gut, while Vitamin K2 (Menaquinone-7) activates osteocalcin to drive calcium strictly into bones and teeth.",
      "Rebuilds Nerve Insulation (Myelin): Plant-derived Vitamin B12 directly repairs nerve sheath damage, preventing neuropathy and restoring sharp mental reflexes.",
      "100% Plant-Based: Whole-food formula metabolized smoothly without stomach distress.",
      "Activates Happiness Hormones: B12 and D3 nourish neurotransmitter production for emotional balance and deep sleep."
    ],

    whoShouldTake: "Vegetarians and vegans (high risk B12 deficiency), professionals with indoor desk jobs (lack of sunlight for D3), individuals experiencing limb numbness, and anyone experiencing unexplained daily exhaustion.",

    keyIngredients: [
      {
        name: "Plant Vitamin B12 (Cobalamin)",
        source: "Spirulina, Chlorella & Wheatgrass",
        amount: "2.2 mcg (100% RDA)",
        benefit: "Vital for DNA synthesis, red blood cell production, and insulating nerve myelin fibers."
      },
      {
        name: "Plant Vitamin D3 (Cholecalciferol)",
        source: "Wild Harvested Lichen & Shiitake",
        amount: "600 IU (100% RDA)",
        benefit: "Stimulates intestinal calcium absorption and modulates immune cytokine response."
      },
      {
        name: "Natural Vitamin K2 (MK-7)",
        source: "Fermented Chickpea & Spinach Extract",
        amount: "55 mcg (100% RDA)",
        benefit: "The arterial traffic controller: activates Matrix Gla-Protein to stop calcium from hardening in blood vessels."
      },
      {
        name: "Plant Bio-Calcium",
        source: "Alfalfa, Mustard Greens & Okra",
        amount: "250 mg (25% RDA - perfect companion)",
        benefit: "Rebuilds skeletal bone matrix and facilitates smooth neuromuscular contractions."
      },
      {
        name: "Botanical Co-Factors",
        source: "Beetroot, Pumpkin, Tulsi, Cumin & Celery Leaves",
        amount: "Full Botanical Spectrum",
        benefit: "Provides natural enzymes, flavonoids, and organic trace minerals for optimal cellular uptake."
      }
    ],

    dosage: "1 capsule in the morning & 1 capsule in the evening.",
    bestTime: "Before meal (if mild acidity occurs, take 1 hour after meal).",
    course: "Recommended 3 months course for comprehensive cell saturation.",

    certifications: [
      "100% Plant-Based Nutraceutical",
      "FSSAI & AYUSH Standard Tested",
      "Heavy Metal Tested for Purity",
      "Pure Veg Capsules"
    ],

    image: "/images/products/vitamin-b12.png",
    colorScheme: "bronze"
  },
  {
    id: "sea-buckthorn-extract-capsules",
    name: "Sea Buckthorn Pure Berry Extract",
    sanskritName: "हिमालयन संजीवनी फल रस",
    subName: "The Golden Super Berry for Complete Cellular Vitality",
    category: "Herbal Formulations",
    price: 599,
    originalPrice: 899,
    rating: 4.95,
    reviewCount: 380,
    inStock: true,
    tag: "Super Antioxidant (ORAC 1,24,000)",
    badgeColor: "bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]",
    volume: "60 Veg Capsules (1000mg)",
    serving: "1 Bottle = 60 Capsules (1000mg)",
    shelfLife: "24 Months",
    scientificFact: "Survives extreme climates and is packed with 190+ bioactives, high Vitamin C concentration, and all 4 Omegas (3, 6, 7 & 9).",
    shortDescription: "Ultra-potent golden berry extract containing rare Omega 7. Neutralizes free radicals, restores radiant skin hydration, supports heart health & eye moisture.",
    heroBenefit: "Combats oxidative stress, promotes youthful skin glow, and deeply hydrates dry eyes & mucous membranes.",

    symptoms: [
      "Dry, dull skin & loss of tissue hydration",
      "Chronic dry eyes, dry mouth, and poor mucosal tissue hydration",
      "Low energy, sluggish recovery & fatigue from free-radical cellular damage",
      "Weak seasonal immunity & frequent exhaustion",
      "Cardiovascular inflammation and unbalanced lipid profile",
      "Joint stiffness and systemic inflammatory discomfort"
    ],

    whyYouNeedIt: [
      "Unmatched Antioxidant Defense (ORAC 1,24,000): Donates electrons to stabilize destructive free radicals before they damage cellular integrity.",
      "The Rare 'Beauty Omega' (Omega 7 - Palmitoleic Acid): One of the rare plant sources containing Omega 3, 6, 7, and 9 together to deeply hydrate membranes.",
      "Whole Food Botanical Synergy: Contains 14+ vitamins, 20+ trace minerals, and organic bioflavonoids for maximum absorption."
    ],

    whoShouldTake: "Individuals exposed to urban pollution, people experiencing dull skin, dry eyes, or fine lines, anyone with high oxidative stress, and those seeking cellular longevity.",

    keyIngredients: [
      {
        name: "Pure Himalayan Sea Buckthorn Extract",
        source: "Hippophae rhamnoides Whole Berry",
        amount: "1000 mg Concentrated Extract",
        benefit: "Provides 14+ vitamins, 20+ trace minerals, 18 amino acids, and high-potency bioflavonoids."
      },
      {
        name: "Complete Omega Complex (3, 6, 7, 9)",
        source: "Wild Berry Seed & Pulp Oil",
        amount: "Natural Spectrum",
        benefit: "Omega 3 protects heart & brain, Omega 6 repairs skin barrier, Omega 7 hydrates deep mucosal tissues, Omega 9 supports lipid health."
      },
      {
        name: "Natural Vitamin C & Carotenoids",
        source: "Wild Golden Berries",
        amount: "High Natural Potency",
        benefit: "Stimulates natural collagen synthesis and protects against free-radical damage."
      }
    ],

    dosage: "1 capsule in the morning & 1 capsule in the evening before meals.",
    bestTime: "Before breakfast and dinner with water.",
    course: "Recommended 3 months course for deep cellular regeneration.",

    certifications: [
      "100% Edible Botanical Nutrients",
      "Free of Chemical Solvents & Hexane",
      "AYUSH & FSSAI Compliant Standards"
    ],

    image: "/images/products/sea-buckthorn.png",
    colorScheme: "bronze"
  },
  {
    id: "apple-cider-vinegar-moringa",
    name: "Apple Cider Vinegar with Moringa",
    sanskritName: "शिग्रु-सेब रस योग",
    subName: "Effervescent Fat-Burn & Metabolism Tablets by Deepali Ayurveda",
    category: "Digestive Wellness",
    price: 293,
    originalPrice: 449,
    rating: 4.87,
    reviewCount: 340,
    inStock: true,
    tag: "Weight & Metabolism",
    badgeColor: "bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]",
    volume: "15 Effervescent Tablets",
    serving: "1 Tube = 15 Fizzy Tablets",
    shelfLife: "18 Months",
    scientificFact: "Combines the acetic acid of raw fermented ACV with the nutrient density of Moringa (rich in Vit A, C, E, iron, and chlorogenic acid) in a crisp Green Apple drink.",
    shortDescription: "Fast-acting effervescent drink that controls unprompted food cravings, fires up metabolic fat burning, stabilizes post-meal blood sugar, and detoxifies gut tissues.",
    heroBenefit: "Suppresses stubborn hunger cravings, jumpstarts your metabolic rate, and reduces visceral abdominal bloat.",

    symptoms: [
      "Frequent food cravings, snacking urge & overeating",
      "Sluggish metabolism and difficulty shedding stubborn abdominal weight",
      "Post-meal blood sugar spikes & afternoon energy crashes",
      "Digestive sluggishness, gut toxin accumulation & bloating",
      "Low daily vitality and dull skin tone caused by metabolic toxins"
    ],

    whyYouNeedIt: [
      "Acetic Acid Satiety Control: Delays gastric emptying time, helping you feel satisfied faster so you naturally consume fewer unnecessary calories.",
      "Moringa Superfood Defense: Known as the 'Miracle Tree', Moringa provides high-potency polyphenols that combat diet-induced systemic inflammation.",
      "Tooth-Enamel Safe Effervescent Format: Eliminates raw acidic burn, creating a delicious and refreshing green apple morning drink."
    ],

    whoShouldTake: "Anyone on a weight loss or fitness journey, individuals struggling with late-night snacking, people with slow metabolic digestion, and those managing blood sugar health.",

    keyIngredients: [
      {
        name: "Pure Apple Cider Vinegar",
        source: "Natural Fermented Himalayan Apples",
        amount: "5% Standardized Acetic Acid",
        benefit: "Accelerates metabolic fat oxidation, supports liver detoxification, and curbs excessive appetite."
      },
      {
        name: "Organic Moringa Leaf Extract",
        source: "Moringa oleifera (Miracle Tree)",
        amount: "High-Potency Green Extract",
        benefit: "Packed with 46 antioxidants, 36 anti-inflammatories, and vitamins A, C, and E for vitality."
      },
      {
        name: "Green Apple Natural Essence",
        source: "Botanical Fruit Flavors",
        amount: "Fizzy Effervescent Matrix",
        benefit: "Guarantees refreshing taste with zero added refined sugars."
      }
    ],

    dosage: "Drop 1 tablet into a glass of cool or room-temperature water (approx. 200ml). Allow it to fizz completely and drink.",
    bestTime: "1 hour before your morning breakfast or evening meal.",
    course: "Recommended 2 to 3 tubes combined with balanced nutrition.",

    certifications: [
      "100% Sugar-Free & Keto Friendly",
      "Zero Tooth Enamel Corrosion",
      "Non-GMO & Vegan Formulation"
    ],

    image: "/images/products/apple-cider-vinegar.png",
    colorScheme: "bronze"
  },
  {
    id: "digest-guru-churan",
    name: "Digest Guru Churan",
    sanskritName: "दीपक-पाचक महाचूर्ण",
    subName: "जहाँ पेट साफ, वहाँ दिन लाजवाब",
    category: "Digestive Wellness",
    price: 199,
    originalPrice: 299,
    rating: 4.88,
    reviewCount: 562,
    inStock: true,
    tag: "Gut Health Essential",
    badgeColor: "bg-[#F5EFE5] text-[#35251F] border-[#D8C3A5]",
    volume: "100g Resealable Pouch",
    serving: "100g Pouch (~20 Servings)",
    shelfLife: "24 Months",
    scientificFact: "Your gut is your 'Second Brain' connected directly through the Vagus Nerve. Over 90% of your body's Serotonin is produced in a balanced gut microbiome.",
    shortDescription: "14 powerful digestive plants formulated to clear chronic constipation, bloating, and gas while healing the gut microbiome and soothing the stomach lining.",
    heroBenefit: "Light, comfortable stomach from Day 1. Restores natural morning bowel movements and eliminates stubborn gas & acidity.",

    symptoms: [
      "Stubborn constipation, irregular or painful morning bowel movements",
      "Heavy stomach, post-meal bloating & excessive gas formation",
      "Frequent acidity, heartburn & sour reflux",
      "Brain fog, afternoon fatigue & irritability linked to gut toxicity",
      "Gut microbiome dysbiosis caused by junk food, stress & irregular hours",
      "Sluggish metabolism and heaviness in the abdomen"
    ],

    whyYouNeedIt: [
      "The Gut-Brain Superhighway (Vagus Nerve): Poor digestion inflames the gut-brain axis, causing mood dips, anxiety, and fatigue. Digest Guru promotes healthy peristalsis.",
      "Protects Mucosal Epithelial Integrity: Soothing classical herbs cool excessive internal heat (Pitta) and protect delicate intestinal walls.",
      "14 Non-Habit Forming Plants: Unlike harsh chemical purgatives, this formula supports natural digestive enzymes and regular evacuation."
    ],

    whoShouldTake: "Individuals with desk jobs, frequent travel or irregular meal schedules, chronic constipation and acidity sufferers, and anyone feeling weighed down after eating.",

    keyIngredients: [
      {
        name: "Fennel Seed (Saunf)",
        source: "Pure Botanical Extract",
        amount: "850 mg",
        benefit: "Rapidly relaxes intestinal spasms, disperses gas, and cools digestive heat."
      },
      {
        name: "Senna Leaves (Sanay)",
        source: "Standardized Herb",
        amount: "750 mg",
        benefit: "Gentle natural bowel stimulant for predictable, effortless morning relief."
      },
      {
        name: "Triphala Trio (Amla, Harde, Baheda)",
        source: "Classical Myrobalan Ratio",
        amount: "Ancient Synergy",
        benefit: "Harde supports bowel movement, Baheda cleanses gut mucosa, and Amla provides deep antioxidant healing."
      },
      {
        name: "Cooling Digestive Matrix",
        source: "Bottle Gourd (Lauki), Mint Leaves & Cucumber",
        amount: "Synergistic Herbs",
        benefit: "Subdues acid reflux and provides a refreshing, cooling effect on inflamed stomach lining."
      },
      {
        name: "Metabolic Catalysts",
        source: "Ginger Extract, Radish Extract, Black Pepper & Jimikand",
        amount: "Active Extracts",
        benefit: "Fires up sluggish digestive enzymes, improves liver bile secretion, and maximizes fiber absorption."
      }
    ],

    dosage: "Take 5g (approx. 1 level spoon) with lukewarm water before bedtime.",
    bestTime: "At bedtime with warm water.",
    course: "Take continuously for 10 days to reset digestive rhythm. Thereafter, take as needed.",

    certifications: [
      "14 Powerful Botanical Herbs",
      "FSSAI & AYUSH Standards",
      "Non-Habit Forming Gentle Formulation",
      "Free of Sugar & Harmful Binders"
    ],

    image: "/images/products/digest-guru-churan.png",
    colorScheme: "bronze"
  }
];

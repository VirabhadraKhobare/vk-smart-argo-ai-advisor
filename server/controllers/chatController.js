/**
 * AI Chat Assistant Controller
 * Integrates with OpenAI for intelligent farming responses
 * Falls back to local knowledge base if OpenAI is unavailable
 */
const ChatMessage = require('../models/ChatMessage');

// Check if OpenAI is configured and try to load package safely
let useOpenAI = !!process.env.OPENAI_API_KEY;
let openai;

if (useOpenAI) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    console.warn('OpenAI client not available; falling back to local knowledge base.');
    useOpenAI = false;
  }
}

// AI Knowledge Base for farming queries (Enhanced)
const farmingKnowledgeBase = {
  greetings: [
    "🌾 Namaste! I'm your Smart Agro AI Assistant. How can I help you improve your farming today?",
    "Hello Farmer! Ready to help you with crop management, soil health, or any farming advice. What's on your mind?",
    "Welcome! I'm here to assist with sustainable farming practices. What farming challenges are you facing?",
    "Greetings! I can help with crops, soil, weather, pests, schemes, and market prices. What do you need?"
  ],

  soil: {
    keywords: ['soil', 'fertilizer', 'nutrient', 'nitrogen', 'phosphorus', 'potassium', 'ph', 'organic', 'compost', 'manure'],
    responses: [
      "🌱 **Soil Health Tips:**\n\n• Maintain NPK balance - Test soil every 2-3 years\n• Apply 5-10 tons/ha of compost or farmyard manure annually\n• Soil pH should be 6.5-7.5 for most crops\n• If acidic (pH < 6.5), add lime; if alkaline (pH > 8), add gypsum\n• Use green manure crops (dhaincha, sunhemp) to improve soil structure\n• Avoid continuous monoculture - practice crop rotation\n\nConsult your local KVK for soil testing services.",
      
      "💪 **Organic Matter Importance:**\n\n• Increases water-holding capacity\n• Improves soil structure and aeration\n• Enhances microbial activity\n• Reduces fertilizer requirements\n• Sustainable and cost-effective\n\nAdd 2-3 inches of compost and work it into top 6 inches of soil.",
      
      "🧪 **Nutrient Management:**\n\n• Nitrogen (N): Promotes leaf growth - apply at crop growth stage\n• Phosphorus (P): Strengthens roots and flowers - apply at planting\n• Potassium (K): Improves disease resistance - apply throughout season\n\nBalanced fertilizer ratio: NPK 10:26:26 for vegetables, 19:19:19 for cereals"
    ]
  },

  irrigation: {
    keywords: ['water', 'irrigate', 'drip', 'sprinkler', 'moisture', 'rain', 'flooding', 'drought'],
    responses: [
      "💧 **Smart Irrigation Practices:**\n\n• **Drip Irrigation**: Saves 30-50% water vs. flood irrigation\n  - Ideal for vegetables, orchards, and flowers\n  - Cost: ₹50,000-70,000/hectare (subsidy available)\n\n• **Sprinkler System**: Covers 70-80% of field uniformly\n  - Good for wheat, maize, pulses\n  - Cost: ₹40,000-60,000/hectare\n\n• **Best Time**: Early morning (5-7 AM)\n• **Frequency**: When moisture drops below 50% field capacity\n• **Avoid**: Evening irrigation (increases fungal diseases)",

      "🌊 **Water Management Tips:**\n\n• Check soil moisture at 15-30 cm depth\n• Use mulch (straw/leaves) to retain moisture\n• During dry season: Increase irrigation frequency\n• During monsoon: Ensure proper drainage\n• Rainwater harvesting can reduce irrigation needs by 20-30%",
      
      "⚠️ **Drought & Flood Management:**\n\n• **During Drought**: Reduce irrigation interval, apply mulch, use organic matter\n• **Before Monsoon**: Clean channels, repair bunds\n• **During Floods**: Ensure drainage, protect with flood-resistant varieties\n• **Post-flood**: Apply lime to reduce acidity from stagnant water"
    ]
  },

  pests: {
    keywords: ['pest', 'disease', 'insect', 'fungus', 'aphid', 'worm', 'blight', 'mildew', 'rot'],
    responses: [
      "🚫 **Integrated Pest Management (IPM):**\n\n1. **Prevention First**:\n   • Use resistant crop varieties\n   • Maintain proper spacing (reduces disease spread)\n   • Rotate crops yearly\n   • Remove infected plant parts immediately\n\n2. **Organic Solutions** (Cost-effective & eco-friendly):\n   • **Neem Oil**: 5% spray for most pests\n   • **Turmeric-Garlic Solution**: Mix 10g turmeric + 50g garlic in 1L water\n   • **Cow Urine**: 10% solution for fungal diseases\n   • **Soap Water**: 2% for soft-bodied insects\n\n3. **Biological Control**:\n   • Yellow sticky traps for flying insects (5-10/acre)\n   • Ladybugs for aphids\n   • Bt spray for caterpillars",

      "🐛 **Common Pests & Solutions:**\n\n• **Aphids**: Spray neem oil weekly, encourage ladybugs\n• **Whiteflies**: Yellow sticky traps + neem spray\n• **Leaf Hoppers**: Reflective mulch + insecticidal soap\n• **Army Worms**: Bt spray (Bacillus thuringiensis)\n• **Termites**: Apply lime + water mixture in soil before sowing\n\n**Prevention**: Avoid planting same crop in same field < 3 years",

      "🍂 **Disease Management:**\n\n• **Powdery Mildew**: Sulfur powder dust every 10 days\n• **Leaf Blight**: Copper fungicide + proper spacing\n• **Root Rot**: Improve drainage, use trichoderma\n• **Early Blight (Potato/Tomato)**: Remove lower leaves, spray mancozeb\n\n**Always**: Monitor crops daily, spray in early morning/evening"
    ]
  },

  crops: {
    keywords: ['crop', 'plant', 'sow', 'harvest', 'yield', 'seed', 'variety', 'season', 'timing'],
    responses: [
      "🌾 **Crop Selection Guide:**\n\n• Choose varieties suited to your **climate zone**\n• Check with local agricultural university for recommendations\n• Consider **market demand** and profit margins\n• Verify **water availability** and soil type suitability\n\n**Crop Planning**:\n• Kharif (Monsoon): June-July sowing - Rice, Maize, Cotton, Pulses\n• Rabi (Winter): September-October sowing - Wheat, Gram, Mustard\n• Summer: April-May - Vegetables, Fodder crops",

      "📏 **Proper Plant Spacing:**\n\n• Overcrowding causes:\n  - Reduced yield (15-20% loss)\n  - Increased disease risk\n  - Poor air circulation\n\n• **Recommended spacing**:\n  - Rice: 20×20 cm\n  - Wheat: 20 cm rows, 2-3 seeds/foot\n  - Maize: 60×20 cm\n  - Vegetables: 30-60 cm (varies by type)",

      "⏰ **Timely Harvest:**\n\n• **Harvest at right maturity** to get:\n  - Better quality\n  - Higher prices (15-20% premium)\n  - Easier storage\n\n• **Signs of Maturity**:\n  - Rice: Panicles bend, grains hardened\n  - Wheat: Golden color, grain breaks between teeth\n  - Maize: Kernels firm, cob yellowing\n  - Vegetables: Pick at tender stage (except storage crops)"
    ]
  },

  weather: {
    keywords: ['weather', 'climate', 'temperature', 'rainfall', 'monsoon', 'frost', 'heat wave'],
    responses: [
      "☀️ **Weather-Based Farming:**\n\n• **Before Spraying**: Check 7-day forecast\n  - Avoid spray before expected rain (washes off chemicals)\n  - Optimal: No rain for 6 hours post-spray\n  - Best time: Early morning when dew present\n\n• **Fertilizer Application**:\n  - Apply before rain if possible (gets absorbed)\n  - Avoid during high winds (spray drift)\n  - Temperature: 15-25°C is optimal",

      "🔥 **Heat Wave Management** (>40°C):\n\n• Increase irrigation frequency (every 3-4 days)\n• Apply mulch (4-6 inches) to retain moisture\n• Use shade cloth for sensitive crops (30-50% shading)\n• Spray water early morning to reduce heat stress\n• Avoid transplanting during peak heat\n• Choose heat-tolerant varieties",

      "❄️ **Frost Protection** (Winter <5°C):\n\n• Smoke / fire in field (raises temperature 2-3°C)\n• Water spray system for frost protection\n• Cover plants with straw mulch\n• Avoid late-season nitrogen (encourages tender growth)\n• Use frost-resistant varieties\n• Plant windbreaks to reduce cold air flow"
    ]
  },

  market: {
    keywords: ['market', 'price', 'sell', 'buy', 'mandi', 'profit', 'income', 'selling'],
    responses: [
      "💰 **Market Price Strategies:**\n\n• **Check Prices Daily**: Use eNAM (e-National Agriculture Market)\n  - Covers 1000+ mandis across India\n  - Real-time prices and trends\n  - Compare prices before selling\n\n• **Better Pricing Options**:\n  - Direct marketing: Get 10-15% more\n  - Contract farming: Guaranteed price + quality standards\n  - Value addition: Processing increases value 30-40%\n  - Organic certification: Commands 20-30% premium",

      "📦 **Post-Harvest Value Addition:**\n\n• **Simple Processing** (increases value 15-20%):\n  - Proper cleaning and grading\n  - Packaging in attractive containers\n  - Standardized weights/measures\n  - Moisture control (proper storage)\n\n• **Advanced Processing**:\n  - Pulses → Flour, dal\n  - Vegetables → Pickles, dried products\n  - Spices → Grinding, packaging\n  - Fruits → Jams, dried products",

      "📋 **Selling Smart:**\n\n• **Before Harvest**: Understand market demand\n• **Quality First**: Grade properly - better prices for A-grade\n• **Storage**: Store in cool, dry place to maintain quality\n• **Direct Links**: Connect with wholesalers, restaurants, retailers\n• **Cooperative**: Join agricultural cooperatives for better prices\n• **Timing**: Avoid rush season sales (prices lowest)"
    ]
  },

  government: {
    keywords: ['scheme', 'subsidy', 'pm-kisan', 'insurance', 'loan', 'government', 'credit', 'benefit'],
    responses: [
      "🏛️ **Major Government Schemes:**\n\n**1. PM-KISAN** (Prime Minister Kisan Samman Nidhi)\n• ₹6,000/year in 3 installments\n• Eligibility: All farmers with cultivated land\n• Registration: pmkisan.gov.in\n• Documents: Aadhaar, land records, bank account",

      "📋 **Essential Government Benefits:**\n\n**2. PMFBY** (Pradhan Mantri Fasal Bima Yojana)\n• Crop insurance against natural calamities\n• Premium: 2% (Kharif), 1.5% (Rabi), 5% (Summer)\n• Claim for yield loss >33%\n• Registration: Local bank or insurance office\n\n**3. Kisan Credit Card (KCC)**\n• Loan up to ₹3 lakh at 4% interest\n• With prompt repayment bonus\n• For cultivators with good credit\n• Apply at your bank",

      "💳 **Other Important Schemes:**\n\n• **PM-ABY** (Atal Bimit Vyakti Bima Yojana): Personal accident insurance\n• **APY** (Atal Pension Yojana): Guaranteed pension for farmers\n• **Soil Health Card**: Free soil testing\n• **Rashtriya Kisaan Samridhi Yojana**: State-specific benefits\n\n**For Registration**: Contact local agricultural office, Gram Panchayat, or bank"
    ]
  }
};

const generateAIResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  // Check for greetings
  if (lowerMsg.match(/^(hi|hello|hey|namaste|greetings|hiya)/)) {
    return farmingKnowledgeBase.greetings[
      Math.floor(Math.random() * farmingKnowledgeBase.greetings.length)
    ];
  }

  // Check knowledge base categories
  for (const [category, data] of Object.entries(farmingKnowledgeBase)) {
    if (category === 'greetings') continue;

    const matched = data.keywords.some(keyword => lowerMsg.includes(keyword));
    if (matched) {
      return data.responses[Math.floor(Math.random() * data.responses.length)];
    }
  }

  // Default responses when no specific category matches
  const defaults = [
    "🤔 **That's an interesting question!** To give you more specific advice, could you provide a few details:\n\n• What crop are you growing?\n• What's your soil type (loamy, clay, sandy)?\n• What's your district/state?\n• What's your current challenge?\n\nThis will help me give you targeted recommendations!",
    
    "📋 **Good question!** For precision agriculture advice, please share:\n\n• **Crop Type**: Rice, wheat, vegetables, etc.\n• **Current Stage**: Seedling, flowering, harvesting?\n• **Location**: Your district or state\n• **Specific Issue**: Pest, disease, yield concern?\n\nI'll provide customized solutions!",
    
    "💡 **For better recommendations**, could you tell me:\n\n1. **Your Farm Details**: Crop type, soil type, irrigation type\n2. **Current Problem**: What specific challenge are you facing?\n3. **Your Location**: State/district for location-specific advice\n4. **Farm Size**: This helps scale recommendations\n\nI can then give you expert-level solutions!",

    "🌾 **Let me help you better!** Please provide:\n\n• What farming activity are you interested in?\n• Your location and climate zone\n• The main challenge you're facing\n• Any specific crop you're growing\n\nBased on this, I can share proven farming practices and local solutions that work best for your region.",

    "📱 **I'm here to help!** Share more details:\n\n• **Crop**: What are you growing?\n• **Problem**: What's your concern?\n• **Location**: Your state/district?\n• **Resources**: Available irrigation, budget?\n\nWith these details, I can give you actionable farming advice!"
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
};


exports.sendMessage = async (req, res, next) => {
  try {
    const { content, sessionId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    // Save user message
    await ChatMessage.create({
      user: req.user.id,
      sessionId,
      role: 'user',
      content
    });

    let aiResponse;
    let modelUsed = 'AgroAI-Local';
    let processingTime = 0;

    try {
      if (useOpenAI) {
        // Use OpenAI API
        const startTime = Date.now();
        
        const systemPrompt = `You are an expert agricultural advisor for Indian farmers. Provide practical, actionable advice based on modern farming practices, traditional knowledge, and government schemes. 
Be concise but comprehensive. Include specific recommendations with quantities and timings when applicable.
Topics you can help with:
- Crop management and cultivation
- Soil health and fertility
- Pest and disease control
- Irrigation and water management
- Weather-based farming decisions
- Government agricultural schemes (PM-KISAN, PMFBY, KCC, etc.)
- Market prices and selling strategies
- Sustainable farming practices

Always be encouraging and respectful to the farmer's experience.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: content
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 0.9
        });

        aiResponse = completion.choices[0].message.content;
        modelUsed = 'GPT-3.5-Turbo';
        processingTime = (Date.now() - startTime) / 1000;
      } else {
        // Fallback to local knowledge base
        aiResponse = generateAIResponse(content);
        processingTime = 0.8 + Math.random() * 1.5;
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError.message);
      // Fallback to local knowledge base
      aiResponse = generateAIResponse(content);
      modelUsed = 'AgroAI-Local (OpenAI unavailable)';
      processingTime = 0.8 + Math.random() * 1.5;
    }

    // Save AI response
    const aiMessage = await ChatMessage.create({
      user: req.user.id,
      sessionId,
      role: 'assistant',
      content: aiResponse,
      metadata: {
        modelUsed: modelUsed,
        processingTime: processingTime,
        tokensUsed: Math.floor(aiResponse.length / 4),
        usingOpenAI: useOpenAI ? true : false
      }
    });

    res.status(201).json({
      success: true,
      data: {
        message: aiMessage,
        response: aiResponse,
        metadata: {
          model: modelUsed,
          processingTime: processingTime.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    next(error);
  }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.query;

    let query = { user: req.user.id };
    if (sessionId) query.sessionId = sessionId;

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) { next(error); }
};

exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatMessage.distinct('sessionId', { user: req.user.id });

    res.status(200).json({ success: true, data: sessions });
  } catch (error) { next(error); }
};

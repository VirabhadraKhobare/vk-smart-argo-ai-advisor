/**
 * Government Schemes Controller
 * Manages farming scheme information
 */
const GovernmentScheme = require('../models/GovernmentScheme');

// Seed data for government schemes
const seedSchemes = async () => {
  const count = await GovernmentScheme.countDocuments();
  if (count > 0) return;

  const schemes = [
    {
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      shortName: 'PM-KISAN',
      description: 'Direct income support of ₹6,000 per year to eligible farmer families, payable in three equal installments of ₹2,000 each.',
      category: 'subsidy',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'Small and marginal farmers with cultivable land. Aadhaar-linked bank account mandatory.',
      benefits: ['₹6,000/year direct cash transfer', '3 installments of ₹2,000 each', 'No middlemen - DBT to bank account'],
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Mobile Number'],
      applicationProcess: '1. Visit pmkisan.gov.in\n2. Click New Farmer Registration\n3. Enter Aadhaar and land details\n4. Add bank account information\n5. Submit and track status',
      status: 'active',
      websiteUrl: 'https://pmkisan.gov.in',
      contactInfo: { phone: '155261', email: 'pmkisan-ict@gov.in' },
      tags: ['income support', 'direct benefit', 'small farmers']
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      shortName: 'PMFBY',
      description: 'Comprehensive crop insurance scheme to protect farmers against crop loss due to natural calamities, pests, and diseases.',
      category: 'insurance',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'All farmers growing notified crops in notified areas. Both loanee and non-loanee farmers eligible.',
      benefits: ['Low premium rates (2% Kharif, 1.5% Rabi, 5% commercial)', 'Covers yield losses', 'Covers prevented sowing', 'Post-harvest losses covered'],
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Sowing Certificate'],
      applicationProcess: '1. Register through bank or CSC\n2. Pay applicable premium\n3. Crop cutting experiments for claim assessment\n4. Claim credited to bank account',
      status: 'active',
      websiteUrl: 'https://pmfby.gov.in',
      contactInfo: { phone: '1800-180-1551', email: 'pmfby@gov.in' },
      tags: ['crop insurance', 'risk protection', 'natural calamity']
    },
    {
      name: 'Kisan Credit Card (KCC) Scheme',
      shortName: 'KCC',
      description: 'Provides farmers with affordable credit for agricultural operations including crop production and allied activities.',
      category: 'loan',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'All farmers, joint cultivators, tenant farmers, and self-help groups.',
      benefits: ['Short-term credit up to ₹3 lakh', 'Interest subvention of 1.5%', 'Additional 3% incentive for prompt repayment', 'Covers animal husbandry and fisheries'],
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Passport Photo', 'Bank Account'],
      applicationProcess: '1. Visit nearest bank branch\n2. Fill KCC application form\n3. Submit required documents\n4. Card issued within 2 weeks',
      status: 'active',
      websiteUrl: 'https://www.nabard.org',
      contactInfo: { phone: '1800-11-5526' },
      tags: ['credit', 'loan', 'farm finance']
    },
    {
      name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
      shortName: 'PMKSY',
      description: 'Aims to improve farm productivity by ensuring water availability through micro-irrigation and water use efficiency.',
      category: 'subsidy',
      ministry: 'Ministry of Jal Shakti',
      eligibility: 'Farmers with cultivable land. Priority to small and marginal farmers.',
      benefits: ['Up to 60% subsidy on drip/sprinkler systems', 'Har Khet Ko Pani initiative', 'Per Drop More Crop component', 'AIBP for irrigation projects'],
      documentsRequired: ['Land Records', 'Aadhaar Card', 'Bank Account', 'Soil Test Report'],
      applicationProcess: '1. Contact district agriculture office\n2. Submit application with land documents\n3. Technical survey conducted\n4. Subsidy released after installation',
      status: 'active',
      websiteUrl: 'https://pmksy.gov.in',
      contactInfo: { phone: '011-23072982' },
      tags: ['irrigation', 'water', 'micro-irrigation', 'subsidy']
    },
    {
      name: 'Soil Health Card Scheme',
      shortName: 'SHC',
      description: 'Provides farmers with soil nutrient status and recommends appropriate fertilizers for better crop yield.',
      category: 'grant',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'All farmers. Soil samples collected from every field holding.',
      benefits: ['Free soil testing every 3 years', 'Customized fertilizer recommendations', 'Improved soil health', 'Reduced input costs'],
      documentsRequired: ['Land Records', 'Aadhaar Card', 'Mobile Number'],
      applicationProcess: '1. Register at soilhealth.dac.gov.in\n2. Soil sample collected by authorized agency\n3. Lab analysis of 12 parameters\n4. Card issued with recommendations',
      status: 'active',
      websiteUrl: 'https://soilhealth.dac.gov.in',
      contactInfo: { phone: '011-23384114' },
      tags: ['soil testing', 'fertilizer', 'soil health']
    },
    {
      name: 'Sub-Mission on Agricultural Mechanisation (SMAM)',
      shortName: 'SMAM',
      description: 'Promotes farm mechanization by providing subsidies on agricultural equipment and machinery.',
      category: 'subsidy',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'Individual farmers, cooperatives, FPOs, and custom hiring centers.',
      benefits: ['40-80% subsidy on farm machinery', 'Special benefits for SC/ST/Women farmers', 'Establishment of custom hiring centers', 'Training on equipment use'],
      documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Quotation from supplier'],
      applicationProcess: '1. Apply through state agriculture department\n2. Submit quotation and documents\n3. Approval and subsidy release\n4. Purchase and install equipment',
      status: 'active',
      websiteUrl: 'https://farmech.dac.gov.in',
      contactInfo: { phone: '011-23382489' },
      tags: ['machinery', 'equipment', 'mechanization', 'tractor']
    }
  ];

  await GovernmentScheme.insertMany(schemes);
  console.log('✅ Government schemes seeded');
};

exports.getSchemes = async (req, res, next) => {
  try {
    // Seed if empty
    await seedSchemes();

    const { category, search, status = 'active' } = req.query;

    let query = { isActive: true };
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const schemes = await GovernmentScheme.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: schemes.length, data: schemes });
  } catch (error) { next(error); }
};

exports.getScheme = async (req, res, next) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    res.status(200).json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

// Admin only
exports.createScheme = async (req, res, next) => {
  try {
    const scheme = await GovernmentScheme.create(req.body);
    res.status(201).json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

exports.updateScheme = async (req, res, next) => {
  try {
    let scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    scheme = await GovernmentScheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.status(200).json({ success: true, data: scheme });
  } catch (error) { next(error); }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    scheme.isActive = false;
    await scheme.save();

    res.status(200).json({ success: true, message: 'Scheme removed' });
  } catch (error) { next(error); }
};

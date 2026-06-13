const appConstants = {
  IS_LIVE: true,
  is_premium: true,
  inAppPurchase: {
    skus: ['com.monthly.bcn', 'com.year.bcn'],
  },
  features: [
    [
      {
        name: 'AI-Powered Scanning',
        value: 'Organises contacts by service/industry',
      },
      {
        name: 'Search Functionality',
        value: 'Filters by name, company, or tags',
      },
      { name: 'Card Scanning', value: 'Scan and store up to 30 cards' },
      { name: 'Cloud Storage', value: 'Include' },
      { name: 'Export to', value: 'CSV & PDF' },
      {
        name: 'Networking Features',
        value: 'Not included',
      },
      { name: 'Customer Support', value: 'Standard' },
    ],
    [
      {
        name: 'AI-Powered Scanning',
        value: 'Organises contacts by service/industry',
      },
      {
        name: 'Search Functionality',
        value: 'Filters by name, company, or tags',
      },
      { name: 'Card Scanning', value: 'Unlimited card scans and storage' },
      { name: 'Cloud Storage', value: 'Include' },
      { name: 'Export to', value: 'CSV & PDF' },
      {
        name: 'Networking Features',
        value:
          'Send up to 25 connection requests daily in-app collaboration tool',
      },
      { name: 'Customer Support', value: 'Priority email support' },
    ],
  ],
  plans: [
    {
      id: 2,
      plan_detail_id: 1,
      created_by: 1,
      plan_name: 'Monthly Plan',
      plan_desc: 'Monthly',
      plan_id: 'com.monthly.bcn',
      price: '3.99',
      plan_period: '1',
      status: 1,
      is_popular: 0,
      short_name: 'mo.',
      type: 'pro plan',
    },
    {
      id: 3,
      plan_detail_id: 1,
      created_by: 1,
      plan_name: 'Annual Plan',
      plan_desc: 'Standard Yearly desc',
      plan_id: 'com.year.bcn',
      price: '39.99',
      plan_period: '2',
      status: 1,
      is_popular: 1,
      short_name: 'yearly',
      type: 'pro plan',
    },
  ],
};

enum URL_TYPE {
  openFromQR = 'share-bcn',
}

export { appConstants, URL_TYPE };

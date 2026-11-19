const currentYear = new Date().getFullYear();

export const COMMON_FIELDS = [
  { key: 'title', label: 'Title / Item Name', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle / Tagline', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'price', label: 'Price (₹)', type: 'number', required: true },
  { key: 'priceType', label: 'Price Type', type: 'select', options: [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'negotiable', label: 'Negotiable' },
    { value: 'per-month', label: 'Per Month (Rent/Lease)' },
    { value: 'per-year', label: 'Per Year' },
    { value: 'on-request', label: 'Price on Request' },
  ]},
  { key: 'priceSuffix', label: 'Price Suffix', type: 'text', placeholder: 'e.g. / month, Cr, Lakh' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'district', label: 'District', type: 'text' },
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'area', label: 'Area / Locality', type: 'text' },
  { key: 'pincode', label: 'Pincode', type: 'text' },
  { key: 'mapUrl', label: 'Map URL (Google Maps)', type: 'text', placeholder: 'e.g. https://maps.app.goo.gl/...' },
  { key: 'contact', label: 'Contact Phone', type: 'text' },
];

export const SUBCATEGORIES = {
  properties: [
    'Residential',
    'Flat',
    'Independent House',
    'Plot',
    'Land',
    'Agricultural',
    'Commercial',
    'Industrial',
  ],
  vehicles: [
    'Car',
    'Bike',
    'Commercial Vehicle',
    'Auto Rickshaw',
    'Electric Vehicle',
  ],
  groceries: [
    'Fruits',
    'Vegetables',
    'Packaged Food',
    'Dairy & Eggs',
    'Beverages',
    'Snacks',
    'Spices & Condiments',
  ],
  garments: [
    "Men's Wear",
    "Women's Wear",
    "Kids' Wear",
    'Ethnic Wear',
    'Footwear',
    'Accessories',
  ],
  jewellery: [
    'Gold',
    'Silver',
    'Diamond',
    'Platinum',
    'Gemstones',
    'Artificial / Fashion',
  ],
  finance: [
    'Home Loan',
    'Vehicle Loan',
    'Personal Loan',
    'Business Loan',
    'Investment Plans',
    'Insurance',
  ],
  services: [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'AC Repair',
    'Painting',
    'Pest Control',
  ],
  service: [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'AC Repair',
    'Painting',
    'Pest Control',
  ],  bedding: [
    'Mattress',
    'Pillow',
    'Bedsheet & Linen',
    'Comforter & Blanket',
    'Protector & Cushion',
  ],
  electronics: [
    'Mobile & Tablet',
    'Laptop & Computer',
    'TV & Audio',
    'Home Appliances',
    'Smart Wearables',
  ],
};

export const PLOT_POSSESSION_OPTIONS = ["Ready for Registration", "Under Construction"];
export const STRUCTURAL_POSSESSION_OPTIONS = ["Ready to Occupy", "Under Construction", "Ready to Move In", "Resale"];

export const getPossessionOptionsBySubcategory = (subcategory = "") => {
  const s = String(subcategory || "").toLowerCase();
  const isPlot = s.includes("plot") || s.includes("land") || s.includes("agricultural") || s.includes("farm");
  return isPlot ? PLOT_POSSESSION_OPTIONS : STRUCTURAL_POSSESSION_OPTIONS;
};

export const POSSESSION_STATUS_OPTIONS = [
  "Ready to Move In",
  "Under Construction",
  "Ready to Occupy",
  "Ready for Registration",
  "Resale",
];

export const CATEGORY_SPECIFIC_FIELDS = {
  properties: [
    { key: 'bhk', label: 'BHK', type: 'text', placeholder: 'e.g. 2, 3 & 4 BHK or EOI' },
    { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
    { key: 'area_sqft', label: 'Area / Size', type: 'text', placeholder: 'e.g. 1348 - 2016 Sq.ft or 4+4 Acres' },
    { key: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 20th of 20 Floors' },
    { key: 'floors', label: 'Floors / Blocks', type: 'text', placeholder: 'e.g. B+G+11 Floors · 3 Towers · 6 Blocks' },
    { key: 'towers', label: 'Towers', type: 'text', placeholder: 'e.g. 3 Towers' },
    { key: 'approval', label: 'Approval Authority', type: 'text', placeholder: 'e.g. BDA, BBMP, BMRDA, RERA, EOI' },
    { key: 'possessionStatus', label: 'Possession Status', type: 'select', options: PLOT_POSSESSION_OPTIONS },
    { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g. 2 Covered + 2 Open' },
    { key: 'extraRoom', label: 'Extra Room', type: 'text', placeholder: 'e.g. Pooja Room, Study' },
    { key: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
    { key: 'totalUnits', label: 'Total Units', type: 'text', placeholder: 'e.g. 200 Units' },
    { key: 'availableUnits', label: 'Available Units', type: 'number', placeholder: 'e.g. 5' },
    { key: 'mapUrl', label: 'Add Map URL (Google Maps)', type: 'text', placeholder: 'e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...' },
  ],
  'real-estate': [
    { key: 'bhk', label: 'BHK', type: 'text', placeholder: 'e.g. 2, 3 & 4 BHK or EOI' },
    { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
    { key: 'area_sqft', label: 'Area / Size', type: 'text', placeholder: 'e.g. 1348 - 2016 Sq.ft or 4+4 Acres' },
    { key: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 20th of 20 Floors' },
    { key: 'floors', label: 'Floors / Blocks', type: 'text', placeholder: 'e.g. B+G+11 Floors · 3 Towers · 6 Blocks' },
    { key: 'towers', label: 'Towers', type: 'text', placeholder: 'e.g. 3 Towers' },
    { key: 'approval', label: 'Approval Authority', type: 'text', placeholder: 'e.g. BDA, BBMP, BMRDA, RERA, EOI' },
    { key: 'possessionStatus', label: 'Possession Status', type: 'select', options: STRUCTURAL_POSSESSION_OPTIONS },
    { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
    { key: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g. 2 Covered + 2 Open' },
    { key: 'extraRoom', label: 'Extra Room', type: 'text', placeholder: 'e.g. Pooja Room, Study' },
    { key: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
    { key: 'totalUnits', label: 'Total Units', type: 'text', placeholder: 'e.g. 200 Units' },
    { key: 'availableUnits', label: 'Available Units', type: 'number', placeholder: 'e.g. 5' },
    { key: 'mapUrl', label: 'Add Map URL (Google Maps)', type: 'text', placeholder: 'e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...' },
  ],
  vehicles: [
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Toyota, Honda' },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Civic, Corolla' },
    { key: 'year', label: 'Year', type: 'select', options: Array.from({ length: 30 }, (_, i) => String(currentYear - i)) },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
    { key: 'categoryVehicle', label: 'Vehicle Category', type: 'select', options: ['2-Wheeler', '3-Wheeler', '4-Wheeler', 'Commercial'] },
    { key: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] },
    { key: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT'] },
    { key: 'kmDriven', label: 'KM Driven', type: 'number', placeholder: 'e.g. 15000' },
  ],
  groceries: [
    { key: 'quantity', label: 'Quantity / Stock', type: 'number', placeholder: 'e.g. 100' },
    { key: 'unit', label: 'Unit', type: 'select', options: ['Kg', 'Liter', 'Piece', 'Pack', 'Dozen', 'Box'] },
  ],
  garments: [
    { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom'] },
    { key: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Red, Blue, Green' },
  ],
  jewellery: [
    { key: 'material', label: 'Material / Metal Type', type: 'text', placeholder: 'e.g. Gold, Silver, Platinum' },
    { key: 'purity', label: 'Purity', type: 'text', placeholder: 'e.g. 22K, 18K, 925' },
    { key: 'weight', label: 'Weight (grams)', type: 'number', placeholder: 'e.g. 10.5' },
    { key: 'gemstone', label: 'Gemstone', type: 'text', placeholder: 'e.g. Diamond, Emerald, Ruby' },
  ],
  finance: [
    { key: 'serviceType', label: 'Service Type', type: 'select', options: ['Home Loan', 'Vehicle Loan', 'Personal Loan', 'Business Loan', 'Investment Plans', 'Insurance'] },
    { key: 'companyName', label: 'Company / Provider Name', type: 'text', placeholder: 'e.g. HDFC Bank, SBI' },
    { key: 'interestRate', label: 'Interest Rate', type: 'text', placeholder: 'e.g. 8.5%' },
    { key: 'minAmount', label: 'Min Amount', type: 'text', placeholder: 'e.g. 50000' },
    { key: 'maxAmount', label: 'Max Amount', type: 'text', placeholder: 'e.g. 5000000' },
    { key: 'tenure', label: 'Tenure', type: 'text', placeholder: 'e.g. 1 – 5 years' },
    { key: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 5' },
    { key: 'processingTime', label: 'Processing Time', type: 'text', placeholder: 'e.g. 24-48 Hours' },
  ],
  services: [
    { key: 'serviceType', label: 'Service Type', type: 'text', placeholder: 'e.g. Plumbing, Electrical, AC Repair' },
    { key: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 3' },
  ],
  service: [
    { key: 'serviceType', label: 'Service Type', type: 'text', placeholder: 'e.g. Plumbing, Electrical, AC Repair' },
    { key: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 3' },
  ],
  bedding: [
    { key: 'material', label: 'Material / Fill', type: 'text', placeholder: 'e.g. Memory Foam, Latex, Organic Cotton' },
    { key: 'size', label: 'Bed / Mattress Size', type: 'select', options: ['Single', 'Double', 'Queen', 'King', 'Custom'] },
    { key: 'thickness', label: 'Thickness', type: 'select', options: ['4 Inches', '6 Inches', '8 Inches', '10 Inches', '12 Inches'] },
    { key: 'firmness', label: 'Firmness Level', type: 'select', options: ['Soft', 'Medium Soft', 'Medium Firm', 'Firm', 'Dual Firm / Orthopedic'] },
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Vishwam Comfort, Sleepwell' },
  ],
  electronics: [
    { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Apple, Samsung, Sony, Dell' },
    { key: 'model', label: 'Model Name / No.', type: 'text', placeholder: 'e.g. iPhone 15 Pro, XPS 15' },
    { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Refurbished', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
    { key: 'warranty', label: 'Warranty Details', type: 'text', placeholder: 'e.g. 1 Year Official Warranty' },
  ],
};

export const PRICE_UNITS = [
  { value: 'exact', label: '₹ (Exact Amount)', multiplier: 1 },
  { value: 'thousand', label: 'Thousands (K)', multiplier: 1000 },
  { value: 'lakh', label: 'Lakhs (L)', multiplier: 100000 },
  { value: 'crore', label: 'Crores (Cr)', multiplier: 10000000 },
];

export const PRICE_SUFFIXES_BY_CATEGORY = {
  properties: ['', '/ Sq. Ft.', '/ month', '/ year', 'Onwards'],
  'real-estate': ['', '/ Sq. Ft.', '/ month', '/ year', 'Onwards'],
  vehicles: ['', 'Onwards', 'EMI Available'],
  vehicle: ['', 'Onwards', 'EMI Available'],
  groceries: ['', '/ kg', '/ piece', '/ pack', '/ liter', '/ dozen'],
  grocery: ['', '/ kg', '/ piece', '/ pack', '/ liter', '/ dozen'],
  garments: ['', 'Onwards', '/ piece'],
  garment: ['', 'Onwards', '/ piece'],
  jewellery: ['', '/ gram', '/ piece', '+ Making Charges'],
  finance: ['', '% p.a.', '/ year'],
  services: ['', '/ visit', '/ hour', '/ job'],
  service: ['', '/ visit', '/ hour', '/ job'],
  bedding: ['', 'Onwards', '/ piece', '/ set'],
  electronics: ['', 'Onwards', 'EMI Available', '/ unit'],
};

export const OVERRIDE_INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white transition-all';

export function getCategoryFields(typeKey, subcategory = '') {
  const cleanType = String(typeKey || '').toLowerCase().trim();
  const cleanSub = String(subcategory || '').toLowerCase().trim();

  if (cleanType === 'properties' || cleanType === 'real-estate') {
    if (cleanSub.includes('plot') || cleanSub.includes('land')) {
      return [
        { key: 'propertyName', label: 'Property / Project Name', type: 'text', placeholder: 'e.g. Green Meadows Layout' },
        { key: 'dimensions', label: 'Dimensions (Length x Width / Sq.ft)', type: 'text', placeholder: 'e.g. 30 x 40 ft (1,200 sq.ft.)' },
        { key: 'facing', label: 'Property Facing', type: 'select', options: ['East', 'West', 'North', 'South', 'Other'] },
        { key: 'cornerPlot', label: 'Corner Plot?', type: 'select', options: ['Yes', 'No', 'Other'] },
        { key: 'approvedLayout', label: 'Approved Layout', type: 'select', options: ['Yes', 'No'] },
        { key: 'boundaryWall', label: 'Boundary Wall / Fencing Available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'approvalAuthority', label: 'Approval Authority', type: 'select', options: ['BDA', 'BBMP', 'BMRDA', 'Panchayat', 'RERA', 'Other'] },
        { key: 'gatedCommunity', label: 'Gated Community', type: 'select', options: ['Yes', 'No'] },
        { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
        { key: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
        { key: 'totalUnits', label: 'Total Units / Plots', type: 'text', placeholder: 'e.g. 50 Plots' },
        { key: 'availableUnits', label: 'Available Plots', type: 'number', placeholder: 'e.g. 12' },
        { key: 'possessionStatus', label: 'Possession Status', type: 'select', options: getPossessionOptionsBySubcategory(subcategory) },
      ];
    }
    if (cleanSub.includes('flat') || cleanSub.includes('villa') || cleanSub.includes('house') || cleanSub.includes('apartment')) {
      return [
        { key: 'projectName', label: 'Project / Society / House Name', type: 'text', placeholder: 'e.g. Sobha Dream Acres / Prestige Golfshire' },
        { key: 'bhk', label: 'Configuration (BHK)', type: 'select', options: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Other'] },
        { key: 'area_sqft', label: 'Super Built-up Area (sq. ft.)', type: 'text', placeholder: 'e.g. 1,450 sq.ft.' },
        { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 20th of 20 Floors' },
        { key: 'floors', label: 'Floors / Blocks', type: 'text', placeholder: 'e.g. B+G+11 Floors · 3 Towers · 6 Blocks' },
        { key: 'towers', label: 'Towers', type: 'text', placeholder: 'e.g. 3 Towers' },
        { key: 'extraRoom', label: 'Extra Room', type: 'text', placeholder: 'e.g. Pooja Room, Study' },
        { key: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
        { key: 'totalUnits', label: 'Total Units', type: 'text', placeholder: 'e.g. 200 Units' },
        { key: 'availableUnits', label: 'Available Units', type: 'number', placeholder: 'e.g. 5' },
        { key: 'approvalAuthority', label: 'Approval Authority', type: 'select', options: ['BDA', 'BBMP', 'BMRDA', 'RERA', 'EOI', 'Other'] },
        { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
        { key: 'facing', label: 'Property Facing', type: 'select', options: ['North', 'South', 'East', 'West', 'Other'] },
        { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
        { key: 'balconies', label: 'Balconies', type: 'select', options: ['1', '2', '3+'] },
        { key: 'furnishing', label: 'Furnishing Status', type: 'select', options: ['Unfurnished', 'Semi-furnished', 'Fully furnished'] },
        { key: 'possessionStatus', label: 'Possession Status', type: 'select', options: STRUCTURAL_POSSESSION_OPTIONS },
        { key: 'propertyAge', label: 'Property Age', type: 'text', placeholder: 'e.g. Brand New / 2 Years' },
        { key: 'parking', label: 'Parking Space', type: 'select', options: ['None', 'Two Wheeler', 'One Car', 'Multiple Cars', 'Other'] },
        { key: 'gatedCommunity', label: 'Gated Community?', type: 'select', options: ['Yes', 'No'] },
        { key: 'garden', label: 'Garden / Private Terrace', type: 'select', options: ['Yes', 'No', 'Maybe'] },
        { key: 'maintenance', label: 'Maintenance Charges Applicable?', type: 'select', options: ['Yes', 'No'] },
      ];
    }
    if (cleanSub.includes('agricultural') || cleanSub.includes('farm')) {
      return [
        { key: 'totalLandExtent', label: 'Total Land Extent (Acres / Guntas)', type: 'text', placeholder: 'e.g. 4 Acres 20 Guntas' },
        { key: 'surveyNumber', label: 'Survey Number', type: 'text', placeholder: 'e.g. Sy No. 124/2B' },
        { key: 'landType', label: 'Type of Land', type: 'select', options: ['Agricultural', 'Converted', 'Plantation', 'Farm land', 'Other'] },
        { key: 'roadAccess', label: 'Road Access & Road Width', type: 'text', placeholder: 'e.g. Tar Road with 30 ft width frontage' },
        { key: 'waterAvailability', label: 'Water Availability', type: 'select', options: ['Borewell', 'Lake', 'Rain-fed', 'Canal', 'None', 'Other'] },
        { key: 'electricity', label: 'Electricity Available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'farmhouse', label: 'Farmhouse / Shed Available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'boundaryWall', label: 'Fencing / Boundary Wall?', type: 'select', options: ['Yes', 'No'] },
        { key: 'currentCrop', label: 'Current Crop / Plantation', type: 'text', placeholder: 'e.g. Coconut, Arecanut, Mango, Fallow' },
        { key: 'soilType', label: 'Soil Type', type: 'select', options: ['Red Soil', 'Black Soil', 'Other'] },
        { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
      ];
    }
    if (cleanSub.includes('commercial') || cleanSub.includes('office') || cleanSub.includes('shop') || cleanSub.includes('showroom')) {
      return [
        { key: 'commercialType', label: 'Commercial Property Type', type: 'select', options: ['Office', 'Shop', 'Showroom', 'Restaurant space', 'Commercial building', 'Warehouse', 'Other'] },
        { key: 'carpetArea', label: 'Carpet Area (sq. ft.)', type: 'text', placeholder: 'e.g. 2,200 sq.ft.' },
        { key: 'area_sqft', label: 'Built-up Area (sq. ft.)', type: 'text', placeholder: 'e.g. 2,800 sq.ft.' },
        { key: 'floors', label: 'Total Floors in Building', type: 'select', options: ['0', '1', '2', '3', 'Other'] },
        { key: 'facing', label: 'Property Facing', type: 'select', options: ['North', 'South', 'East', 'West', 'Other'] },
        { key: 'furnishing', label: 'Furnishing / Interior Status', type: 'select', options: ['Semi Furnished', 'Fully Furnished', 'No Furnishing'] },
        { key: 'washrooms', label: 'Washrooms Available', type: 'select', options: ['Yes', 'No'] },
        { key: 'lift', label: 'Lift Available', type: 'select', options: ['Yes', 'No'] },
        { key: 'powerBackup', label: 'Power Backup Available', type: 'select', options: ['Yes', 'No'] },
        { key: 'parking', label: 'Parking Capacity', type: 'select', options: ['None', 'Two wheelers', 'Few Four wheelers', 'Other'] },
        { key: 'mainRoadFrontage', label: 'Main-Road Frontage', type: 'select', options: ['Yes', 'No', 'Other'] },
        { key: 'occupancy', label: 'Currently Occupied or Vacant?', type: 'select', options: ['occupied', 'Vacant', 'Other'] },
        { key: 'existingRentalIncome', label: 'Existing Rental Income (if applicable)', type: 'text', placeholder: "e.g. ₹1,50,000 / month (or 'N/A')" },
        { key: 'maintenance', label: 'Maintenance Charges Applicable?', type: 'select', options: ['Yes', 'No'] },
      ];
    }
    if (cleanSub.includes('industrial') || cleanSub.includes('factory') || cleanSub.includes('warehouse')) {
      return [
        { key: 'industrialType', label: 'Type of Industrial Property', type: 'select', options: ['Industrial land', 'Factory', 'Warehouse', 'Industrial shed', 'Manufacturing unit', 'Logistics facility', 'Cold storage', 'Other'] },
        { key: 'propertyStatus', label: 'Property Status', type: 'select', options: ['Vacant land', 'Ready to occupy', 'Operational', 'Under construction', 'Closed/non-operational', 'Other'] },
        { key: 'totalLandArea', label: 'Total Land Area', type: 'text', placeholder: 'e.g. 2 Acres or 45,000 sq.ft.' },
        { key: 'area_sqft', label: 'Total Built-up Area', type: 'text', placeholder: 'e.g. 25,000 sq.ft.' },
        { key: 'shedDimensions', label: 'Shed / Factory Dimensions', type: 'text', placeholder: 'e.g. 100 x 200 ft (Height: 28 ft)' },
        { key: 'floors', label: 'Number of Floors (if any)', type: 'text', placeholder: 'e.g. Ground Floor only / G+1 Mezzanine' },
        { key: 'approachRoadWidth', label: 'Approach Road Width', type: 'text', placeholder: 'e.g. 60 ft or 80 ft Main Road' },
        { key: 'roadFrontage', label: 'Road Frontage Available?', type: 'select', options: ['Yes', 'No'] },
        { key: 'heavyVehicleAccess', label: 'Can Heavy Vehicles / Containers Access?', type: 'select', options: ['Yes', 'No'] },
        { key: 'powerLoad', label: 'Power Availability / Sanctioned Load', type: 'select', options: ['Yes', 'No'] },
        { key: 'waterSupply', label: 'Water Sources Available', type: 'select', options: ['Borewell', 'Government connection', 'Tanker supply', 'Not available', 'Other'] },
        { key: 'approvalAuthority', label: 'Approval Authority', type: 'select', options: ['KIADB', 'KSPCB', 'BDA', 'BBMP', 'Other'] },
        { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
      ];
    }
    // Default / Residential overview & specifications
    return [
      { key: 'propertyName', label: 'Property / Project Name', type: 'text', placeholder: 'e.g. Green Meadows Residential Layout' },
      { key: 'dimensions', label: 'Dimensions: Length x Width', type: 'text', placeholder: 'e.g. 30 x 40 ft (1,200 sq.ft.)' },
      { key: 'facing', label: 'Property Facing', type: 'select', options: ['East', 'West', 'North', 'South', 'Other'] },
      { key: 'cornerPlot', label: 'Corner Plot?', type: 'select', options: ['Yes', 'No', 'Other'] },
      { key: 'approvedLayout', label: 'Approved Layout', type: 'select', options: ['Yes', 'No'] },
      { key: 'boundaryWall', label: 'Boundary Wall / Fencing Available?', type: 'select', options: ['Yes', 'No'] },
      { key: 'approvalAuthority', label: 'Approval Authority', type: 'select', options: ['BDA', 'BBMP', 'BMRDA', 'Panchayat', 'RERA', 'Other'] },
      { key: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
      { key: 'bhk', label: 'BHK Configuration', type: 'text', placeholder: 'e.g. 2, 3 & 4 BHK' },
      { key: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
      { key: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
      { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 2nd Floor' },
      { key: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g. 1 Covered + 1 Open' },
      { key: 'possessionStatus', label: 'Possession Status', type: 'select', options: POSSESSION_STATUS_OPTIONS },
    ];
  }

  return CATEGORY_SPECIFIC_FIELDS[cleanType] || [];
}
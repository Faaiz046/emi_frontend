// Mock data for testing CRUD components when backend is not available

export const mockCompanies = [
  {
    id: 1,
    company_name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    logo: 'https://via.placeholder.com/150',
    license_key: 'LIC-2024-001',
    status: 'active',
    subscription_plan: 'premium',
    subscription_start_date: '2024-01-01',
    subscription_end_date: '2024-12-31',
    max_users: 50,
    features: { analytics: true, reporting: true, api_access: true },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    company_name: 'Global Enterprises',
    email: 'info@globalenterprises.com',
    phone: '+1 (555) 987-6543',
    address: '456 Business Ave, New York, NY 10001',
    logo: 'https://via.placeholder.com/150',
    license_key: 'LIC-2024-002',
    status: 'active',
    subscription_plan: 'enterprise',
    subscription_start_date: '2024-01-01',
    subscription_end_date: '2024-12-31',
    max_users: 200,
    features: { analytics: true, reporting: true, api_access: true, custom_integration: true },
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-20T14:45:00.000Z'
  },
  {
    id: 3,
    company_name: 'Startup Ventures',
    email: 'hello@startupventures.com',
    phone: '+1 (555) 456-7890',
    address: '789 Innovation Blvd, Austin, TX 73301',
    logo: 'https://via.placeholder.com/150',
    license_key: 'LIC-2024-003',
    status: 'active',
    subscription_plan: 'basic',
    subscription_start_date: '2024-01-01',
    subscription_end_date: '2024-06-30',
    max_users: 10,
    features: { analytics: false, reporting: false, api_access: false },
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-25T09:15:00.000Z'
  },
  {
    id: 4,
    company_name: 'Digital Dynamics',
    email: 'support@digitaldynamics.com',
    phone: '+1 (555) 321-6540',
    address: '321 Digital Way, Seattle, WA 98101',
    logo: 'https://via.placeholder.com/150',
    license_key: 'LIC-2024-004',
    status: 'inactive',
    subscription_plan: 'premium',
    subscription_start_date: '2024-01-01',
    subscription_end_date: '2024-03-31',
    max_users: 25,
    features: { analytics: true, reporting: true, api_access: false },
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-02-01T16:20:00.000Z'
  },
  {
    id: 5,
    company_name: 'Cloud Computing Corp',
    email: 'info@cloudcomputing.com',
    phone: '+1 (555) 789-0123',
    address: '654 Cloud Street, San Francisco, CA 94102',
    logo: 'https://via.placeholder.com/150',
    license_key: 'LIC-2024-005',
    status: 'active',
    subscription_plan: 'enterprise',
    subscription_start_date: '2024-01-01',
    subscription_end_date: '2024-12-31',
    max_users: 500,
    features: { analytics: true, reporting: true, api_access: true, custom_integration: true, priority_support: true },
    created_at: '2024-01-20T00:00:00.000Z',
    updated_at: '2024-02-05T11:30:00.000Z'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@techsolutions.com',
    username: 'johndoe',
    role: 'admin',
    branch: 'Headquarters',
    status: 'active',
    last_login: '2024-02-10T15:30:00.000Z',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@globalenterprises.com',
    username: 'janesmith',
    role: 'manager',
    branch: 'New York Office',
    status: 'active',
    last_login: '2024-02-09T14:20:00.000Z',
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@startupventures.com',
    username: 'mikejohnson',
    role: 'user',
    branch: 'Austin Office',
    status: 'active',
    last_login: '2024-02-08T09:15:00.000Z',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockBranches = [
  {
    id: 1,
    name: 'Headquarters',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'hq@company.com',
    manager: 'John Doe',
    capacity: 100,
    is_headquarters: true,
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'New York Office',
    address: '456 Business Ave, New York, NY 10001',
    phone: '+1 (555) 987-6543',
    email: 'ny@company.com',
    manager: 'Jane Smith',
    capacity: 50,
    is_headquarters: false,
    status: 'active',
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Austin Office',
    address: '789 Innovation Blvd, Austin, TX 73301',
    phone: '+1 (555) 456-7890',
    email: 'austin@company.com',
    manager: 'Mike Johnson',
    capacity: 25,
    is_headquarters: false,
    status: 'active',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockRoles = [
  {
    id: 1,
    title: 'Administrator',
    description: 'Full system access and control',
    permissions: ['read', 'write', 'delete', 'admin'],
    level: 1,
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Manager',
    description: 'Department management and oversight',
    permissions: ['read', 'write'],
    level: 2,
    status: 'active',
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 3,
    title: 'User',
    description: 'Basic user access',
    permissions: ['read'],
    level: 3,
    status: 'active',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockBrands = [
  {
    id: 1,
    name: 'TechBrand',
    description: 'Leading technology brand',
    logo: 'https://via.placeholder.com/150',
    website: 'https://techbrand.com',
    contact_email: 'contact@techbrand.com',
    contact_phone: '+1 (555) 123-4567',
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'InnovateCorp',
    description: 'Innovation-driven corporation',
    logo: 'https://via.placeholder.com/150',
    website: 'https://innovatecorp.com',
    contact_email: 'info@innovatecorp.com',
    contact_phone: '+1 (555) 987-6543',
    status: 'active',
    created_at: '2024-01-05T00:00:00.000Z'
  }
];

export const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    code: 'ELEC-001',
    description: 'Electronic devices and accessories',
    logo: 'https://via.placeholder.com/150',
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Software',
    code: 'SOFT-001',
    description: 'Software applications and tools',
    logo: 'https://via.placeholder.com/150',
    status: 'active',
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Hardware',
    code: 'HARD-001',
    description: 'Computer hardware and components',
    logo: 'https://via.placeholder.com/150',
    status: 'active',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

export const mockProducts = [
  {
    id: 1,
    name: 'Laptop Pro X1',
    description: 'High-performance laptop for professionals',
    category: 'Electronics',
    brand: 'TechBrand',
    price: 1299.99,
    cost: 800.00,
    stock_quantity: 50,
    min_stock_level: 10,
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    status: 'active',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Office Suite Pro',
    description: 'Complete office software package',
    category: 'Software',
    brand: 'InnovateCorp',
    price: 299.99,
    cost: 150.00,
    stock_quantity: 100,
    min_stock_level: 20,
    images: ['https://via.placeholder.com/300'],
    status: 'active',
    created_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse',
    category: 'Hardware',
    brand: 'TechBrand',
    price: 79.99,
    cost: 40.00,
    stock_quantity: 200,
    min_stock_level: 30,
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    status: 'active',
    created_at: '2024-01-10T00:00:00.000Z'
  }
];

// Mock API response wrapper
export const createMockResponse = (data, success = true, message = 'Success') => {
  return {
    success,
    message,
    data,
    pagination: {
      page: 0,
      limit: 10,
      total: data.length,
      totalPages: Math.ceil(data.length / 10)
    }
  };
};

// Mock API delay to simulate network request
export const mockApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 
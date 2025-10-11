export const projectCategories = [
  'Web Development',
  'Mobile Development', 
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Data Science',
  'Machine Learning',
  'Blockchain',
  'DevOps',
  'Testing & QA',
  'Video Editing',
  'Animation',
  'Photography',
  'Translation',
  'Virtual Assistant',
  'Customer Support',
  'Sales & Marketing',
  'Business Consulting',
  'Legal Services'
];

export const skillSuggestions = {
  'Web Development': ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'Laravel', 'WordPress', 'HTML/CSS', 'JavaScript'],
  'Mobile Development': ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Xamarin', 'Ionic', 'Unity'],
  'UI/UX Design': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Prototyping', 'User Research'],
  'Graphic Design': ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'CorelDRAW', 'Brand Design', 'Logo Design'],
  'Content Writing': ['SEO Writing', 'Blog Writing', 'Copywriting', 'Technical Writing', 'Creative Writing', 'Social Media Content'],
  'Digital Marketing': ['SEO', 'Google Ads', 'Facebook Ads', 'Social Media Marketing', 'Email Marketing', 'Content Marketing'],
  'Data Science': ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics', 'Pandas', 'NumPy'],
  'Machine Learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'Computer Vision', 'NLP'],
  'Blockchain': ['Solidity', 'Web3', 'Smart Contracts', 'Ethereum', 'Bitcoin', 'DeFi', 'NFTs'],
  'DevOps': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Linux', 'Terraform', 'Ansible']
};

export const budgetRanges = [
  { label: 'Micro Budget', range: '$50 - $250', description: 'Simple tasks, quick turnaround' },
  { label: 'Small Project', range: '$250 - $750', description: 'Basic websites, simple apps' },
  { label: 'Medium Project', range: '$750 - $2,500', description: 'Complex websites, custom solutions' },
  { label: 'Large Project', range: '$2,500 - $10,000', description: 'Enterprise solutions, comprehensive systems' },
  { label: 'Enterprise', range: '$10,000+', description: 'Large-scale projects, ongoing partnerships' }
];

export const timelineOptions = [
  'Less than 1 week',
  '1-2 weeks',
  '2-4 weeks', 
  '1-2 months',
  '2-3 months',
  '3-6 months',
  '6+ months'
];

export const getSkillsForCategory = (category) => {
  return skillSuggestions[category] || [];
};

export const validateProjectData = (formData) => {
  const errors = [];
  
  if (!formData.title || formData.title.length < 10) {
    errors.push('Title should be at least 10 characters long');
  }
  
  if (!formData.description || formData.description.length < 50) {
    errors.push('Description should be at least 50 characters long');
  }
  
  if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
    errors.push('Please enter a valid budget amount');
  }
  
  if (!formData.category) {
    errors.push('Please select a project category');
  }
  
  return errors;
};

export const generateProjectTips = (formData) => {
  const tips = [];
  
  if (formData.category && !formData.requiredSkills) {
    const suggestedSkills = getSkillsForCategory(formData.category);
    if (suggestedSkills.length > 0) {
      tips.push(`Consider adding skills like: ${suggestedSkills.slice(0, 3).join(', ')}`);
    }
  }
  
  if (formData.description && formData.description.length < 100) {
    tips.push('Add more details to attract better proposals');
  }
  
  if (!formData.deadline) {
    tips.push('Setting a deadline helps freelancers plan better');
  }
  
  return tips;
};
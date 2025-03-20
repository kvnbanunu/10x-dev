// unix timestamp --> readable
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isAuthenticated = (user) => {
  return !!user;
};

export const isAdmin = (user) => {
  return user && user.is_admin === 1;
};

export const getLanguages = () => {
  return [
    'JavaScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'Go',
    'Rust',
    'TypeScript',
    'HTML/CSS'
  ];
};

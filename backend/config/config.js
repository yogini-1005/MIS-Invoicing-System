const config = {
  emailUser: process.env.EMAIL_USER || 'yoginigosavi1005@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'Yogini@1005',
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  emailService: 'gmail',
  emailPort: 587,
  emailSecure: false,
  emailFrom: process.env.EMAIL_FROM || 'yoginigosavi1005@gmail.com'
};

export default config;

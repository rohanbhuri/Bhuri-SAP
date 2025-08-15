const configs = {
  "beax-rm": {
    brand: {
      name: "Beax RM",
      logo: "/config/assets/beax-rm/logo.png",
      icon: "/config/assets/beax-rm/icon.png"
    },

    colors: {
      primary: "#3B82F6",
      accent: "#F59E0B",
      secondary: "#6B7280"
    },

    app: {
      name: "Beax Resource Manager",
      version: "1.0.0",
      description: "Resource Management System",
      port: 3000,
      apiUrl: "http://localhost:8000/api"
    },
    development: {
      NODE_ENV: 'development',
      MONGODB_URI: 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db',
      JWT_SECRET: 'rohanbhuri',
      PORT: 3000
    }
  },

  "true-process": {
    brand: {
      name: "True Process",
      logo: "/config/assets/true-process/logo.png",
      icon: "/config/assets/true-process/icon.png"
    },

    colors: {
      primary: "#10B981",
      accent: "#EF4444",
      secondary: "#374151"
    },

    app: {
      name: "True Process Manager",
      version: "1.0.0",
      description: "Process Management System",
      port: 3001,
      apiUrl: "http://localhost:8001/api"
    },

    development: {
      NODE_ENV: 'development',
      MONGODB_URI: 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=trueProcess-db',
      JWT_SECRET: 'rohanbhuri',
      PORT: 3000
    }
  }
};

const getConfig = (brand = "beax-rm") => configs[brand] || configs["beax-rm"];

module.exports = { configs, getConfig };
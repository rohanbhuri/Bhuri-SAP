const configs = {
  "beax-rm": {
    brand: {
      name: "Beax RM",
      logo: "/config/assets/beaxrm/icons/BEAX.png",
      icon: "/config/assets/beaxrm/icons/BEAX-icon.png"
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
      port: 4200,
      apiUrl: process.env.NODE_ENV === 'production' ? "http://13.126.228.247:3000/api" : "http://localhost:3000/api"
    },
    database: {
      MONGODB_URI: 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/beaxrm?retryWrites=true&w=majority&appName=bhuri-db',
      JWT_SECRET: 'rohanbhuri'
    },
    development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  },

  "true-process": {
    brand: {
      name: "True Process",
      logo: "/config/assets/true-process/icons/logo.png",
      icon: "/config/assets/true-process/icons/icon.png"
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
      port: 4201,
      apiUrl: process.env.NODE_ENV === 'production' ? "http://3.111.139.181:3001/api" : "http://localhost:3001/api"
    },

    database: {
      MONGODB_URI: 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/trueprocess?retryWrites=true&w=majority&appName=bhuri-db',
      JWT_SECRET: 'rohanbhuri'
    },
    development: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }
};

const getConfig = (brand = "beax-rm") => configs[brand] || configs["beax-rm"];

module.exports = { configs, getConfig };
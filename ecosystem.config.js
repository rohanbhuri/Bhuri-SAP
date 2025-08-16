module.exports = {
  apps: [
    {
      name: 'beax-rm-backend',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URI: process.env.DATABASE_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        BRAND: 'beax-rm'
      },
      max_memory_restart: '200M',
      node_args: '--max-old-space-size=256',
      error_file: './logs/beax-rm-backend-error.log',
      out_file: './logs/beax-rm-backend-out.log',
      log_file: './logs/beax-rm-backend.log'
    },
    {
      name: 'true-process-backend',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URI: process.env.DATABASE_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        BRAND: 'true-process'
      },
      max_memory_restart: '200M',
      node_args: '--max-old-space-size=256',
      error_file: './logs/true-process-backend-error.log',
      out_file: './logs/true-process-backend-out.log',
      log_file: './logs/true-process-backend.log'
    },
    {
      name: 'beax-rm-frontend',
      script: 'npx',
      args: 'ng serve --port 4200 --host 0.0.0.0',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '200M',
      error_file: './logs/beax-rm-frontend-error.log',
      out_file: './logs/beax-rm-frontend-out.log',
      log_file: './logs/beax-rm-frontend.log'
    },
    {
      name: 'true-process-frontend',
      script: 'npx',
      args: 'ng serve --port 4201 --host 0.0.0.0',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '200M',
      error_file: './logs/true-process-frontend-error.log',
      out_file: './logs/true-process-frontend-out.log',
      log_file: './logs/true-process-frontend.log'
    }
  ]
};
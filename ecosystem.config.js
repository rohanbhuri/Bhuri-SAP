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
        MONGODB_URI: process.env.MONGODB_URI,
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
        MONGODB_URI: process.env.MONGODB_URI,
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
      script: 'node',
      args: './dist/beax-rm/browser/server.js',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4200
      },
      max_memory_restart: '200M',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      autorestart: true,
      error_file: './logs/beax-rm-frontend-error.log',
      out_file: './logs/beax-rm-frontend-out.log',
      log_file: './logs/beax-rm-frontend.log'
    },
    {
      name: 'true-process-frontend',
      script: 'node',
      args: './dist/true-process/browser/server.js',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4201
      },
      max_memory_restart: '200M',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      autorestart: true,
      error_file: './logs/true-process-frontend-error.log',
      out_file: './logs/true-process-frontend-out.log',
      log_file: './logs/true-process-frontend.log'
    },
    {
      name: 'raccontixrm-backend',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        BRAND: 'raccontixrm'
      },
      max_memory_restart: '200M',
      node_args: '--max-old-space-size=256',
      error_file: './logs/raccontixrm-backend-error.log',
      out_file: './logs/raccontixrm-backend-out.log',
      log_file: './logs/raccontixrm-backend.log'
    },
    {
      name: 'raccontixrm-frontend',
      script: './dist/raccontixrm/server/main.server.mjs',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4202
      },
      max_memory_restart: '200M',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      autorestart: true,
      error_file: './logs/raccontixrm-frontend-error.log',
      out_file: './logs/raccontixrm-frontend-out.log',
      log_file: './logs/raccontixrm-frontend.log'
    }
  ]
};
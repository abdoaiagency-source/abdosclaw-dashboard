module.exports = {
  apps: [
    {
      name: 'abdosclaw-dashboard-bridge',
      cwd: '/opt/abdosclaw-dashboard',
      script: 'server/index.mjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 8787,
      },
    },
  ],
}

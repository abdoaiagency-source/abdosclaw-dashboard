module.exports = {
  apps: [
    {
      name: 'abdosclaw-dashboard-bridge',
      cwd: process.env.ABDOSCLAW_APP_DIR || '/opt/abdosclaw-dashboard',
      script: 'server/index.mjs',
      interpreter: 'node',
      node_args: '--env-file=.env',
      env: {
        NODE_ENV: 'production',
        PORT: 8787,
      },
    },
  ],
}

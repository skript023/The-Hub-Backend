module.exports = {
    apps: [
      {
        name: "main",
        script: "dist/main.js",
        watch: true,
        ignore_watch: ["node_modules"],
        instances: 1,
        exec_mode: "cluster",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
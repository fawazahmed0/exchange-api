module.exports = {
  apps: [
    {
      name: "editor",
      script: "./server.js",
      instances: 1,
      exec_mode: "fork",
      interpreter: "node",
      watch: false
    }
  ]
};

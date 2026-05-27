module.exports = {
  apps: [
    {
      name: "exchange-api",
      script: "sh",
      args: "-c 'while true; do node currscript.js; sleep 86400; done'",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false
    }
  ]
}

module.exports = {
  apps: [
    {
      name: "autocor",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "2000M",
      interpreter: "node",
      interpreter_args: "--max-old-space-size=2048",
      cwd: "/home/Autocor",
      env: {
        NODE_ENV: "production",
	PORT: 3000
      }
    }
  ]
};

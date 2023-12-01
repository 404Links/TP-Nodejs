module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log", //Fichier logs
      max_memory_restart: "200M", //Mémoire max 200 Mo
      instances: 3, //Nombre d'instances en parallèle
    },
  ],
};

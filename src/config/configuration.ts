export default () => ({
  port: parseInt(process.env.PORT),
  database: {
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    host: process.env.DATABASE_PASSWORD,
  },
});

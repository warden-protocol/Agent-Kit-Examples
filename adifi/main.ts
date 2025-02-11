import { createServer } from 'vite';

async function startServer() {
  const server = await createServer({
    // your vite config
    configFile: './vite.config.ts',
    root: process.cwd(),
    server: {
      port: 5173
    }
  });

  await server.listen();
  server.printUrls();
}

startServer(); 
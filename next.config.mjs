import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets every SCSS module do `@use "mixins" as *;`
  sassOptions: { loadPaths: [path.join(root, 'src/styles')] },
};

export default nextConfig;

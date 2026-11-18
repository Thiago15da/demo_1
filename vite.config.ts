import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const pages=['index','grupo','empresas','gr-vallados','del-sol-ingenieria','del-sol-constructora','eco-asfalto','contacto'];
export default defineConfig({base:'/demo_1/',plugins:[react()],build:{rollupOptions:{input:Object.fromEntries(pages.map(p=>[p,`${p}.html`]))}}});

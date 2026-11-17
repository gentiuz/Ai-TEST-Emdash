import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir:'./tests', fullyParallel:false, workers:1, reporter:'list', use:{ baseURL:'http://127.0.0.1:4321', launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}, headless:true }, outputDir:'artifacts/test-results' });

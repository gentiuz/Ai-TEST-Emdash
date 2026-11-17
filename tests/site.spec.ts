import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/','/about-gent','/ready-to-work','/your-challenges','/the-power','/sign-up','/contact','/terms','/privacy'];
test('all CMS pages render, link correctly, and expose metadata',async({page})=>{
 for(const route of routes){
  const response=await page.goto(route);expect(response?.status(),route).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).not.toHaveText('GENT FORD');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/.{30,}/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp(route==='/'?'/$':`${route}$`));
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',/.+/);
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  expect(await page.locator('main a[href="/sign-up"], main a[href="#enquiry"]').count()).toBeGreaterThanOrEqual(2);
  for(const raw of await page.locator('script[type="application/ld+json"]').allTextContents())expect(()=>JSON.parse(raw)).not.toThrow();
 }
});
test('demo form validates and confirms without submitting data',async({page})=>{
 await page.goto('/sign-up');let requests=0;page.on('request',r=>{if(r.method()==='POST')requests++});
 await page.getByLabel('Your name',{exact:true}).fill('Test visitor');await page.getByLabel('Email address',{exact:true}).fill('test@example.com');
 await page.getByLabel('A little about what brings you here').fill('I want a clearer direction.');
 await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Try the first step'}).click();
 await expect(page.getByRole('status')).toContainText('nothing was sent');expect(requests).toBe(0);
});
test('responsive navigation, dark mode, reduced motion, and accessibility',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Dark mode',exact:true}).click();await expect(page.locator('html')).toHaveClass(/dark/);
 await page.reload();await expect(page.locator('html')).toHaveClass(/dark/);
 await page.screenshot({path:'artifacts/home-dark.png',fullPage:true});
 let results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
 await page.getByRole('button',{name:'Light mode',exact:true}).click();await page.screenshot({path:'artifacts/home-light.png',fullPage:true});
 results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(page.locator('#mobile-menu')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#mobile-menu')).toBeHidden();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 await page.goto('/contact');results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});

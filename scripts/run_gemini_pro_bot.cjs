#!/usr/bin/env node

/**
 * Autonomous Gemini Pro Image Generation Bot for NESFIC-D-26 SishuSuraksha
 * Uses Google Chrome with sumanzfilms@gmail.com on port 9222
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE_DIR = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(BASE_DIR, 'scripts', 'nesfic_d26_image_prompts.json');
const ASSETS_DIR = path.join(BASE_DIR, 'assets', 'proposal_images');

// Parse CLI Arguments
const args = process.argv.slice(2);
let port = 9222;
let filterId = null;
let filterFilename = null;
let forceOverwrite = false;

args.forEach(arg => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.replace('--port=', '').trim(), 10);
  } else if (arg.startsWith('--id=')) {
    filterId = parseInt(arg.replace('--id=', '').trim(), 10);
  } else if (arg.startsWith('--filename=')) {
    filterFilename = arg.replace('--filename=', '').trim();
  } else if (arg === '--force') {
    forceOverwrite = true;
  }
});

if (!fs.existsSync(PROMPTS_FILE)) {
  console.error(`❌ Error: Prompts file not found at ${PROMPTS_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
const allowedFiles = filterFilename ? filterFilename.split(',').map(s => s.trim()) : null;
const queue = allPrompts.filter(item => {
  if (allowedFiles && !allowedFiles.includes(item.filename)) return false;
  if (filterId !== null && item.id !== filterId) return false;
  const targetPath = path.join(ASSETS_DIR, item.filename);
  if (fs.existsSync(targetPath) && !forceOverwrite) {
    return false;
  }
  return true;
});

console.log('\n=============================================================');
console.log('🤖 SISHUSURAKSHA GEMINI PRO AUTOMATION BOT (sumanzfilms@gmail.com)');
console.log('=============================================================');
console.log(`🔌 Target Chrome Port      : ${port}`);
console.log(`📁 Target Assets Directory : ${ASSETS_DIR}`);
console.log(`📋 Total Prompts in Queue  : ${queue.length} of ${allPrompts.length}`);
if (filterId !== null) console.log(`🔍 Filter Diagram ID       : ${filterId}`);
if (filterFilename) console.log(`🔍 Filter Filename         : ${filterFilename}`);
console.log(`⚡ Force Overwrite         : ${forceOverwrite}`);
console.log('=============================================================\n');

if (queue.length === 0) {
  console.log('✨ All images in queue already exist in assets/proposal_images/! Use --force to regenerate.\n');
  process.exit(0);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let browser;
  try {
    console.log(`⏳ Connecting to Chrome on http://127.0.0.1:${port}...`);
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${port}`,
      defaultViewport: null
    });
    console.log(`✅ Connected successfully to Google Chrome!`);
  } catch (err) {
    console.error(`\n❌ Could not connect to Google Chrome on port ${port}: ${err.message}`);
    process.exit(1);
  }

  // Find or create Gemini tab
  const pages = await browser.pages();
  let geminiPage = pages.find(p => p.url().includes('gemini.google.com'));

  if (!geminiPage) {
    console.log(`🌐 Opening a new tab navigating to https://gemini.google.com/app...`);
    geminiPage = await browser.newPage();
    await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
  } else {
    console.log(`🌐 Found active Gemini tab: ${geminiPage.url()}`);
    await geminiPage.bringToFront();
  }

  // Verify active user
  const activeUser = await geminiPage.evaluate(() => {
    const el = document.querySelector('a[aria-label*="Google Account"], a[href*="accounts.google.com"]');
    return el ? el.getAttribute('aria-label') || el.innerText : 'Unknown';
  });
  console.log(`👤 Active Google Account: ${activeUser}`);

  // Verify chat interface is ready
  console.log(`⏳ Checking Gemini chat interface...`);
  await geminiPage.waitForSelector('rich-textarea, div[contenteditable="true"], textarea', { timeout: 30000 })
    .catch(() => console.log('⚠️ Notice: Waiting for chat input element...'));

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const targetFile = path.join(ASSETS_DIR, item.filename);

    console.log(`\n-------------------------------------------------------------`);
    console.log(`📸 [${i + 1}/${queue.length}] Generating Diagram #${item.id}: ${item.filename}`);
    console.log(`📌 Title: "${item.title}"`);
    console.log(`-------------------------------------------------------------`);

    let attempts = 0;
    let saved = false;

    while (attempts < 2 && !saved) {
      attempts++;
      try {
        // Collect existing images
        const existingImageUrls = await geminiPage.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(Boolean);
        });

        // Prompt formatting
        const promptFull = `Generate a high-quality 16:9 widescreen technological framework infographic image: ${item.prompt}`;

        // Type into input
        await geminiPage.evaluate((text) => {
          const input = document.querySelector('rich-textarea p, rich-textarea div[contenteditable="true"], div[contenteditable="true"] p, div[contenteditable="true"], textarea');
          if (input) {
            input.focus();
            input.innerText = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, promptFull);

        await sleep(1000);

        // Click Send button or press Enter
        const clicked = await geminiPage.evaluate(() => {
          const sendBtn = document.querySelector('button[aria-label="Send message"], button.send-button, mat-icon[data-mat-icon-name="send"]')?.closest('button');
          if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          await geminiPage.keyboard.press('Enter');
        }

        console.log(`   📤 Prompt submitted. Waiting for Imagen 3 generation...`);

        // Wait for new generated image
        let imageBuffer = null;
        let waitAttempts = 0;

        while (!imageBuffer && waitAttempts < 40) {
          await sleep(3000);
          waitAttempts++;

          const candidateInfo = await geminiPage.evaluate((existingUrls) => {
            const allImages = Array.from(document.querySelectorAll('img'));
            const candidates = allImages.filter(img =>
              img.src &&
              !existingUrls.includes(img.src) &&
              (img.src.includes('googleusercontent.com') || img.src.startsWith('blob:') || img.src.startsWith('data:image')) &&
              img.naturalWidth > 350
            );

            if (candidates.length > 0) {
              const latest = candidates[candidates.length - 1];
              return { src: latest.src, width: latest.naturalWidth, height: latest.naturalHeight };
            }
            return null;
          }, existingImageUrls);

          if (candidateInfo) {
            console.log(`   🖼️ Image detected in chat (${candidateInfo.width}x${candidateInfo.height})! Extracting raw image bytes...`);

            // Attempt 1: Canvas extraction
            const base64Data = await geminiPage.evaluate((imgSrc) => {
              const img = Array.from(document.querySelectorAll('img')).find(i => i.src === imgSrc);
              if (!img || !img.complete || img.naturalWidth === 0) return null;
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                return dataUrl.split(',')[1];
              } catch (e) {
                return null;
              }
            }, candidateInfo.src);

            if (base64Data) {
              imageBuffer = Buffer.from(base64Data, 'base64');
            } else {
              // Attempt 2: Direct blob fetch in page context
              const fetchedBase64 = await geminiPage.evaluate(async (imgSrc) => {
                try {
                  const res = await fetch(imgSrc);
                  const blob = await res.blob();
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result.split(',')[1];
                      resolve(base64);
                    };
                    reader.readAsDataURL(blob);
                  });
                } catch (e) {
                  return null;
                }
              }, candidateInfo.src);

              if (fetchedBase64) {
                imageBuffer = Buffer.from(fetchedBase64, 'base64');
              }
            }
          }
        }

        if (imageBuffer && imageBuffer.length > 10000) {
          fs.writeFileSync(targetFile, imageBuffer);
          const stats = fs.statSync(targetFile);
          console.log(`   ✅ Successfully saved: assets/proposal_images/${item.filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          saved = true;
          successCount++;
        } else {
          console.error(`   ⚠️ Timed out waiting for ${item.filename} (120s). Skipping or retrying...`);
          if (attempts >= 2) failureCount++;
        }

      } catch (err) {
        console.error(`   ⚠️ Error during processing: ${err.message}`);
        if (attempts >= 2) failureCount++;
      }
    }

    // Cooldown delay between prompts
    if (i < queue.length - 1) {
      console.log(`   ⏳ Cooling down for 6 seconds before next prompt...`);
      await sleep(6000);
    }
  }

  // Sync alias files
  console.log('\n🔄 Syncing secondary diagram aliases...');
  const aliases = [
    { src: 'diagram_2_system_architecture.jpg', dst: 'diagram_2_cadastral_reconciliation_flow.jpg' },
    { src: 'diagram_3_clinical_triage_decision_tree.jpg', dst: 'diagram_3_fair_compensation_algorithm.jpg' },
    { src: 'diagram_4_geospatial_referral_pipeline.jpg', dst: 'diagram_4_grievance_dispute_resolution.jpg' }
  ];

  aliases.forEach(({ src, dst }) => {
    const srcPath = path.join(ASSETS_DIR, src);
    const dstPath = path.join(ASSETS_DIR, dst);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, dstPath);
      console.log(`   📋 Synced ${dst} from ${src}`);
    }
  });

  console.log('\n=============================================================');
  console.log(`🎉 GENERATION COMPLETE: ${successCount} Saved, ${failureCount} Failed`);
  console.log('=============================================================\n');

  browser.disconnect();
}

main().catch(err => {
  console.error(`\n❌ Fatal Error: ${err.message}\n`);
  process.exit(1);
});

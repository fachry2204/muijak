const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function downloadFile(fileUrl, outputPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
      timeout: 10000
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) resolve(true);
      });
    });
  } catch (err) {
    console.error(`Failed to download ${fileUrl}:`, err.message);
    return false;
  }
}

async function runScraper() {
  console.log('Connecting to database...');
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mui'
  });

  try {
    const baseUrl = 'https://mui.or.id';
    console.log('Fetching MUI Fatwa list...');
    const res = await axios.get(`${baseUrl}/info-fatwa/`);
    const $ = cheerio.load(res.data);
    
    const fatwaLinks = [];
    
    // Find all links to fatwa detail pages on the first page
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/baca/fatwa/')) {
        if (!fatwaLinks.includes(href)) {
          fatwaLinks.push(href);
        }
      }
    });

    console.log(`Found ${fatwaLinks.length} fatwa links. Beginning extraction...`);

    let count = 0;
    for (const link of fatwaLinks) {
      if (count >= 10) break; // Limit to 10 for safety/speed

      console.log(`Processing: ${link}`);
      try {
        const detailRes = await axios.get(link);
        const detail$ = cheerio.load(detailRes.data);
        
        const title = detail$('h1').text().trim() || detail$('title').text().replace(' | MUI - Majelis Ulama Indonesia', '').trim();
        
        let pdfUrl = null;
        detail$('a').each((i, el) => {
          const href = detail$(el).attr('href');
          if (href && href.toLowerCase().endsWith('.pdf')) {
            pdfUrl = href;
          }
        });

        // Default metadata
        let no = `Fatwa-${Date.now().toString().slice(-6)}`;
        let date = new Date().toISOString().split('T')[0];
        
        // Try to extract date and no from text
        const bodyText = detail$('body').text();
        const noMatch = bodyText.match(/Nomor\s*:?\s*([^\n]+)/i);
        if (noMatch) no = noMatch[1].trim().substring(0, 50);
        
        // Some simple dates
        const dateMatch = bodyText.match(/(\d{1,2}\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})/i);
        if (dateMatch) date = dateMatch[1].trim();

        if (title && pdfUrl) {
          // Download PDF
          let actualPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${baseUrl}${pdfUrl}`;
          const ext = '.pdf';
          const fileName = `mui-pusat-${Date.now()}-${count}${ext}`;
          
          const dirPath = path.join(__dirname, 'public', 'dokumen', 'fatwa');
          if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
          
          const filePath = path.join(dirPath, fileName);
          console.log(`Downloading PDF from ${actualPdfUrl}...`);
          
          const success = await downloadFile(actualPdfUrl, filePath);
          
          if (success) {
            const stats = fs.statSync(filePath);
            const sizeInKb = Math.round(stats.size / 1024);
            const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
            const file_url = `/dokumen/fatwa/${fileName}`;

            // Check if exists
            const [existing] = await pool.query('SELECT id FROM fatwas WHERE title = ?', [title]);
            if (existing.length === 0) {
              await pool.query(
                'INSERT INTO fatwas (title, no, date, type, size, file_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, no, date, 'MUI Pusat', sizeStr, file_url, 'Published']
              );
              console.log(`✅ Saved to DB: ${title}`);
            } else {
              console.log(`⚠️ Skipped (Already exists): ${title}`);
            }
          }
        } else {
           console.log(`❌ No PDF found for ${title}`);
        }

      } catch (err) {
        console.error(`Error processing ${link}:`, err.message);
      }
      count++;
    }

    console.log('✅ Scraping and Import completed!');
    process.exit(0);
  } catch (error) {
    console.error('Scraper Error:', error);
    process.exit(1);
  }
}

runScraper();

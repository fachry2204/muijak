const mysql = require('mysql2/promise');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, savePath) {
  try {
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000
    });
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);
      writer.on('finish', () => resolve(true));
      writer.on('error', e => reject(e));
    });
  } catch (e) {
    console.error("Gagal mendownload gambar:", url);
    return false;
  }
}

const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 50);

async function importWP() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mui'
  });

  const BASE_URL = 'https://muijakarta.or.id';
  const publicDir = path.join(process.cwd(), 'public');

  try {
    console.log('Mengambil kategori dari WordPress...');
    const catRes = await axios.get(`${BASE_URL}/wp-json/wp/v2/categories?per_page=100`);
    const wpCategories = catRes.data;
    
    console.log(`Ditemukan ${wpCategories.length} kategori. Menyimpan ke MySQL...`);
    const catMap = {};

    for (const cat of wpCategories) {
      const [existing] = await connection.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      let localId;
      if (existing.length > 0) {
        localId = existing[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO categories (name_id, slug) VALUES (?, ?)',
          [cat.name, cat.slug]
        );
        localId = result.insertId;
      }
      catMap[cat.id] = localId;
    }
    console.log('Kategori berhasil disinkronisasi.');

    console.log('Mulai mengambil artikel dari WordPress...');
    let page = 1;
    let totalPosts = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`Mengambil Halaman ke-${page}...`);
      try {
        const postRes = await axios.get(`${BASE_URL}/wp-json/wp/v2/posts?per_page=20&page=${page}&_embed=1`);
        const posts = postRes.data;
        
        if (posts.length === 0) {
          hasMore = false;
          break;
        }

        for (const post of posts) {
          // Hapus berita lama dengan slug yang sama untuk memastikan ID dan Gambar terganti sempurna
          await connection.query('DELETE FROM news WHERE slug = ?', [post.slug]);

          const postDate = new Date(post.date);
          const dd = String(postDate.getDate()).padStart(2, '0');
          const mm = String(postDate.getMonth() + 1).padStart(2, '0');
          const yyyy = postDate.getFullYear();
          const folderDate = `${dd}-${mm}-${yyyy}`;

          const rawTitle = post.title.rendered.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&amp;/g, '&');
          // Sanitize HTML tags in title if any
          const title = rawTitle.replace(/<[^>]*>?/gm, '');
          const safeTitle = sanitizeFilename(title);
          
          let content = post.content.rendered;
          const status = post.status === 'publish' ? 'PUBLISHED' : 'DRAFT';
          const createdAt = postDate.toISOString().slice(0, 19).replace('T', ' ');

          // Unduh dan ganti URL gambar utama (Thumbnail)
          let imageUrl = null;
          if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
            const originalUrl = post._embedded['wp:featuredmedia'][0].source_url;
            let ext = '.jpg';
            try { ext = path.extname(new URL(originalUrl).pathname) || '.jpg'; } catch(e){}
            const newFilename = `MUI Jakarta-${safeTitle}-utama${ext}`;
            const localSavePath = path.join(publicDir, 'gambar/berita', folderDate, newFilename);
            
            const downloaded = await downloadImage(originalUrl, localSavePath);
            if(downloaded) {
                imageUrl = `/gambar/berita/${folderDate}/${newFilename}`;
            }
          }

          // Proses Regex untuk mengunduh semua gambar di dalam Isi Berita (Content)
          const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
          const matches = [...content.matchAll(imgRegex)];
          let imgCount = 1;

          for (const match of matches) {
            const originalImgTag = match[0];
            let imgUrl = match[1];
            
            // Bypass base64 or weird formats
            if (imgUrl.startsWith('data:')) continue;
            
            // Handle relative urls from WordPress by prepending base if needed
            if(imgUrl.startsWith('/')) imgUrl = BASE_URL + imgUrl;

            let ext = '.jpg';
            try { ext = path.extname(new URL(imgUrl).pathname) || '.jpg'; } catch(e){}
            const newFilename = `MUI Jakarta-${safeTitle}-${imgCount}${ext}`;
            const localSavePath = path.join(publicDir, 'gambar/berita', folderDate, newFilename);
            const relativeUrl = `/gambar/berita/${folderDate}/${newFilename}`;
            
            const downloaded = await downloadImage(imgUrl, localSavePath);
            
            if(downloaded) {
              const altText = `MUI Jakarta-${title}`;
              const descText = title; 
              const newImgTag = `<img src="${relativeUrl}" alt="${altText}" title="${descText}" class="img-fluid rounded my-4" />`;
              content = content.replace(originalImgTag, newImgTag);
              imgCount++;
            }
          }

          let categoryId = null;
          if (post.categories && post.categories.length > 0) {
            categoryId = catMap[post.categories[0]] || null;
          }

          // Gunakan ID asli dari WordPress
          const id = post.id.toString();

          await connection.query(
            "INSERT INTO news (id, title_id, slug, content_id, category_id, image_url, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, title, post.slug, content, categoryId, imageUrl, status, createdAt, createdAt]
          );
          totalPosts++;
          console.log(`✔️  Berhasil migrasi: [ID: ${id}] ${title.substring(0, 40)}...`);
        }
        
        page++;
      } catch (err) {
        if (err.response && err.response.status === 400) {
          hasMore = false;
        } else {
          console.error(`Error pada halaman ${page}:`, err.message);
          hasMore = false;
        }
      }
    }

    console.log("-----------------------------------------");
    console.log("Migrasi Selesai! Total berita: " + totalPosts);

  } catch (error) {
    console.error('Migrasi Gagal:', error.message);
  } finally {
    await connection.end();
  }
}

importWP();

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'client', 'public', 'products');
const seedFile = path.join(__dirname, 'server', 'src', 'seed', 'seed.ts');

function readProductImages() {
  if (!fs.existsSync(productsDir)) {
    throw new Error(`Products directory not found: ${productsDir}`);
  }
  return fs.readdirSync(productsDir)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort();
}

function buildImageMap(files) {
  const normalized = files.map((file) => ({
    file,
    slug: path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }));

  return normalized.reduce((map, item) => {
    if (!map[item.slug]) {
      map[item.slug] = item.file;
    }
    return map;
  }, {});
}

function replaceSeedImagePaths(fileContent, imageMap) {
  const lines = fileContent.split('\n');
  let insideProduct = false;
  let currentSlug = null;
  let output = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      insideProduct = true;
      output.push(line);
      continue;
    }

    if (insideProduct && line.match(/images:\s*\[/)) {
      const imageFile = imageMap[currentSlug] || null;
      const imagePath = imageFile ? `['/products/${imageFile}']` : "['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']";
      output.push(`      images: ${imagePath},`);

      // skip the existing images array block until its closing bracket
      i += 1;
      while (i < lines.length && !lines[i].includes(']')) {
        i += 1;
      }
      continue;
    }

    if (insideProduct && line.trim().startsWith('}')) {
      insideProduct = false;
      currentSlug = null;
    }

    output.push(line);
  }

  return output.join('\n');
}

function main() {
  const files = readProductImages();
  const imageMap = buildImageMap(files);

  if (!fs.existsSync(seedFile)) {
    throw new Error(`Seed file not found: ${seedFile}`);
  }

  const seedContent = fs.readFileSync(seedFile, 'utf-8');
  const updated = replaceSeedImagePaths(seedContent, imageMap);

  if (updated === seedContent) {
    console.log('No changes were made to the seed file.');
    return;
  }

  fs.writeFileSync(seedFile, updated, 'utf-8');
  console.log('Updated seed image paths using local product assets.');
}

main();

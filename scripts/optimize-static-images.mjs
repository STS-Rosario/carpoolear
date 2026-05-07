#!/usr/bin/env node
/**
 * Lossy-optimize raster assets under static/img (JPG/PNG).
 * Run before production builds when full-resolution sources exist locally.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'static', 'img');

const EXT = new Set(['.jpg', '.jpeg', '.png']);

async function main() {
    let sharp;
    try {
        ({ default: sharp } = await import('sharp'));
    } catch {
        console.error(
            'sharp is not installed. Run: npm install sharp --save-dev'
        );
        process.exit(1);
    }

    if (!fs.existsSync(ROOT)) {
        console.log('No static/img folder — nothing to do.');
        return;
    }

    const files = [];
    function walk(dir) {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) walk(full);
            else if (EXT.has(path.extname(ent.name).toLowerCase())) {
                files.push(full);
            }
        }
    }
    walk(ROOT);

    if (files.length === 0) {
        console.log('No JPG/PNG files under static/img.');
        return;
    }

    let saved = 0;
    for (const filePath of files) {
        const buf = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let out;
        if (ext === '.jpg' || ext === '.jpeg') {
            out = await sharp(buf)
                .jpeg({ quality: 82, mozjpeg: true })
                .toBuffer();
        } else {
            out = await sharp(buf)
                .png({ compressionLevel: 9, palette: false })
                .toBuffer();
        }
        if (out.length < buf.length) {
            fs.writeFileSync(filePath, out);
            saved += buf.length - out.length;
        }
    }

    console.log(
        `Processed ${files.length} image(s). Bytes saved (approx): ${saved}`
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

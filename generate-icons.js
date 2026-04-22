import sharp from 'sharp';
import fs from 'fs';

const inputFile = 'assets/logo.svg';
const outputFileBuild = 'build/icon.png';
const outputFilePublic = 'public/icon.png';

async function generateIcons() {
    console.log('Generating icons from SVG...');

    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    try {
        // Generate 512x512 PNG for build
        await sharp(inputFile)
            .resize(512, 512)
            .png()
            .toFile(outputFileBuild);
        console.log(`Generated ${outputFileBuild} (512x512)`);

        // Generate 512x512 PNG for public (window icon)
        await sharp(inputFile)
            .resize(512, 512)
            .png()
            .toFile(outputFilePublic);
        console.log(`Generated ${outputFilePublic} (512x512)`);

        // Generate PWA Icons
        await sharp(inputFile).resize(192, 192).png().toFile('public/pwa-192x192.png');
        await sharp(inputFile).resize(512, 512).png().toFile('public/pwa-512x512.png');
        console.log(`Generated PWA icons (192x192 and 512x512)`);

    } catch (err) {
        console.error('Error generating icons:', err);
        process.exit(1);
    }
}

generateIcons();

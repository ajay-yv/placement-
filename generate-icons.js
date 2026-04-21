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

        // Hack: Rename png to ico for older windows compatibility if needed
        // But electron-builder prefers 256x256+
        // We will config package.json to point to icon.png if allowed or rely on it auto-converting
        // For now, let's create a copy as .ico just in case it checks extension, but format is PNG (might serve as fallback)
        // Actually, electron-builder warns if .ico is not real ico.
        // Better to point to .png in package.json and let it handle conversion if possible.

    } catch (err) {
        console.error('Error generating icons:', err);
        process.exit(1);
    }
}

generateIcons();

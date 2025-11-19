const fs = require('fs');
const path = require('path');

const createSVG = (color, label) => `
<svg width="4096" height="2048" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="4096" height="2048" fill="url(#grad)" />
  <text x="2048" y="1024" font-family="Arial, sans-serif" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${label}
  </text>
  <text x="2048" y="1180" font-family="Arial, sans-serif" font-size="60" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">
    Replace with actual 360° panorama
  </text>
</svg>
`;

const scenes = [
  { file: 'entrance.jpg', color: '#4A90E2', label: 'Entrance' },
  { file: 'living.jpg', color: '#50C878', label: 'Living Room' },
  { file: 'bathroom.jpg', color: '#E27B4A', label: 'Bathroom' }
];

const tourPath = path.join(__dirname, '..', 'public', 'tour');

scenes.forEach(scene => {
  const svgContent = createSVG(scene.color, scene.label);
  const filePath = path.join(tourPath, scene.file.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`Created: ${scene.file.replace('.jpg', '.svg')}`);
});

console.log('\nPlaceholder images created!');
console.log('Note: SVG files are used as placeholders.');
console.log('For best results, replace with actual 360° panorama JPEGs.');

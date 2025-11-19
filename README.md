# 3D Memory Universe

Transform your space into an immersive 3D experience with a single photo.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Minimal Upload**: Single photo upload interface
- **360° Tours**: Immersive panoramic experiences
- **Professional UI**: Clean, McKinsey-style design
- **Zero Backend**: Fully static prototype
- **Instant Demo**: Works out of the box with sample data

## Architecture

```
pages/
├── index.tsx          # Upload page (fake upload)
└── tour.tsx           # 3D viewer with Pannellum

public/tour/
├── data.json          # Tour structure
└── *.jpg              # 360° panoramas

styles/
├── globals.css        # Global styles + hotspot CSS
├── Home.module.css    # Upload page styles
└── Tour.module.css    # Viewer page styles
```

## Adding Real 360° Images

1. **Get panoramas** (2:1 ratio, e.g., 4096×2048px):
   - Download from [Flickr Equirectangular](https://www.flickr.com/groups/equirectangular/)
   - Or shoot with Ricoh Theta / Insta360

2. **Replace files** in `public/tour/`:
   - `entrance.jpg`
   - `living.jpg`
   - `bathroom.jpg`

3. **Update metadata** in `public/tour/data.json`

## Tech Stack

- Next.js 16 + TypeScript
- Pannellum (360° viewer)
- Zero dependencies for core functionality

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
```

## Prototype Notes

This is a **lean MVP** for demonstration:

- Upload is **fake** (client-side only, no server processing)
- Shows **pre-made tours** (not generated from upload)
- Perfect for **UX validation** and **investor demos**

For production, integrate:
- Real upload API
- AI-powered 3D generation
- Database for user tours

## License

MIT

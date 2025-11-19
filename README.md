# 3D Memory Universe

**Relive your memories in 3D space.**

AI-driven personal memory reconstruction platform. Turn a single photo into an immersive, walkable experience. Recreate emotional moments as interactable virtual environments.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Memory Reconstruction**: Upload a single photo and step back into that moment
- **360° Immersive Experience**: Walk through your memories in panoramic 3D
- **Emotional Design**: Clean, focused interface that honors your memories
- **Instant Prototype**: AI-reconstructed memory spaces (demo with sample data)
- **Multi-sensory**: Visual navigation with ambient context

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

## Vision & Current State

### The Vision
Turn photos into **AI-reconstructed 3D memory spaces** you can walk through:
- Automatic scene generation from single images
- Ambient soundscapes and AI-generated narration
- Shareable memory museums for families
- VR/AR immersive experiences

### This Prototype
A **lean MVP** demonstrating the core experience:
- Upload flow (client-side simulation)
- Immersive 3D navigation with Pannellum
- Professional emotional design
- Perfect for **UX validation** and **investor demos**

### Production Roadmap
- AI-powered 3D reconstruction (NeRF + generative modeling)
- Voice-to-narration audio
- User authentication & memory storage
- Mobile app + VR/AR support

## License

MIT

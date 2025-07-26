# FrameCaption

A modern web application for creating stunning images with text overlays. Add professional captions, titles, and text elements to your photos with an intuitive drag-and-drop interface.

![FrameCaption](https://img.shields.io/badge/FrameCaption-Text%20Overlay%20Editor-blue?style=for-the-badge&logo=next.js)

## ✨ Features

- **Text Overlay Editor**: Add beautiful text overlays to your images with professional styling
- **Layer Management**: Organize multiple text layers with drag-and-drop reordering
- **Typography Controls**: Extensive font options, weights, colors, and spacing controls
- **Image Adjustments**: Brightness and contrast controls for both background and foreground
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Preview**: See changes instantly as you edit
- **Export Options**: Download high-quality PNG images with custom filenames

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/suryanavv/FrameCaption.git
cd FrameCaption
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Adding Text Overlays

1. **Upload an Image**: Click the upload button or drag an image into the editor
2. **Add Text Layers**: Use the "Add" button to create new text layers
3. **Customize Text**: 
   - Change content, font, size, and color
   - Adjust opacity, letter spacing, and line height
   - Position text using the X/Y sliders
4. **Reorder Layers**: Drag layers to change stacking order or use up/down buttons on mobile
5. **Export**: Download your finished image with a custom filename

### Advanced Features

- **Layer Management**: Organize multiple text elements with intuitive controls
- **Typography**: Choose from 30+ Google Fonts with full weight and style options
- **Color Picker**: Use the color picker for precise color selection
- **Image Adjustments**: Fine-tune brightness and contrast for perfect results

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) built on [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Fonts integration
- **Color Picker**: [React Colorful](https://react-colorful.com/)

## 📱 Responsive Design

FrameCaption is fully responsive and optimized for:
- **Desktop**: Full-featured interface with drag-and-drop layer management
- **Mobile**: Touch-optimized controls with up/down buttons for layer reordering
- **Tablet**: Adaptive layout that works on all screen sizes

## 🎨 Customization

### Adding New Fonts

Add new Google Fonts in `components/fonts.ts`:

```typescript
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

### Styling

The app uses a custom design system with:
- CSS variables for theming
- Tailwind CSS for utility classes
- Custom component variants

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy FrameCaption is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy with zero configuration

### Other Platforms

FrameCaption can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build preset
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Deploy with automatic scaling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [shadcn/ui](https://ui.shadcn.com/) for beautiful and customizable React components
- [Lucide](https://lucide.dev/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for typography

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/suryanavv/FrameCaption/issues)
- **Discussions**: [GitHub Discussions](https://github.com/suryanavv/FrameCaption/discussions)
- **Email**: support@framecaption.com

---

Made with ❤️ by the FrameCaption team

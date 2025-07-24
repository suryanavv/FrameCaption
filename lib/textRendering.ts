export interface TextSettings {
    font: string;
    fontSize: number;
    fontWeight?: string | number; // Added fontWeight
    color: string;
    content: string;
    position: { x: number; y: number };
    alignment?: CanvasTextAlign;
    rotation?: number; // in degrees
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    letterSpacing?: number;
    lineHeight?: number;
  }
  
  export function addTextToCanvas(
    ctx: CanvasRenderingContext2D,
    textSettings: TextSettings | TextSettings[],
    activeTextIndex?: number
  ) {
    const layers = Array.isArray(textSettings) ? textSettings : [textSettings];
    for (let i = 0; i < layers.length; i++) {
      const settings = layers[i];
      const {
        font, fontSize, fontWeight = 'normal', color, content, position,
        alignment = 'start', rotation = 0,
        shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
        strokeColor, strokeWidth,
        opacity = 1,
        letterSpacing = 0,
        lineHeight = 1.2,
      } = settings;
      ctx.save();
      ctx.font = `${fontWeight} ${fontSize}px ${font}`;
      ctx.textAlign = alignment;
      ctx.globalAlpha = opacity;
      if (shadowColor) ctx.shadowColor = shadowColor;
      if (shadowBlur) ctx.shadowBlur = shadowBlur;
      if (shadowOffsetX) ctx.shadowOffsetX = shadowOffsetX;
      if (shadowOffsetY) ctx.shadowOffsetY = shadowOffsetY;
      ctx.translate(position.x, position.y);
      if (rotation) ctx.rotate((rotation * Math.PI) / 180);
      // Letter spacing and line height
      const lines = content.split('\n');
      let maxWidth = 0;
      let totalHeight = lines.length * fontSize * lineHeight;
      // Calculate bounding box for indicator
      for (let j = 0; j < lines.length; j++) {
        let lineWidth = 0;
        if (letterSpacing) {
          for (const char of lines[j]) {
            lineWidth += ctx.measureText(char).width + letterSpacing;
          }
        } else {
          lineWidth = ctx.measureText(lines[j]).width;
        }
        if (lineWidth > maxWidth) maxWidth = lineWidth;
      }
      // Draw text
      for (let j = 0; j < lines.length; j++) {
        const x = 0, y = j * fontSize * lineHeight;
        if (letterSpacing) {
          let currentX = x;
          for (const char of lines[j]) {
            ctx.fillStyle = color;
            ctx.fillText(char, currentX, y);
            if (strokeColor && strokeWidth) {
              ctx.lineWidth = strokeWidth;
              ctx.strokeStyle = strokeColor;
              ctx.strokeText(char, currentX, y);
            }
            currentX += ctx.measureText(char).width + letterSpacing;
          }
        } else {
          ctx.fillStyle = color;
          ctx.fillText(lines[j], x, y);
          if (strokeColor && strokeWidth) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(lines[j], x, y);
          }
        }
      }
      // Draw indicator if this is the active text
      if (typeof activeTextIndex === 'number' && i === activeTextIndex) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'oklch(87% 0 0)';
        ctx.lineWidth = 2;
        // Calculate top-left in canvas coordinates
        let boxX = position.x;
        let boxY = position.y;
        if (alignment === 'center') boxX -= maxWidth / 2;
        else if (alignment === 'end' || alignment === 'right') boxX -= maxWidth;
        // Draw rectangle
        ctx.strokeRect(boxX - 4, boxY - fontSize * 0.8, maxWidth + 8, totalHeight + 8);
        ctx.restore();
      }
      ctx.restore();
    }
  }
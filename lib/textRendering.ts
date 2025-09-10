export interface TextSettings {
    font: string;
    fontSize: number;
    fontWeight?: string | number; // Added fontWeight
    fontStyle?: 'normal' | 'italic'; // Added fontStyle for italic
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
    sliderX?: number;
    sliderY?: number;
    // Text shadow properties
    textShadowEnabled?: boolean;
    textShadowColor?: string;
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    textShadowBlur?: number;
    // Layer position property
    onTop?: boolean; // Whether text should be drawn on top of foreground image
    // Text background properties
    textBackgroundEnabled?: boolean;
    textBackgroundColor?: string;
    textBackgroundOpacity?: number;
    textBackgroundPadding?: number;
  }
  
  export function addTextToCanvas(
    ctx: CanvasRenderingContext2D,
    textSettings: TextSettings | TextSettings[],
    activeTextIndex?: number,
    showBorderIndicator: boolean = true,
    allTexts?: TextSettings[],
    globalActiveIndex?: number
  ) {
    const layers = Array.isArray(textSettings) ? textSettings : [textSettings];
    for (let i = 0; i < layers.length; i++) {
      const settings = layers[i];
      const {
        font, fontSize, fontWeight = 'normal', fontStyle = 'normal', color, content, position,
        rotation = 0,
        shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
        strokeColor, strokeWidth,
        opacity = 1,
        letterSpacing = 0,
        lineHeight = 1.2,
        textShadowEnabled = false,
        textShadowColor = '#000000',
        textShadowOffsetX = 2,
        textShadowOffsetY = 2,
        textShadowBlur = 4,
        textBackgroundEnabled = false,
        textBackgroundColor = '#ffffff',
        textBackgroundOpacity = 0.7,
        textBackgroundPadding = 8,
      } = settings;

      // Convert percentage to actual pixel size based on canvas width
      const actualFontSize = (fontSize / 100) * ctx.canvas.width;

      ctx.save();
      ctx.font = `${fontStyle} ${fontWeight} ${actualFontSize}px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
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
      const totalHeight = lines.length * actualFontSize * lineHeight;

      // Calculate text dimensions for background
      let textMaxWidth = 0;
      for (let j = 0; j < lines.length; j++) {
        let lineWidth = 0;
        if (letterSpacing) {
          for (const char of lines[j]) {
            lineWidth += ctx.measureText(char).width + letterSpacing;
          }
        } else {
          lineWidth = ctx.measureText(lines[j]).width;
        }
        if (lineWidth > textMaxWidth) textMaxWidth = lineWidth;
      }

      // Draw text background if enabled
      if (textBackgroundEnabled && content.trim()) {
        ctx.save();
        ctx.globalAlpha = textBackgroundOpacity;
        ctx.fillStyle = textBackgroundColor;
        const bgWidth = textMaxWidth + (textBackgroundPadding * 2);
        const bgHeight = totalHeight + (textBackgroundPadding * 2);
        const bgX = -bgWidth / 2;
        const bgY = -bgHeight / 2;
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        ctx.restore();
      }
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
        const y = (j * actualFontSize * lineHeight) - (totalHeight / 2) + (actualFontSize * lineHeight) / 2;
        // Calculate line width (including letter spacing)
        let lineWidth = 0;
        if (letterSpacing) {
          for (const char of lines[j]) {
            lineWidth += ctx.measureText(char).width + letterSpacing;
          }
        } else {
          lineWidth = ctx.measureText(lines[j]).width;
        }
        // Center the line horizontally
        let currentX = letterSpacing ? -lineWidth / 2 : 0;
        if (letterSpacing) {
          for (const char of lines[j]) {
            // Draw text shadow if enabled
            if (textShadowEnabled) {
              ctx.save();
              ctx.shadowColor = textShadowColor;
              ctx.shadowBlur = textShadowBlur;
              ctx.shadowOffsetX = textShadowOffsetX;
              ctx.shadowOffsetY = textShadowOffsetY;
              ctx.fillStyle = color;
              ctx.fillText(char, currentX, y);
              ctx.restore();
            }
            
            // Draw main text
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
          // Draw text shadow if enabled
          if (textShadowEnabled) {
            ctx.save();
            ctx.shadowColor = textShadowColor;
            ctx.shadowBlur = textShadowBlur;
            ctx.shadowOffsetX = textShadowOffsetX;
            ctx.shadowOffsetY = textShadowOffsetY;
            ctx.fillStyle = color;
            ctx.fillText(lines[j], 0, y);
            ctx.restore();
          }
          
          // Draw main text
          ctx.fillStyle = color;
          ctx.fillText(lines[j], 0, y);
          
          if (strokeColor && strokeWidth) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(lines[j], 0, y);
          }
        }
      }
      // Draw indicator if this is the active text and showBorderIndicator is true
      const shouldShowBorder = showBorderIndicator && 
        (typeof globalActiveIndex === 'number' && allTexts && 
         globalActiveIndex < allTexts.length && 
         allTexts[globalActiveIndex].content === settings.content &&
         allTexts[globalActiveIndex].position.x === settings.position.x &&
         allTexts[globalActiveIndex].position.y === settings.position.y);
      
      if (shouldShowBorder) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.globalAlpha = 1;
        // Calculate top-left in canvas coordinates for center alignment
        const boxX = position.x - maxWidth / 2;
        const boxY = position.y - totalHeight / 2;
        // Draw only border, no fill
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX - 6, boxY - 6, maxWidth + 12, totalHeight + 12, 8);
        ctx.shadowColor = 'rgba(0,0,0,0.10)';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  }
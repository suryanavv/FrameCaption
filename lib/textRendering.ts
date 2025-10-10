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
  
  // Aggressive cache for text measurements and rendering to improve performance
const textMeasurementCache = new Map<string, TextMetrics>();
const textRenderCache = new Map<string, { width: number; height: number; lines: string[] }>();
const getTextMeasurementKey = (text: string, font: string) => `${font}_${text}`;
const getTextRenderKey = (settings: TextSettings) => {
  const { content, font, fontSize, fontWeight, fontStyle, lineHeight } = settings;
  return `${content}_${font}_${fontSize}_${fontWeight}_${fontStyle}_${lineHeight}`;
};

// Function to clear text caches (useful for memory management)
export function clearTextMeasurementCache() {
  textMeasurementCache.clear();
  textRenderCache.clear();
}

export function addTextToCanvas(
    ctx: CanvasRenderingContext2D,
    textSettings: TextSettings | TextSettings[],
    activeTextIndex?: number,
    showBorderIndicator: boolean = true,
    allTexts?: TextSettings[],
    globalActiveIndex?: number,
    isPreview: boolean = false
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

      // Create font string for caching
      const fontString = `${fontStyle} ${fontWeight} ${actualFontSize}px ${font}`;

      ctx.save();
      ctx.font = fontString;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = opacity;
      if (shadowColor) ctx.shadowColor = shadowColor;
      if (shadowBlur) ctx.shadowBlur = shadowBlur;
      if (shadowOffsetX) ctx.shadowOffsetX = shadowOffsetX;
      if (shadowOffsetY) ctx.shadowOffsetY = shadowOffsetY;
      ctx.translate(position.x, position.y);
      if (rotation) ctx.rotate((rotation * Math.PI) / 180);

      // Cached text measurement function
      const measureTextCached = (text: string): TextMetrics => {
        const cacheKey = getTextMeasurementKey(text, fontString);
        let metrics = textMeasurementCache.get(cacheKey);
        if (!metrics) {
          metrics = ctx.measureText(text);
          textMeasurementCache.set(cacheKey, metrics);
          // Limit cache size to prevent memory leaks
          if (textMeasurementCache.size > 1000) {
            const firstKey = textMeasurementCache.keys().next().value;
            if (firstKey) {
              textMeasurementCache.delete(firstKey);
            }
          }
        }
        return metrics;
      };

      // Check render cache first for performance boost
      const renderKey = getTextRenderKey(settings);
      const cachedRender = textRenderCache.get(renderKey);

      let lines: string[];
      let maxWidth = 0;
      let totalHeight = 0;

      if (cachedRender) {
        lines = cachedRender.lines;
        maxWidth = cachedRender.width;
        totalHeight = cachedRender.height;
      } else {
        // Calculate text dimensions
        lines = content.split('\n');
        totalHeight = lines.length * actualFontSize * lineHeight;

        // Calculate max width for caching
        for (let j = 0; j < lines.length; j++) {
          const lineWidth = measureTextCached(lines[j]).width;
          if (lineWidth > maxWidth) maxWidth = lineWidth;
        }

        // Cache the render info
        textRenderCache.set(renderKey, {
          width: maxWidth,
          height: totalHeight,
          lines: lines
        });

        // Limit render cache size
        if (textRenderCache.size > 500) {
          const firstKey = textRenderCache.keys().next().value;
          if (firstKey) {
            textRenderCache.delete(firstKey);
          }
        }
      }

      const isSingleLine = lines.length === 1;

      // Fast path for single-line text (most common case)
      if (isSingleLine) {
        const lineWidth = measureTextCached(lines[0]).width;
        maxWidth = lineWidth;
        
        // Draw text background if enabled (simplified for single line)
        if (textBackgroundEnabled && content.trim()) {
          ctx.save();
          ctx.globalAlpha = textBackgroundOpacity;
          ctx.fillStyle = textBackgroundColor;
          const bgWidth = lineWidth + (textBackgroundPadding * 2);
          const bgHeight = actualFontSize * lineHeight + (textBackgroundPadding * 2);
          ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);
          ctx.restore();
        }
        
        // Draw text shadow if enabled (reduce blur during preview for performance)
        if (textShadowEnabled) {
          ctx.save();
          ctx.shadowColor = textShadowColor;
          ctx.shadowBlur = isPreview ? Math.min(textShadowBlur, 2) : textShadowBlur;
          ctx.shadowOffsetX = textShadowOffsetX;
          ctx.shadowOffsetY = textShadowOffsetY;
          ctx.fillStyle = color;
          ctx.fillText(lines[0], 0, 0);
          ctx.restore();
        }

        // Draw main text
        ctx.fillStyle = color;
        ctx.fillText(lines[0], 0, 0);

        if (strokeColor && strokeWidth) {
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = strokeColor;
          ctx.strokeText(lines[0], 0, 0);
        }
      } else {
        // Multi-line text path
        // Calculate text dimensions for background
        let textMaxWidth = 0;
        for (let j = 0; j < lines.length; j++) {
          const lineWidth = measureTextCached(lines[j]).width;
          if (lineWidth > textMaxWidth) textMaxWidth = lineWidth;
          if (lineWidth > maxWidth) maxWidth = lineWidth;
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
        
        // Draw text lines
        for (let j = 0; j < lines.length; j++) {
          const y = (j * actualFontSize * lineHeight) - (totalHeight / 2) + (actualFontSize * lineHeight) / 2;
          
          // Draw text shadow if enabled (reduce blur during preview)
          if (textShadowEnabled) {
            ctx.save();
            ctx.shadowColor = textShadowColor;
            ctx.shadowBlur = isPreview ? Math.min(textShadowBlur, 2) : textShadowBlur;
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
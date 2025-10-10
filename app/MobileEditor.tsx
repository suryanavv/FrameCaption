import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconDownload, IconUpload, IconRefresh, IconTrash, IconPhoto, IconTypography, IconItalic, IconLayersIntersect, IconBackground, IconArrowNarrowUp } from '@tabler/icons-react';
import { addTextToCanvas, TextSettings, clearTextMeasurementCache } from '@/lib/textRendering';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { inter, poppins, montserrat, playfairDisplay, merriweather, lora, dancingScript, caveat, firaMono, oswald, raleway, ptSerif, nunito, rubik, pacifico } from "@/components/fonts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// Curated 15 fonts with excellent weight support for different styles
const googleFonts = [
    // Clean minimal sans-serif
    { label: "Inter", value: "Inter", className: inter.variable, weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },

    // Warm sans-serif
    { label: "Poppins", value: "Poppins", className: poppins.variable, weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },

    // Geometric sans-serif
    { label: "Montserrat", value: "Montserrat", className: montserrat.variable, weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },

    // Elegant serif display
    { label: "Playfair Display", value: "Playfair Display", className: playfairDisplay.variable, weights: [400, 500, 600, 700, 800, 900] },

    // Book serif
    { label: "Merriweather", value: "Merriweather", className: merriweather.variable, weights: [300, 400, 700, 900] },

    // Formal serif
    { label: "Lora", value: "Lora", className: lora.variable, weights: [400, 500, 600, 700] },

    // Elegant script
    { label: "Dancing Script", value: "Dancing Script", className: dancingScript.variable, weights: [400, 500, 600, 700] },

    // Handwritten casual
    { label: "Caveat", value: "Caveat", className: caveat.variable, weights: [400, 500, 600, 700] },

    // Monospace
    { label: "Fira Mono", value: "Fira Mono", className: firaMono.variable, weights: [400, 500, 700] },

    // Condensed sans
    { label: "Oswald", value: "Oswald", className: oswald.variable, weights: [200, 300, 400, 500, 600, 700] },

    // Calm sans-serif
    { label: "Raleway", value: "Raleway", className: raleway.variable, weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },

    // Readable serif
    { label: "PT Serif", value: "PT Serif", className: ptSerif.variable, weights: [400, 700] },

    // Rounded sans-serif
    { label: "Nunito", value: "Nunito", className: nunito.variable, weights: [200, 300, 400, 500, 600, 700, 800, 900] },

    // Modern geometric
    { label: "Rubik", value: "Rubik", className: rubik.variable, weights: [300, 400, 500, 600, 700, 800, 900] },

    // Decorative script
    { label: "Pacifico", value: "Pacifico", className: pacifico.variable, weights: [400] },
];

interface MobileEditorProps {
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<File | null>>;
    originalImage: HTMLImageElement | null;
    setOriginalImage: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>;
    foregroundImage: HTMLCanvasElement | null;
    setForegroundImage: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
    texts: TextSettings[];
    setTexts: React.Dispatch<React.SetStateAction<TextSettings[]>>;
    activeTextIndex: number;
    setActiveTextIndex: React.Dispatch<React.SetStateAction<number>>;
    bgBrightness: number;
    setBgBrightness: React.Dispatch<React.SetStateAction<number>>;
    bgContrast: number;
    setBgContrast: React.Dispatch<React.SetStateAction<number>>;
    bgBlur: number;
    setBgBlur: React.Dispatch<React.SetStateAction<number>>;
    useCustomBg: boolean;
    setUseCustomBg: React.Dispatch<React.SetStateAction<boolean>>;
    customBgColor: string;
    setCustomBgColor: React.Dispatch<React.SetStateAction<string>>;
    fgBrightness: number;
    setFgBrightness: React.Dispatch<React.SetStateAction<number>>;
    fgContrast: number;
    setFgContrast: React.Dispatch<React.SetStateAction<number>>;
    fgBlur: number;
    setFgBlur: React.Dispatch<React.SetStateAction<number>>;
    activeTab: "text" | "image";
    setActiveTab: React.Dispatch<React.SetStateAction<"text" | "image">>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    drawCanvas: () => void;
    drawCanvasForExport: () => void;
    handleTextChange: (key: keyof TextSettings, value: TextSettings[keyof TextSettings]) => void;
    addText: () => void;
    deleteText: (index: number) => void;

    resetImageEdits: () => void;
    resetTextEdits: () => void;
    tryAnotherImage: () => void;
    generateUniqueFilename: () => string;
    activeText: TextSettings;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    processingStep: string;
    setProcessingStep: React.Dispatch<React.SetStateAction<string>>;
}



export default function MobileEditor(props: MobileEditorProps) {
    // Use props instead of local state/handlers
    const {
        image, originalImage, foregroundImage,
        texts, setTexts, activeTextIndex, setActiveTextIndex, bgBrightness, setBgBrightness,
        bgContrast, setBgContrast, bgBlur, setBgBlur, useCustomBg, setUseCustomBg, customBgColor, setCustomBgColor, fgBrightness, setFgBrightness, fgContrast, setFgContrast, fgBlur, setFgBlur,
        activeTab, setActiveTab, canvasRef, handleImageUpload, drawCanvas, drawCanvasForExport, handleTextChange,
        addText, deleteText, resetImageEdits, resetTextEdits,
        tryAnotherImage, activeText, loading, processingStep, generateUniqueFilename
    } = props;


    const [isMobile, setIsMobile] = useState(false);

    // Animation frame ref for smooth updates
    const animationFrameRef = useRef<number | null>(null);

    // Debounce ref for mobile slider performance
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Frame skipping for ultra-smooth performance
    const lastDrawTimeRef = useRef<number>(0);

    // Dynamic viewport height for mobile browsers
    const [viewportHeight, setViewportHeight] = useState('100vh');

    // Calculate actual viewport height for mobile browsers
    const updateViewportHeight = useCallback(() => {
        // Small debounce to prevent excessive updates during rapid changes
        const update = () => {
            // Use visual viewport if available (better for mobile browsers)
            if (typeof window !== 'undefined' && window.visualViewport) {
                const height = window.visualViewport.height;
                setViewportHeight(`${height}px`);
            } else {
                // Fallback to window.innerHeight
                setViewportHeight(`${window.innerHeight}px`);
            }
        };

        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(update);
    }, []);

    // Optimized mobile text change handler with fixed 16ms debouncing (60fps cap)
    const handleMobileTextChange = useCallback((key: keyof TextSettings, value: TextSettings[keyof TextSettings]) => {
        // Clear any pending debounce
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Ultra-fast 12ms debounce for maximum responsiveness on all devices
        debounceTimeoutRef.current = setTimeout(() => {
            handleTextChange(key, value);
        }, 12);
    }, [handleTextChange]);

    // Add moveTextLayerUp and moveTextLayerDown functions for mobile
    const moveTextLayerUp = (index: number) => {
        if (index <= 0) return;
        const newTexts = [...texts];
        [newTexts[index - 1], newTexts[index]] = [newTexts[index], newTexts[index - 1]];
        setTexts(newTexts);
        setActiveTextIndex(index - 1);
    };

    const moveTextLayerDown = (index: number) => {
        if (index >= texts.length - 1) return;
        const newTexts = [...texts];
        [newTexts[index], newTexts[index + 1]] = [newTexts[index + 1], newTexts[index]];
        setTexts(newTexts);
        setActiveTextIndex(index + 1);
    };

    // Create a mobile-specific download function that uses drawCanvasForExport
    const downloadImageForMobile = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Draw canvas for export (without border indicator)
        drawCanvasForExport();

        // Use JPEG format with quality 0.7 for smaller file sizes on mobile
        const quality = 0.7;

        const link = document.createElement('a');
        const filename = generateUniqueFilename().replace('.png', '.jpg');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', quality);
        link.click();
        
        // Cleanup blob URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);

        // Redraw canvas with border indicator for editing
        drawCanvas();
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    // Add state for new coordinate system
    // Remove global sliderX, sliderY state
    // Instead, store sliderX and sliderY in each text object
    // When switching activeTextIndex, update the sliders to match the active text's position
    // When moving sliders, only update the active text's position
    // On text add, initialize with sliderX: 0, sliderY: 0
    // Remove any useState for sliderX/sliderY and any references to setSliderX/setSliderY. Only use activeText.sliderX and handleTextChange('sliderX', val).

    // Performance optimization state (currently unused but kept for future optimizations)

    // Optimized local drawing function with requestAnimationFrame and performance optimizations
    const localDrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImage || !foregroundImage) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false
        });
        if (!ctx) return;

        // Frame skipping: skip frames if drawing too frequently (<8ms between draws)
        const now = performance.now();
        if (now - lastDrawTimeRef.current < 8) return;
        lastDrawTimeRef.current = now;

        // Memory pressure detection and cache clearing
        if (typeof performance !== 'undefined' && (performance as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory) {
            const memInfo = (performance as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
            if (memInfo) {
                const memoryPressure = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                if (memoryPressure > 0.7) {
                    clearTextMeasurementCache();
                }
            }
        }

        // Cancel any pending animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Schedule the draw operation with performance optimization
        animationFrameRef.current = requestAnimationFrame(() => {
            // Performance optimization: Use consistent quality for smooth rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            canvas.width = originalImage.width;
            canvas.height = originalImage.height;

            // Draw background
            if (useCustomBg) {
                // Draw custom colored background
                ctx.fillStyle = customBgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                if (bgBlur > 0) {
                    ctx.filter = `blur(${bgBlur}px)`;
                }
            } else {
                // Draw original background with filters
                ctx.filter = `brightness(${bgBrightness}%) contrast(${bgContrast}%) ${bgBlur > 0 ? `blur(${bgBlur}px)` : ''}`.trim();
                ctx.drawImage(originalImage, 0, 0);
            }
            ctx.filter = 'none';

            // Separate texts by layer position
            const behindTexts = texts.filter(t => !t.onTop);
            const onTopTexts = texts.filter(t => t.onTop);

            // Draw texts behind foreground
            const centeredBehindTexts = behindTexts.map((t) => ({
                ...t,
                position: {
                    x: t.position.x,
                    y: t.position.y
                }
            }));
            addTextToCanvas(ctx, centeredBehindTexts, undefined, true, texts, activeTextIndex, true); // Preview mode for performance

            ctx.filter = `brightness(${fgBrightness}%) contrast(${fgContrast}%) ${fgBlur > 0 ? `blur(${fgBlur}px)` : ''}`.trim();
            ctx.drawImage(foregroundImage, 0, 0);
            ctx.filter = 'none';

            // Draw texts on top of foreground
            const centeredOnTopTexts = onTopTexts.map((t) => ({
                ...t,
                position: {
                    x: t.position.x,
                    y: t.position.y
                }
            }));
            addTextToCanvas(ctx, centeredOnTopTexts, undefined, true, texts, activeTextIndex, true); // Preview mode for performance
        });
    }, [originalImage, foregroundImage, texts, bgBrightness, bgContrast, bgBlur, useCustomBg, customBgColor, fgBrightness, fgContrast, fgBlur, activeTextIndex, canvasRef]);

    useEffect(() => {
        localDrawCanvas();
    }, [localDrawCanvas]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Handle dynamic viewport height for mobile browsers
    useEffect(() => {
        // Initial height calculation
        updateViewportHeight();

        // Listen for viewport changes
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewportHeight);
            window.visualViewport.addEventListener('scroll', updateViewportHeight);
        }

        // Fallback listeners for browsers without visualViewport
        window.addEventListener('resize', updateViewportHeight);
        window.addEventListener('orientationchange', () => {
            // Delay to allow orientation change to complete
            setTimeout(updateViewportHeight, 100);
        });

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewportHeight);
                window.visualViewport.removeEventListener('scroll', updateViewportHeight);
            }
            window.removeEventListener('resize', updateViewportHeight);
            window.removeEventListener('orientationchange', updateViewportHeight);
        };
    }, [updateViewportHeight]);

    // Cleanup animation frames and debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    // Create a ref for a hidden canvas for measuring
    const measureCanvasRef = useRef<HTMLCanvasElement>(null);



    // Remove debounce logic from the effect that updates text position from sliderX/sliderY.
    useEffect(() => {
        if (!originalImage) return;
        const width = originalImage.width;
        const height = originalImage.height;
        const pixels_per_unit_X = width / 200;
        const pixels_per_unit_Y = height / 200;
        const pixel_offset_X = (activeText.sliderX ?? 0) * pixels_per_unit_X;
        const pixel_offset_Y = (activeText.sliderY ?? 0) * pixels_per_unit_Y;
        const target_x = (width / 2) + pixel_offset_X;
        const target_y = (height / 2) + pixel_offset_Y;
        setTexts(prev => {
            const newTexts = [...prev];
            newTexts[activeTextIndex] = {
                ...newTexts[activeTextIndex],
                position: { x: target_x, y: target_y }
            };
            return newTexts;
        });
    }, [activeText.sliderX, activeText.sliderY, activeTextIndex, originalImage, setTexts]);

    // Remove calculation of textBox, canvasCenterX, canvasCenterY, rangeX, rangeY, offsetX, offsetY, horizontalPercent, verticalPercent, handleHorizontalSlider, handleVerticalSlider, and all JSX for horizontal/vertical position sliders.

    return (
        <div
            className="w-full bg-background overflow-hidden flex flex-col"
            style={{ height: viewportHeight }}
        >
            {/* Sticky Header with gap and rounded corners */}
            <div className="flex-shrink-0 p-2">
                <header className="flex h-10 items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-md rounded-[var(--radius-sm)] overflow-hidden border-b border-[var(--border)] w-full max-w-full mx-auto">
                    <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                        <Image src="/icon.svg" alt="FrameCaption" width={20} height={20} />
                        FrameCaption
                    </h1>
                    {isMobile && <AnimatedThemeToggler className="absolute right-2 top-1/2 -translate-y-1/2" />}
                </header>
            </div>

            {/* Flexible Canvas Area */}
            <div className="flex-1 flex flex-col px-2 pb-2 min-h-0">
                {!image ? (
                    <div className="flex flex-col flex-1 w-full mx-auto items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border-b border-[var(--border)] overflow-hidden relative">
                        <IconUpload className="w-12 h-12 md:w-16 md:h-16 text-[var(--primary)] mb-4 md:mb-6" />
                        <h1 className="text-xs font-semibold mb-2">Upload Your Image</h1>
                        <p className="text-[var(--muted-foreground)] mb-4 md:mb-6 text-center text-xs px-4">Choose an image to add text behind elements</p>
                        <Button onClick={() => document.getElementById('image-upload')?.click()} className="h-10 w-auto text-xs flex items-center gap-2 cursor-pointer">
                            <IconUpload className="w-4 h-4" />
                            Upload Image
                        </Button>
                        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                ) : (
                    <section className="flex flex-col flex-1 w-full items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border-b border-[var(--border)] overflow-hidden relative min-h-0">
                        {loading && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/60 backdrop-blur-sm animate-fade-in">
                                <span className="text-lg font-semibold text-[var(--foreground)] animate-pulse">
                                    {processingStep || 'Processing image...'}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 w-full overflow-hidden flex items-center justify-center min-h-0">
                            <canvas
                                ref={canvasRef}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        {/* Floating Download Dock - Mobile/Tablet (smaller) */}
                        <div className="fixed bottom-0.5 left-1/2 -translate-x-1/2 z-40 flex lg:hidden bg-[var(--secondary)]/95 backdrop-blur-md rounded-[var(--radius-lg)] shadow-xl border border-[var(--border)] p-1 gap-1 items-center">
                            <Button
                                onClick={downloadImageForMobile}
                                className="h-8 flex-1 flex items-center justify-center gap-1 text-[0.7rem] cursor-pointer border border-[var(--border)] bg-primary hover:bg-primary/80 text-primary-foreground rounded-[var(--radius-sm)] transition-colors"
                            >
                                <IconDownload className="w-3.5 h-3.5" />
                                Download
                            </Button>
                            <Button
                                onClick={tryAnotherImage}
                                className="h-8 flex-1 flex items-center justify-center gap-1 text-[0.7rem] cursor-pointer border border-[var(--border)] bg-background text-foreground hover:bg-background/80 rounded-[var(--radius-sm)] transition-colors"
                            >
                                <IconRefresh className="w-3.5 h-3.5" />
                                Try Another
                            </Button>
                        </div>
                    </section>
                )}
            </div>
            {/* Flexible Tabs Content section */}
            <div className="flex-1 flex flex-col px-2 pb-2 min-h-0">
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as 'text' | 'image')}
                    className="flex flex-col flex-1 w-full min-h-0"
                >
                    {/* Tabs Content first */}
                    <TabsList className="flex-shrink-0 w-full flex items-center gap-1 h-10 rounded-[var(--radius-sm)]">
                        <TabsTrigger
                            value="text"
                            className="flex-1 h-10 text-xs border border-[var(--border)] p-1 items-center justify-center gap-0.5 min-h-0 rounded-[var(--radius-sm)] cursor-pointer"
                        >
                            <IconTypography className="w-2.5 h-2.5" />
                            <span className="text-[0.625rem]">Text</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="image"
                            className="flex-1 h-10 text-xs border border-[var(--border)] p-1 items-center justify-center gap-0.5 min-h-0 rounded-[var(--radius-sm)] cursor-pointer"
                        >
                            <IconPhoto className="w-2.5 h-2.5" />
                            <span className="text-[0.625rem]">Image</span>
                        </TabsTrigger>
                    </TabsList>
                    <section className="flex-1 w-full mt-2 bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] flex flex-col border border-[var(--border)] min-h-0">
                        {/* Scrollable Content Area */}
                        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar p-3 min-h-0">
                            {activeTab === 'text' && (
                                <div className="flex flex-col gap-4"> {/* Remove pb-14 */}
                                    {/* Text Layers */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Text Layers</Label>
                                            <Button variant="outline" size="sm" onClick={addText} className="w-full text-xs h-7 px-2 cursor-pointer">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="space-y-1">
                                            {texts.slice().reverse().map((text, index) => {
                                                const originalIndex = texts.length - 1 - index;
                                                return (
                                                    <div key={originalIndex} className={`flex items-center justify-between p-2 rounded-[var(--radius-sm)] cursor-pointer transition-all ${activeTextIndex === originalIndex ? 'bg-primary/10' : 'hover:bg-primary/5'}`} onClick={() => setActiveTextIndex(originalIndex)}>
                                                        <span className="truncate text-xs" style={{ fontFamily: text.font }}>{text.content}</span>
                                                        <div className="flex items-center gap-1">
                                                            {/* Mobile: Up/Down controls (fixed for reversed order) */}
                                                            <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer" onClick={e => { e.stopPropagation(); moveTextLayerDown(originalIndex); }} disabled={originalIndex === texts.length - 1} aria-label="Move up">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-5 w-5 cursor-pointer" onClick={e => { e.stopPropagation(); moveTextLayerUp(originalIndex); }} disabled={originalIndex === 0} aria-label="Move down">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteText(originalIndex) }} className="h-5 w-5 cursor-pointer">
                                                                <IconTrash className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Layer Position Switch */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <IconArrowNarrowUp className="w-4 h-4 text-[var(--muted-foreground)]" />
                                            <Label className="text-xs text-[var(--muted-foreground)]">On Top</Label>
                                        </div>
                                        <Switch
                                            checked={activeText.onTop ?? false}
                                            onCheckedChange={(checked) => handleTextChange('onTop', checked)}
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-[var(--muted-foreground)]">Content</Label>
                                        <Textarea
                                            value={activeText.content}
                                            onChange={(e) => handleTextChange('content', e.target.value)}
                                            className="min-h-[50px] resize-none text-xs"
                                            placeholder="Enter your text"
                                        />
                                    </div>

                                    {/* Font Selection */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-[var(--muted-foreground)]">Font</Label>
                                        <Select value={activeText.font} onValueChange={(value) => handleTextChange('font', value)}>
                                            <SelectTrigger className="w-full h-9 text-xs">
                                                <SelectValue placeholder="Select font" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px] overflow-y-auto">
                                                {googleFonts.map(f => (
                                                    <SelectItem key={f.value} value={f.value} className={f.className}>
                                                        <span style={{ fontFamily: f.value }} className="text-xs">{f.label}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>


                                    {/* Font Style Switch */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <IconItalic className="w-4 h-4 text-[var(--muted-foreground)]" />
                                            <Label className="text-xs text-[var(--muted-foreground)]">Italic</Label>
                                        </div>
                                        <Switch
                                            checked={activeText.fontStyle === 'italic'}
                                            onCheckedChange={(checked) => handleTextChange('fontStyle', checked ? 'italic' : 'normal')}
                                        />
                                    </div>

                                    <Separator />


                                    {/* Color */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label className="text-xs text-[var(--muted-foreground)]">Color</Label>
                                        <div className="flex items-center gap-2 w-full relative">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <span
                                                        className="w-6 h-6 rounded-full aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                        style={{ backgroundColor: activeText.color }}
                                                    />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-2" align="start">
                                                    <HexColorPicker
                                                        color={activeText.color}
                                                        onChange={(color) => handleTextChange('color', color)}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                className="pl-10 h-9 text-xs"
                                                type="text"
                                                value={activeText.color.startsWith("#") ? activeText.color : `#${activeText.color}`}
                                                placeholder="Color"
                                                onChange={(e) => {
                                                    const color = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                                                    handleTextChange('color', color);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Typography Controls */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Font Weight: {parseInt(activeText.fontWeight?.toString() ?? '700')}</Label>
                                            <Slider
                                                value={[parseInt(activeText.fontWeight?.toString() ?? '700')]}
                                                onValueChange={([val]) => handleMobileTextChange('fontWeight', val.toString())}
                                                min={100}
                                                max={900}
                                                step={100}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Font Size: {activeText.fontSize}%</Label>
                                            <Slider
                                                value={[activeText.fontSize]}
                                                onValueChange={([val]) => handleMobileTextChange('fontSize', val)}
                                                min={5}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Opacity: {Math.round((activeText.opacity ?? 1) * 100)}%</Label>
                                            <Slider
                                                value={[activeText.opacity ?? 1]}
                                                onValueChange={([val]) => handleMobileTextChange('opacity', val)}
                                                max={1}
                                                step={0.01}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Line Height: {activeText.lineHeight ?? 1.2}</Label>
                                            <Slider
                                                value={[activeText.lineHeight ?? 1.2]}
                                                onValueChange={([val]) => handleMobileTextChange('lineHeight', val)}
                                                max={3}
                                                min={-3}
                                                step={0.1}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Match desktop X/Y sliders for text position */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label className="text-xs text-[var(--muted-foreground)] mb-1">Text Position</Label>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Horizontal (X): {activeText.sliderX ?? 0}</Label>
                                            <Slider
                                                value={[activeText.sliderX ?? 0]}
                                                onValueChange={([val]) => handleMobileTextChange('sliderX', val)}
                                                min={-100}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Vertical (Y): {activeText.sliderY ?? 0}</Label>
                                            <Slider
                                                value={[activeText.sliderY ?? 0]}
                                                onValueChange={([val]) => handleMobileTextChange('sliderY', val)}
                                                min={-100}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Text Shadow Section */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconLayersIntersect className="w-4 h-4 text-[var(--muted-foreground)]" />
                                                <Label className="text-xs text-[var(--muted-foreground)]">Text Shadow</Label>
                                            </div>
                                            <Switch
                                                checked={activeText.textShadowEnabled ?? false}
                                                onCheckedChange={(checked) => handleTextChange('textShadowEnabled', checked)}
                                            />
                                        </div>

                                        {activeText.textShadowEnabled && (
                                            <>
                                                {/* Shadow Color */}
                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Shadow Color</Label>
                                                    <div className="flex items-center gap-2 w-full relative">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <span
                                                                    className="w-6 h-6 rounded-full aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                                    style={{ backgroundColor: activeText.textShadowColor ?? '#000000' }}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-2" align="start">
                                                                <HexColorPicker
                                                                    color={activeText.textShadowColor ?? '#000000'}
                                                                    onChange={(color) => handleTextChange('textShadowColor', color)}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            className="pl-10 h-9 text-xs"
                                                            type="text"
                                                            value={(activeText.textShadowColor ?? '#000000').startsWith("#") ? (activeText.textShadowColor ?? '#000000') : `#${activeText.textShadowColor ?? '#000000'}`}
                                                            placeholder="Shadow Color"
                                                            onChange={(e) => {
                                                                const color = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                                                                handleTextChange('textShadowColor', color);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Shadow Position and Blur */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Shadow X Offset: {activeText.textShadowOffsetX ?? 2}px</Label>
                                                        <Slider
                                                            value={[activeText.textShadowOffsetX ?? 2]}
                                                            onValueChange={([val]) => handleMobileTextChange('textShadowOffsetX', val)}
                                                            min={-20}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Shadow Y Offset: {activeText.textShadowOffsetY ?? 2}px</Label>
                                                        <Slider
                                                            value={[activeText.textShadowOffsetY ?? 2]}
                                                            onValueChange={([val]) => handleMobileTextChange('textShadowOffsetY', val)}
                                                            min={-20}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Shadow Blur: {activeText.textShadowBlur ?? 4}px</Label>
                                                        <Slider
                                                            value={[activeText.textShadowBlur ?? 4]}
                                                            onValueChange={([val]) => handleMobileTextChange('textShadowBlur', val)}
                                                            min={0}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Text Background Section */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconBackground className="w-4 h-4 text-[var(--muted-foreground)]" />
                                                <Label className="text-xs text-[var(--muted-foreground)]">Text Background</Label>
                                            </div>
                                            <Switch
                                                checked={activeText.textBackgroundEnabled ?? false}
                                                onCheckedChange={(checked) => handleTextChange('textBackgroundEnabled', checked)}
                                            />
                                        </div>

                                        {activeText.textBackgroundEnabled && (
                                            <>
                                                {/* Background Color */}
                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Background Color</Label>
                                                    <div className="flex items-center gap-2 w-full relative">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <span
                                                                    className="w-6 h-6 rounded-full aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                                    style={{ backgroundColor: activeText.textBackgroundColor ?? '#ffffff' }}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-2" align="start">
                                                                <HexColorPicker
                                                                    color={activeText.textBackgroundColor ?? '#ffffff'}
                                                                    onChange={(color) => handleTextChange('textBackgroundColor', color)}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            className="pl-10 h-9 text-xs"
                                                            type="text"
                                                            value={(activeText.textBackgroundColor ?? '#ffffff').startsWith("#") ? (activeText.textBackgroundColor ?? '#ffffff') : `#${activeText.textBackgroundColor ?? '#ffffff'}`}
                                                            placeholder="Background Color"
                                                            onChange={(e) => {
                                                                const color = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                                                                handleTextChange('textBackgroundColor', color);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Background Opacity */}
                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Background Opacity: {Math.round((activeText.textBackgroundOpacity ?? 0.7) * 100)}%</Label>
                                                    <Slider
                                                        value={[activeText.textBackgroundOpacity ?? 0.7]}
                                                        onValueChange={([val]) => handleMobileTextChange('textBackgroundOpacity', val)}
                                                        max={1}
                                                        step={0.01}
                                                    />
                                                </div>

                                                {/* Background Padding */}
                                                <div className="flex flex-col gap-2">
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Background Padding: {activeText.textBackgroundPadding ?? 8}px</Label>
                                                    <Slider
                                                        value={[activeText.textBackgroundPadding ?? 8]}
                                                        onValueChange={([val]) => handleMobileTextChange('textBackgroundPadding', val)}
                                                        min={0}
                                                        max={50}
                                                        step={1}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <Separator />


                                </div>
                            )}
                            {activeTab === 'image' && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4">
                                        <Label className="text-xs text-[var(--muted-foreground)] font-medium">Background</Label>
                                        <div className="flex flex-col gap-3">
                                            {/* Custom Background Toggle */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <IconBackground className="w-4 h-4 text-[var(--muted-foreground)]" />
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Custom Background</Label>
                                                </div>
                                                <Switch
                                                    checked={useCustomBg}
                                                    onCheckedChange={setUseCustomBg}
                                                />
                                            </div>

                                            {/* Custom Background Color Picker */}
                                            {useCustomBg && (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <Label className="text-xs text-[var(--muted-foreground)]">Background Color</Label>
                                                    <div className="flex items-center gap-2 w-full relative">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <span
                                                                    className="w-6 h-6 rounded-full aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                                    style={{ backgroundColor: customBgColor }}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-2" align="start">
                                                                <HexColorPicker
                                                                    color={customBgColor}
                                                                    onChange={setCustomBgColor}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            className="pl-10 h-9 text-xs"
                                                            type="text"
                                                            value={customBgColor}
                                                            placeholder="Background Color"
                                                            onChange={(e) => setCustomBgColor(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Background Filters (only show when not using custom background) */}
                                            {!useCustomBg && (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Brightness: {bgBrightness}%</Label>
                                                        <Slider
                                                            value={[bgBrightness]}
                                                            onValueChange={([val]) => setBgBrightness(val)}
                                                            max={200}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Contrast: {bgContrast}%</Label>
                                                        <Slider
                                                            value={[bgContrast]}
                                                            onValueChange={([val]) => setBgContrast(val)}
                                                            max={200}
                                                            step={1}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Blur (always available) */}
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs text-[var(--muted-foreground)]">Blur: {bgBlur}px</Label>
                                                <Slider
                                                    value={[bgBlur]}
                                                    onValueChange={([val]) => setBgBlur(val)}
                                                    max={50}
                                                    step={1}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-4">
                                        <Label className="text-xs text-[var(--muted-foreground)] font-medium">Foreground</Label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs text-[var(--muted-foreground)]">Brightness: {fgBrightness}%</Label>
                                                <Slider
                                                    value={[fgBrightness]}
                                                    onValueChange={([val]) => setFgBrightness(val)}
                                                    max={200}
                                                    step={1}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs text-[var(--muted-foreground)]">Contrast: {fgContrast}%</Label>
                                                <Slider
                                                    value={[fgContrast]}
                                                    onValueChange={([val]) => setFgContrast(val)}
                                                    max={200}
                                                    step={1}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="text-xs text-[var(--muted-foreground)]">Blur: {fgBlur}px</Label>
                                                <Slider
                                                    value={[fgBlur]}
                                                    onValueChange={([val]) => setFgBlur(val)}
                                                    max={50}
                                                    step={1}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            )}
                        </div>
                        {/* Fixed Reset Button */}
                        <div className="flex-shrink-0 p-2 border-t border-[var(--border)] bg-[var(--secondary)]/30">
                            {activeTab === 'text' && (
                                <Button variant="outline" size="sm" onClick={resetTextEdits} className="w-full h-9 text-xs bg-background hover:bg-accent cursor-pointer">
                                    <IconRefresh className="w-3 h-3 mr-1" />
                                    Reset Text
                                </Button>
                            )}
                            {activeTab === 'image' && (
                                <Button variant="outline" size="sm" onClick={resetImageEdits} className="w-full h-9 text-xs bg-background hover:bg-accent cursor-pointer">
                                    <IconRefresh className="w-3 h-3 mr-1" />
                                    Reset Image
                                </Button>
                            )}
                        </div>
                    </section>
                </Tabs>
            </div>
            <Toaster />


            {/* In the JSX, add a hidden canvas for measuring */}
            <canvas ref={measureCanvasRef} style={{ display: 'none' }} />
        </div>
    );
} 
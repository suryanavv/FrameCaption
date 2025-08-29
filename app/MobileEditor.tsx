import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, RefreshCw, Trash2, Image as ImageIcon, Type, Italic, Layers, MoveUp } from 'lucide-react';
import { addTextToCanvas, TextSettings } from '@/lib/textRendering';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { poppins, inter, manrope, montserrat, geist, bricolage, funnelSans, funnelDisplay, onest, spaceGrotesk, dmSerifDisplay, instrumentSerif, lora, msMadi, geistMono, spaceMono, roboto, openSans, lato, merriweather, playfairDisplay, rubik, nunito, oswald, raleway, ptSerif, cabin, quicksand, firaMono, jetbrainsMono, dancingScript, pacifico, caveat, satisfy, indieFlower, greatVibes, shadowsIntoLight } from "@/components/fonts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

// Onest is now the global app font
const googleFonts = [
    // Sans-serif fonts
    { label: "Bricolage Grotesque", value: "Bricolage Grotesque", className: bricolage.variable },
    { label: "Funnel Display", value: "Funnel Display", className: funnelDisplay.variable },
    { label: "Funnel Sans", value: "Funnel Sans", className: funnelSans.variable },
    { label: "Geist", value: "Geist", className: geist.variable },
    { label: "Inter", value: "Inter", className: inter.variable },
    { label: "Lato", value: "Lato", className: lato.variable },
    { label: "Manrope", value: "Manrope", className: manrope.variable },
    { label: "Montserrat", value: "Montserrat", className: montserrat.variable },
    { label: "Nunito", value: "Nunito", className: nunito.variable },
    { label: "Onest", value: "Onest", className: onest.variable },
    { label: "Open Sans", value: "Open Sans", className: openSans.variable },
    { label: "Oswald", value: "Oswald", className: oswald.variable },
    { label: "Poppins", value: "Poppins", className: poppins.variable },
    { label: "Quicksand", value: "Quicksand", className: quicksand.variable },
    { label: "Raleway", value: "Raleway", className: raleway.variable },
    { label: "Roboto", value: "Roboto", className: roboto.variable },
    { label: "Rubik", value: "Rubik", className: rubik.variable },
    { label: "Space Grotesk", value: "Space Grotesk", className: spaceGrotesk.variable },
    
    // Serif fonts
    { label: "Cabin", value: "Cabin", className: cabin.variable },
    { label: "DM Serif Display", value: "DM Serif Display", className: dmSerifDisplay.variable },
    { label: "Instrument Serif", value: "Instrument Serif", className: instrumentSerif.variable },
    { label: "Lora", value: "Lora", className: lora.variable },
    { label: "Merriweather", value: "Merriweather", className: merriweather.variable },
    { label: "Ms Madi", value: "Ms Madi", className: msMadi.variable },
    { label: "Playfair Display", value: "Playfair Display", className: playfairDisplay.variable },
    { label: "PT Serif", value: "PT Serif", className: ptSerif.variable },
    
    // Monospace fonts
    { label: "Fira Mono", value: "Fira Mono", className: firaMono.variable },
    { label: "Geist Mono", value: "Geist Mono", className: geistMono.variable },
    { label: "JetBrains Mono", value: "JetBrains Mono", className: jetbrainsMono.variable },
    { label: "Space Mono", value: "Space Mono", className: spaceMono.variable },
    
    // Handwritten/Script fonts
    { label: "Caveat", value: "Caveat", className: caveat.variable },
    { label: "Dancing Script", value: "Dancing Script", className: dancingScript.variable },
    { label: "Great Vibes", value: "Great Vibes", className: greatVibes.variable },
    { label: "Indie Flower", value: "Indie Flower", className: indieFlower.variable },
    { label: "Pacifico", value: "Pacifico", className: pacifico.variable },
    { label: "Satisfy", value: "Satisfy", className: satisfy.variable },
    { label: "Shadows Into Light", value: "Shadows Into Light", className: shadowsIntoLight.variable },
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
    fgBrightness: number;
    setFgBrightness: React.Dispatch<React.SetStateAction<number>>;
    fgContrast: number;
    setFgContrast: React.Dispatch<React.SetStateAction<number>>;
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
}



export default function MobileEditor(props: MobileEditorProps) {
    // Use props instead of local state/handlers
    const {
        image, originalImage, foregroundImage,
        texts, setTexts, activeTextIndex, setActiveTextIndex, bgBrightness, setBgBrightness,
        bgContrast, setBgContrast, fgBrightness, setFgBrightness, fgContrast, setFgContrast,
        activeTab, setActiveTab, canvasRef, handleImageUpload, drawCanvas, drawCanvasForExport, handleTextChange,
        addText, deleteText, resetImageEdits, resetTextEdits,
        tryAnotherImage, activeText, loading, generateUniqueFilename
    } = props;


    const [isMobile, setIsMobile] = useState(false);

    // Animation frame ref for smooth updates
    const animationFrameRef = useRef<number | null>(null);

    // Debounce ref for mobile slider performance
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Optimized mobile text change handler with debouncing
    const handleMobileTextChange = useCallback((key: keyof TextSettings, value: TextSettings[keyof TextSettings]) => {
        // Clear any pending debounce
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce the state update for smooth mobile performance
        debounceTimeoutRef.current = setTimeout(() => {
            handleTextChange(key, value);
        }, 8); // Very short debounce for responsive mobile feel
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

        const link = document.createElement('a');
        link.download = generateUniqueFilename();
        link.href = canvas.toDataURL('image/png');
        link.click();

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

        // Optimized local drawing function with requestAnimationFrame
    const localDrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImage || !foregroundImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cancel any pending animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Schedule the draw operation with performance optimization
        animationFrameRef.current = requestAnimationFrame(() => {
            // Performance optimization: Use image smoothing for better quality on mobile
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.filter = `brightness(${bgBrightness}%) contrast(${bgContrast}%)`;
            ctx.drawImage(originalImage, 0, 0);
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
            addTextToCanvas(ctx, centeredBehindTexts, undefined, true, texts, activeTextIndex); // Show border indicator for editing

            ctx.filter = `brightness(${fgBrightness}%) contrast(${fgContrast}%)`;
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
            addTextToCanvas(ctx, centeredOnTopTexts, undefined, true, texts, activeTextIndex); // Show border indicator for editing
        });
    }, [originalImage, foregroundImage, texts, bgBrightness, bgContrast, fgBrightness, fgContrast, activeTextIndex, canvasRef]);

    useEffect(() => {
        localDrawCanvas();
    }, [localDrawCanvas]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
    }, [activeText.sliderX, activeText.sliderY, activeTextIndex, originalImage?.width, originalImage?.height]);

    // Remove calculation of textBox, canvasCenterX, canvasCenterY, rangeX, rangeY, offsetX, offsetY, horizontalPercent, verticalPercent, handleHorizontalSlider, handleVerticalSlider, and all JSX for horizontal/vertical position sliders.

    return (
        <div className="w-full h-screen bg-background overflow-hidden flex flex-col">
            {/* Sticky Header with gap and rounded corners */}
            <div className="p-2">
                <header className="sticky top-0 z-30 flex h-10 items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-md rounded-[var(--radius-sm)] overflow-hidden border-b border-[var(--border)] w-full max-w-full mx-auto">
                    <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                        <Image src="/icon.svg" alt="FrameCaption" width={20} height={20} />
                        FrameCaption
                    </h1>
                    {isMobile && <AnimatedThemeToggler className="absolute right-2 top-1/2 -translate-y-1/2" />}
                </header>
            </div>

            {/* Sticky Canvas Area below header */}
            <div className="sticky top-[3.25rem] px-2 z-20 mb-2 min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[350px] h-[32vh] max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px]">
                {!image ? (
                    <div className="flex flex-col w-full h-full mx-auto items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border-b border-[var(--border)] overflow-hidden relative">
                        <Upload className="w-12 h-12 md:w-16 md:h-16 text-[var(--primary)] mb-4 md:mb-6" />
                        <h1 className="text-xs font-semibold mb-2">Upload Your Image</h1>
                        <p className="text-[var(--muted-foreground)] mb-4 md:mb-6 text-center text-xs px-4">Choose an image to add text behind elements</p>
                        <Button onClick={() => document.getElementById('image-upload')?.click()} className="h-10 w-auto text-xs flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Image
                        </Button>
                        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                ) : (
                    <section className="flex flex-col w-full h-full items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border-b border-[var(--border)] overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                                <span className="text-lg font-semibold text-white animate-pulse">Processing image...</span>
                                <span className="text-xs text-white/80 mt-2">This may take up to 15 seconds</span>
                            </div>
                        )}
                        <div className="w-full h-full overflow-auto flex items-center justify-center">
                            <canvas
                                ref={canvasRef}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        {/* Mobile/Tablet Download Actions + Move Button */}
                        <div className="flex w-full justify-center p-2 gap-2 relative">
                            <Button onClick={downloadImageForMobile} className="h-9 text-xs flex-1 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                            <Button variant="outline" onClick={tryAnotherImage} className="h-9 text-xs flex-1 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Try Another
                            </Button>
                        </div>
                    </section>
                )}
            </div>
            {/* Sticky Tabs Content section (scrollable within) */}
            <div className="flex-1 min-h-0 flex flex-col w-full px-2 pb-24 sticky top-[calc(3.25rem+32vh)] z-10">
                <aside className="flex flex-col gap-1 w-full max-w-full h-full overflow-hidden">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image')} className="flex flex-col items-center w-full h-full">
                        {/* Tabs Content first */}
                        <section className="w-full bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] flex flex-col min-h-[300px] border border-[var(--border)] mb-10">
                            {/* Scrollable Content Area */}
                            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto no-scrollbar p-3">
                                {activeTab === 'text' && (
                                    <div className="flex flex-col gap-4"> {/* Remove pb-14 */}
                                        {/* Text Layers */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs text-[var(--muted-foreground)]">Text Layers</Label>
                                                <Button variant="outline" size="sm" onClick={addText} className="w-full text-xs h-7 px-2">
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
                                                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => { e.stopPropagation(); moveTextLayerDown(originalIndex); }} disabled={originalIndex === texts.length - 1} aria-label="Move up">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => { e.stopPropagation(); moveTextLayerUp(originalIndex); }} disabled={originalIndex === 0} aria-label="Move down">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteText(originalIndex) }} className="h-5 w-5">
                                                                    <Trash2 className="w-3 h-3" />
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
                                                <MoveUp className="w-4 h-4 text-[var(--muted-foreground)]" />
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
                                                <SelectContent>
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
                                                <Italic className="w-4 h-4 text-[var(--muted-foreground)]" />
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
                                                            className="w-6 h-6 rounded-full cursor-pointer aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2"
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
                                                <Label className="text-xs text-[var(--muted-foreground)]">Font Size: {activeText.fontSize}px</Label>
                                                <Slider
                                                    value={[activeText.fontSize]}
                                                    onValueChange={([val]) => handleMobileTextChange('fontSize', val)}
                                                    max={1000}
                                                    step={10}
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
                                                <Label className="text-xs text-[var(--muted-foreground)]">Letter Spacing: {activeText.letterSpacing ?? 0}px</Label>
                                                <Slider
                                                    value={[activeText.letterSpacing ?? 0]}
                                                    onValueChange={([val]) => handleMobileTextChange('letterSpacing', val)}
                                                    max={50}
                                                    min={-50}
                                                    step={1}
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
                                                    <Layers className="w-4 h-4 text-[var(--muted-foreground)]" />
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
                                                                        className="w-6 h-6 rounded-full cursor-pointer aspect-square border border-[var(--border)] absolute left-2 top-1/2 -translate-y-1/2"
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


                                    </div>
                                )}
                                {activeTab === 'image' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-4">
                                            <Label className="text-xs text-[var(--muted-foreground)] font-medium">Background</Label>
                                            <div className="flex flex-col gap-3">
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
                                            </div>
                                        </div>


                                    </div>
                                )}
                            </div>

                            {/* Sticky Reset Button */}
                            <div className="flex-shrink-0 p-3 pt-2 border-t border-[var(--border)] bg-[var(--secondary)]/30">
                                {activeTab === 'text' && (
                                    <Button variant="outline" size="sm" onClick={resetTextEdits} className="w-full h-9 text-xs bg-background hover:bg-accent">
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Reset Text
                                    </Button>
                                )}
                                {activeTab === 'image' && (
                                    <Button variant="outline" size="sm" onClick={resetImageEdits} className="w-full h-9 text-xs bg-background hover:bg-accent">
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Reset Image
                                    </Button>
                                )}
                            </div>
                        </section>
                        {/* TabsList (tab buttons) sticky at bottom, but inside Tabs */}
                        <div className="fixed bottom-0 left-0 w-full z-40 bg-[var(--background)] border-t border-[var(--border)] p-2">
                            <TabsList className="w-full flex items-center gap-1 h-10 rounded-[var(--radius-sm)]">
                                <TabsTrigger
                                    value="text"
                                    className="flex-1 h-10 text-xs border border-[var(--border)] p-1 items-center justify-center gap-0.5 min-h-0 rounded-[var(--radius-sm)]"
                                >
                                    <Type className="w-2.5 h-2.5" />
                                    <span className="text-[0.625rem]">Text</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="image"
                                    className="flex-1 h-10 text-xs border border-[var(--border)] p-1 items-center justify-center gap-0.5 min-h-0 rounded-[var(--radius-sm)]"
                                >
                                    <ImageIcon className="w-2.5 h-2.5" />
                                    <span className="text-[0.625rem]">Image</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                </aside>
            </div>
            <Toaster />
            {/* In the JSX, add a hidden canvas for measuring */}
            <canvas ref={measureCanvasRef} style={{ display: 'none' }} />
        </div>
    );
} 
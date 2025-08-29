'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, RefreshCw, Trash2, Image as ImageIcon, Type, GripVertical, Italic, Layers, MoveUp } from 'lucide-react';
import { removeImageBackground } from '@/lib/backgroundRemoval';
import { addTextToCanvas, TextSettings } from '@/lib/textRendering';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { poppins, inter, manrope, montserrat, geist, bricolage, funnelSans, funnelDisplay, onest, spaceGrotesk, dmSerifDisplay, instrumentSerif, lora, msMadi, geistMono, spaceMono, roboto, openSans, lato, merriweather, playfairDisplay, rubik, nunito, oswald, raleway, ptSerif, cabin, quicksand, firaMono, jetbrainsMono, dancingScript, pacifico, caveat, satisfy, indieFlower, greatVibes, shadowsIntoLight } from "@/components/fonts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import dynamic from 'next/dynamic';
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

const MobileEditor = dynamic(() => import('./MobileEditor'), { ssr: false });

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

const getCenterPosition = (img?: HTMLImageElement) => ({
    x: (img?.width ?? 1000) / 2,
    y: (img?.height ?? 1000) / 2,
});

const defaultTextSettings: TextSettings = {
    font: 'Poppins',
    fontSize: 100,
    fontWeight: '700', // Default to Bold
    fontStyle: 'normal', // Default to normal (not italic)
    color: '#000000',
    content: 'Your Text Here',
    position: getCenterPosition(),
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
    alignment: 'start',
    sliderX: 0, // Add sliderX and sliderY to defaultTextSettings
    sliderY: 0,
    // Text shadow defaults
    textShadowEnabled: false,
    textShadowColor: '#000000',
    textShadowOffsetX: 2,
    textShadowOffsetY: 2,
    textShadowBlur: 4,
    // Layer position default
    onTop: false, // Default to behind foreground image
};



export default function EditorPage() {
    // Always call all hooks
    const [image, setImage] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [foregroundImage, setForegroundImage] = useState<HTMLCanvasElement | null>(null);
    const [texts, setTexts] = useState<TextSettings[]>([defaultTextSettings]);
    const [activeTextIndex, setActiveTextIndex] = useState(0);
    const [bgBrightness, setBgBrightness] = useState(100);
    const [bgContrast, setBgContrast] = useState(100);
    const [fgBrightness, setFgBrightness] = useState(100);
    const [fgContrast, setFgContrast] = useState(100);
    const [activeTab, setActiveTab] = useState<"text" | "image">("text");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);



    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const img = document.createElement('img') as HTMLImageElement;
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                setOriginalImage(img);
                setTexts((prev) => {
                    const newTexts = [...prev];
                    newTexts[activeTextIndex] = {
                        ...newTexts[activeTextIndex],
                        position: getCenterPosition(img),
                    };
                    return newTexts;
                });
                setLoading(true);
                try {
                    const fg = await removeImageBackground(img);
                    setForegroundImage(fg);
                } finally {
                    setLoading(false);
                }
            };
        }
    };

    // Animation frame ref for smooth updates
    const animationFrameRef = useRef<number | null>(null);

    // Optimized drawing function with requestAnimationFrame
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImage || !foregroundImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cancel any pending animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Schedule the draw operation
        animationFrameRef.current = requestAnimationFrame(() => {
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;

            // Draw background
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

            // Draw foreground
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
    }, [originalImage, foregroundImage, texts, bgBrightness, bgContrast, fgBrightness, fgContrast, activeTextIndex]);

    // Optimized export drawing function
    const drawCanvasForExport = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !originalImage || !foregroundImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // Draw background
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
        addTextToCanvas(ctx, centeredBehindTexts, undefined, false, texts, activeTextIndex); // Hide border indicator for export

        // Draw foreground
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
        addTextToCanvas(ctx, centeredOnTopTexts, undefined, false, texts, activeTextIndex); // Hide border indicator for export
    }, [originalImage, foregroundImage, texts, bgBrightness, bgContrast, fgBrightness, fgContrast, activeTextIndex]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // Cleanup animation frames on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Debounced text change handler for smooth slider updates
    const handleTextChange = useCallback((key: keyof TextSettings, value: TextSettings[keyof TextSettings]) => {
        setTexts(prevTexts => {
            const newTexts = [...prevTexts];
            newTexts[activeTextIndex] = { ...newTexts[activeTextIndex], [key]: value };
            return newTexts;
        });
    }, [activeTextIndex]);

    const addText = () => {
        const center = getCenterPosition(originalImage ?? undefined);
        setTexts([...texts, { ...defaultTextSettings, content: `New Text ${texts.length + 1}`, position: center }]);
        setActiveTextIndex(texts.length);
    };

    const deleteText = (index: number) => {
        if (texts.length === 1) return;
        const newTexts = texts.filter((_, i) => i !== index);
        setTexts(newTexts);
        setActiveTextIndex(Math.max(0, activeTextIndex - 1));
    };

    // Generate unique filename
    const generateUniqueFilename = () => {
        let counter = 0;
        let filename = 'frame_caption.png';

        // Check if we've downloaded this filename before (simple session-based tracking)
        const checkIfExists = (name: string) => {
            try {
                const stored = localStorage.getItem(`downloaded_${name}`);
                return stored !== null;
            } catch {
                // localStorage not available, fallback to counter-based naming
                return counter > 0;
            }
        };

        while (checkIfExists(filename)) {
            counter++;
            filename = counter === 1 ? 'frame_caption(1).png' : `frame_caption(${counter}).png`;
        }

        // Store that we've downloaded this filename (for this session)
        try {
            localStorage.setItem(`downloaded_${filename}`, Date.now().toString());
        } catch {
            // localStorage not available, continue without tracking
        }

        return filename;
    };

    const downloadImage = () => {
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

    const resetImageEdits = () => {
        setBgBrightness(100);
        setBgContrast(100);
        setFgBrightness(100);
        setFgContrast(100);
    };

    const resetTextEdits = () => {
        const center = getCenterPosition(originalImage ?? undefined);
        const newTexts = [...texts];
        newTexts[activeTextIndex] = { ...defaultTextSettings, position: center };
        setTexts(newTexts);
    };

    const tryAnotherImage = () => {
        setImage(null);
        setOriginalImage(null);
        setForegroundImage(null);
        setTexts([{ ...defaultTextSettings, position: getCenterPosition() }]);
        setActiveTextIndex(0);
        resetImageEdits();
    };

    const activeText = texts[activeTextIndex];

    // Optimized position calculation with memoization
    const updateTextPosition = useCallback(() => {
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
    }, [originalImage, activeText.sliderX, activeText.sliderY, activeTextIndex]);

    useEffect(() => {
        updateTextPosition();
    }, [updateTextPosition]);

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', index.toString());
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newTexts = [...texts];
        const draggedText = newTexts[draggedIndex];
        newTexts.splice(draggedIndex, 1);
        newTexts.splice(dropIndex, 0, draggedText);
        
        setTexts(newTexts);
        setActiveTextIndex(dropIndex);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Only branch on rendering, not on hooks
    if (isMobile) {
        return (
            <MobileEditor
                image={image}
                setImage={setImage}
                originalImage={originalImage}
                setOriginalImage={setOriginalImage}
                foregroundImage={foregroundImage}
                setForegroundImage={setForegroundImage}
                texts={texts}
                setTexts={setTexts}
                activeTextIndex={activeTextIndex}
                setActiveTextIndex={setActiveTextIndex}
                bgBrightness={bgBrightness}
                setBgBrightness={setBgBrightness}
                bgContrast={bgContrast}
                setBgContrast={setBgContrast}
                fgBrightness={fgBrightness}
                setFgBrightness={setFgBrightness}
                fgContrast={fgContrast}
                setFgContrast={setFgContrast}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                // pass all handlers as props
                handleImageUpload={handleImageUpload}
                drawCanvas={drawCanvas}
                drawCanvasForExport={drawCanvasForExport}
                handleTextChange={handleTextChange}
                addText={addText}
                deleteText={deleteText}

                resetImageEdits={resetImageEdits}
                resetTextEdits={resetTextEdits}
                tryAnotherImage={tryAnotherImage}
                activeText={activeText}
                loading={loading}
                setLoading={setLoading}
                generateUniqueFilename={generateUniqueFilename}
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row p-1.5 w-full h-screen max-h-screen overflow-hidden">
            {/* Mobile Top Header */}
            <header className="sticky top-0 z-30 flex h-10 items-center justify-center bg-[var(--secondary)]/80 backdrop-blur-md rounded-[var(--radius-sm)] border border-[var(--border)] w-full max-w-full sm:max-w-[360px] lg:max-w-[250px] mx-auto mb-2 lg:hidden">
                <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                    <Image src="/icon.svg" alt="FrameCaption" width={20} height={20} />
                    FrameCaption
                </h1>
            </header>
            {/* Responsive Layout with Image */}
            <div className="flex flex-col lg:flex-row gap-1.5 w-full h-full">
                {/* Left Sidebar - Controls */}
                <aside className="flex flex-col gap-1 w-full max-w-full sm:max-w-[360px] lg:max-w-[250px] h-auto lg:h-full overflow-visible lg:overflow-hidden order-2 lg:order-1 mb-2 lg:mb-0">
                    {/* Desktop Sidebar Header */}
                    <header className="hidden lg:flex h-10 items-center justify-center bg-[var(--secondary)] backdrop-blur-md rounded-[var(--radius-sm)] border border-[var(--border)] w-full max-w-full sm:max-w-[360px] lg:max-w-[250px] mx-auto">
                        <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                            <Image src="/icon.svg" alt="FrameCaption" width={20} height={20} />
                            FrameCaption
                        </h1>
                        <AnimatedThemeToggler className="absolute right-0.5 top-1/2 -translate-y-1/2 cursor-pointer" />
                    </header>

                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "image")} className="flex flex-col items-center w-full">
                        <TabsList className="w-full flex items-center gap-1 h-8 lg:h-10 rounded-[var(--radius-sm)]">
                            <TabsTrigger
                                value={"text"}
                                className="flex-1 text-xs border border-[var(--border)] p-1 lg:p-2 items-center justify-center gap-0.5 min-h-0 cursor-pointer rounded-[var(--radius-sm)]"
                            >
                                <Type className="w-2.5 h-2.5" />
                                <span className="text-[0.625rem]">Text</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value={"image"}
                                className="flex-1 text-xs border border-[var(--border)] p-1 lg:p-2 items-center justify-center gap-0.5 min-h-0 cursor-pointer rounded-[var(--radius-sm)]"
                            >
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span className="text-[0.625rem]">Image</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <section className="w-full bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] flex flex-col min-h-[400px] h-auto lg:h-full border border-[var(--border)]">
                        {/* Scrollable Content Area */}
                        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto no-scrollbar p-3">
                            {activeTab === "text" && (
                                <div className="flex flex-col gap-4">
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
                                                    <div
                                                        key={originalIndex}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, originalIndex)}
                                                        onDragOver={(e) => handleDragOver(e, originalIndex)}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={(e) => handleDrop(e, originalIndex)}
                                                        onDragEnd={handleDragEnd}
                                                        className={`flex items-center justify-between p-2 rounded-[var(--radius-sm)] cursor-pointer transition-all ${
                                                            activeTextIndex === originalIndex ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--primary)]/5'
                                                        } ${
                                                            draggedIndex === originalIndex ? 'opacity-50' : ''
                                                        } ${
                                                            dragOverIndex === originalIndex ? 'border-2 border-[var(--primary)]/50 bg-[var(--primary)]/5' : ''
                                                        }`}
                                                        onClick={() => setActiveTextIndex(originalIndex)}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            {/* Desktop: show grip and up/down buttons */}
                                                            <span className="hidden lg:inline-flex items-center cursor-grab mr-1 select-none"><GripVertical className="w-4 h-4 opacity-60" /></span>
                                                            <span className="truncate text-xs" style={{ fontFamily: text.font }}>{text.content}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
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
                                                onValueChange={([val]) => handleTextChange('fontWeight', val.toString())}
                                                min={100}
                                                max={900}
                                                step={100}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Font Size: {activeText.fontSize}px</Label>
                                            <Slider
                                                value={[activeText.fontSize]}
                                                onValueChange={([val]) => handleTextChange('fontSize', val)}
                                                max={1000}
                                                step={10}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Opacity: {Math.round((activeText.opacity ?? 1) * 100)}%</Label>
                                            <Slider
                                                value={[activeText.opacity ?? 1]}
                                                onValueChange={([val]) => handleTextChange('opacity', val)}
                                                max={1}
                                                step={0.01}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Letter Spacing: {activeText.letterSpacing ?? 0}px</Label>
                                            <Slider
                                                value={[activeText.letterSpacing ?? 0]}
                                                onValueChange={([val]) => handleTextChange('letterSpacing', val)}
                                                max={50}
                                                min={-50}
                                                step={1}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Line Height: {activeText.lineHeight ?? 1.2}</Label>
                                            <Slider
                                                value={[activeText.lineHeight ?? 1.2]}
                                                onValueChange={([val]) => handleTextChange('lineHeight', val)}
                                                max={3}
                                                min={-3}
                                                step={0.1}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-2 w-full">
                                        <Label className="text-xs text-[var(--muted-foreground)] mb-1">Text Position</Label>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Horizontal (X): {activeText.sliderX ?? 0}</Label>
                                            <Slider
                                                value={[activeText.sliderX ?? 0]}
                                                onValueChange={([val]) => handleTextChange('sliderX', val)}
                                                min={-100}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-xs text-[var(--muted-foreground)]">Vertical (Y): {activeText.sliderY ?? 0}</Label>
                                            <Slider
                                                value={[activeText.sliderY ?? 0]}
                                                onValueChange={([val]) => handleTextChange('sliderY', val)}
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
                                                            onValueChange={([val]) => handleTextChange('textShadowOffsetX', val)}
                                                            min={-20}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Shadow Y Offset: {activeText.textShadowOffsetY ?? 2}px</Label>
                                                        <Slider
                                                            value={[activeText.textShadowOffsetY ?? 2]}
                                                            onValueChange={([val]) => handleTextChange('textShadowOffsetY', val)}
                                                            min={-20}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-xs text-[var(--muted-foreground)]">Shadow Blur: {activeText.textShadowBlur ?? 4}px</Label>
                                                        <Slider
                                                            value={[activeText.textShadowBlur ?? 4]}
                                                            onValueChange={([val]) => handleTextChange('textShadowBlur', val)}
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

                            {activeTab === "image" && (
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
                            {activeTab === "text" && (
                                <Button variant="outline" size="sm" onClick={resetTextEdits} className="w-full h-9 text-xs bg-background hover:bg-accent">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Reset Text
                                </Button>
                            )}
                            {activeTab === "image" && (
                                <Button variant="outline" size="sm" onClick={resetImageEdits} className="w-full h-9 text-xs bg-background hover:bg-accent">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Reset Image
                                </Button>
                            )}
                        </div>

                    </section>
                </aside>

                {/* Main Canvas Area - Full Width */}
                {!image ? (
                    /* Full Page Upload Section */
                    <div className="flex flex-col h-[300px] sm:h-[400px] md:h-[500px] lg:h-full w-full mx-auto items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden relative order-1 lg:order-2 mb-2 lg:mb-0">
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
                    <section className="flex flex-col w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full items-center justify-center bg-[var(--secondary)]/50 backdrop-blur-sm rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden relative order-1 lg:order-2 mb-2 lg:mb-0">
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
                        {/* Floating Download Actions */}
                        <div className="hidden lg:flex fixed left-1/2 -translate-x-1/2 bottom-8 z-40 bg-white dark:bg-[var(--secondary)]/90 rounded-[var(--radius-sm)] shadow-lg border border-[var(--border)] p-1 gap-1.5 items-center">
                            <Button onClick={downloadImage} className="h-9 text-xs flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                            <Button variant="outline" onClick={tryAnotherImage} className="h-9 flex items-center gap-2 text-xs">
                                <ImageIcon className="w-4 h-4" />
                                Try Another
                            </Button>
                        </div>
                        {/* Mobile/Tablet Download Actions */}
                        <div className="flex lg:hidden w-full justify-center p-2 gap-2">
                            <Button onClick={downloadImage} className="h-9 text-xs flex-1 flex items-center gap-2">
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

            {/* Theme Modal for Desktop */}


            <Toaster />
        </div>
    );
}
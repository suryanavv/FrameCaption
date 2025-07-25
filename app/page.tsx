'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ThemeSwitch } from "@/components/ui/themeSwitch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, RefreshCw, Trash2, Image as ImageIcon, Type } from 'lucide-react';
import { removeImageBackground } from '@/lib/backgroundRemoval';
import { addTextToCanvas, TextSettings } from '@/lib/textRendering';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { poppins, inter, manrope, montserrat, geist, bricolage, funnelSans, funnelDisplay, onest, spaceGrotesk, dmSerifDisplay, instrumentSerif, lora, msMadi, geistMono, spaceMono, roboto, openSans, lato, merriweather, playfairDisplay, rubik, nunito, oswald, raleway, ptSerif, cabin, quicksand, firaMono, jetbrainsMono } from "@/components/fonts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import dynamic from 'next/dynamic';

const MobileEditor = dynamic(() => import('./MobileEditor'), { ssr: false });

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const googleFonts = [
    { label: "Poppins", value: "Poppins", className: poppins.variable },
    { label: "Inter", value: "Inter", className: inter.variable },
    { label: "Manrope", value: "Manrope", className: manrope.variable },
    { label: "Montserrat", value: "Montserrat", className: montserrat.variable },
    { label: "Geist", value: "Geist", className: geist.variable },
    { label: "Bricolage Grotesque", value: "Bricolage Grotesque", className: bricolage.variable },
    { label: "Funnel Sans", value: "Funnel Sans", className: funnelSans.variable },
    { label: "Funnel Display", value: "Funnel Display", className: funnelDisplay.variable },
    { label: "Onest", value: "Onest", className: onest.variable },
    { label: "Space Grotesk", value: "Space Grotesk", className: spaceGrotesk.variable },
    { label: "DM Serif Display", value: "DM Serif Display", className: dmSerifDisplay.variable },
    { label: "Instrument Serif", value: "Instrument Serif", className: instrumentSerif.variable },
    { label: "Lora", value: "Lora", className: lora.variable },
    { label: "Ms Madi", value: "Ms Madi", className: msMadi.variable },
    { label: "Geist Mono", value: "Geist Mono", className: geistMono.variable },
    { label: "Space Mono", value: "Space Mono", className: spaceMono.variable },
    { label: "Roboto", value: "Roboto", className: roboto.variable },
    { label: "Open Sans", value: "Open Sans", className: openSans.variable },
    { label: "Lato", value: "Lato", className: lato.variable },
    { label: "Merriweather", value: "Merriweather", className: merriweather.variable },
    { label: "Playfair Display", value: "Playfair Display", className: playfairDisplay.variable },
    { label: "Rubik", value: "Rubik", className: rubik.variable },
    { label: "Nunito", value: "Nunito", className: nunito.variable },
    { label: "Oswald", value: "Oswald", className: oswald.variable },
    { label: "Raleway", value: "Raleway", className: raleway.variable },
    { label: "PT Serif", value: "PT Serif", className: ptSerif.variable },
    { label: "Cabin", value: "Cabin", className: cabin.variable },
    { label: "Quicksand", value: "Quicksand", className: quicksand.variable },
    { label: "Fira Mono", value: "Fira Mono", className: firaMono.variable },
    { label: "JetBrains Mono", value: "JetBrains Mono", className: jetbrainsMono.variable },
];

const getCenterPosition = (img?: HTMLImageElement) => ({
    x: (img?.width ?? 1000) / 2,
    y: (img?.height ?? 1000) / 2,
});

const defaultTextSettings: TextSettings = {
    font: 'Poppins',
    fontSize: 100,
    fontWeight: '700', // Default to Bold
    color: '#000000',
    content: 'Your Text Here',
    position: getCenterPosition(),
    opacity: 1,
    letterSpacing: 0,
    lineHeight: 1.2,
    alignment: 'start',
    sliderX: 0, // Add sliderX and sliderY to defaultTextSettings
    sliderY: 0,
};

// Helper to measure text width and height
function measureText(ctx: CanvasRenderingContext2D, text: string, font: string, fontSize: number, fontWeight: string | number, letterSpacing: number, lineHeight: number) {
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px ${font}`;
    const lines = text.split('\n');
    let maxWidth = 0;
    for (const line of lines) {
        let width = 0;
        if (letterSpacing) {
            for (const char of line) {
                width += ctx.measureText(char).width + letterSpacing;
            }
        } else {
            width = ctx.measureText(line).width;
        }
        if (width > maxWidth) maxWidth = width;
    }
    const height = lines.length * fontSize * lineHeight;
    ctx.restore();
    return { width: maxWidth, height };
}

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
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Create a ref for a hidden canvas for measuring
    const measureCanvasRef = useRef<HTMLCanvasElement>(null);

    // Add a ref for debounce timeout
    const positionDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Helper to get text bounding box for activeText
    function getActiveTextBox() {
        const canvas = measureCanvasRef.current;
        if (!canvas) return { width: 0, height: 0 };
        const ctx = canvas.getContext('2d');
        if (!ctx) return { width: 0, height: 0 };
        return measureText(
            ctx,
            activeText.content,
            activeText.font,
            activeText.fontSize,
            activeText.fontWeight ?? '700',
            activeText.letterSpacing ?? 0,
            activeText.lineHeight ?? 1.2
        );
    }

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

    // In drawCanvas, do not subtract half the text width/height from t.position. Use t.position.x and t.position.y directly.
    const drawCanvas = () => {
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

        // Draw texts (centered)
        // Adjust position to be center
        const centeredTexts = texts.map((t, i) => ({
            ...t,
            position: {
                x: t.position.x,
                y: t.position.y
            }
        }));
        addTextToCanvas(ctx, centeredTexts, activeTextIndex);

        // Draw foreground
        ctx.filter = `brightness(${fgBrightness}%) contrast(${fgContrast}%)`;
        ctx.drawImage(foregroundImage, 0, 0);
        ctx.filter = 'none';
    };

    useEffect(() => {
        drawCanvas();
    }, [originalImage, foregroundImage, texts, bgBrightness, bgContrast, fgBrightness, fgContrast]);

    const handleTextChange = (key: keyof TextSettings, value: TextSettings[keyof TextSettings]) => {
        const newTexts = [...texts];
        newTexts[activeTextIndex] = { ...newTexts[activeTextIndex], [key]: value };
        setTexts(newTexts);
    };

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

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'text-behind-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
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
    const maxX = originalImage ? originalImage.width : 1000;
    const maxY = originalImage ? originalImage.height : 1000;

    // Add state for new coordinate system
    // Remove global sliderX, sliderY state
    // Instead, store sliderX and sliderY in each text object
    // When switching activeTextIndex, update the sliders to match the active text's position
    // When moving sliders, only update the active text's position
    // On text add, initialize with sliderX: 0, sliderY: 0
    // Add effect to map slider values to pixel positions and update activeText.position
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
                handleTextChange={handleTextChange}
                addText={addText}
                deleteText={deleteText}
                downloadImage={downloadImage}
                resetImageEdits={resetImageEdits}
                resetTextEdits={resetTextEdits}
                tryAnotherImage={tryAnotherImage}
                activeText={activeText}
                loading={loading}
                setLoading={setLoading}
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row p-1.5 w-full h-screen max-h-screen overflow-hidden">
            {/* Mobile Top Header */}
            <header className="sticky top-0 z-30 flex h-10 items-center justify-center bg-secondary/80 backdrop-blur-md rounded-xl border border-primary/10 w-full max-w-full sm:max-w-[320px] lg:max-w-[240px] mx-auto mb-2 lg:hidden">
                <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                    <Image src="/icon.svg" alt="POVImage" width={20} height={20} />
                    POVImage
                </h1>
            </header>
            {/* Responsive Layout with Image */}
            <div className="flex flex-col lg:flex-row gap-1.5 w-full h-full">
                {/* Left Sidebar - Controls */}
                <aside className="flex flex-col gap-1 w-full max-w-full sm:max-w-[320px] lg:max-w-[205px] h-auto lg:h-full overflow-visible lg:overflow-hidden order-2 lg:order-1 mb-2 lg:mb-0">
                    {/* Desktop Sidebar Header */}
                    <header className="hidden lg:flex h-10 items-center justify-center bg-secondary backdrop-blur-md rounded-xl border border-primary/10 w-full max-w-full sm:max-w-[320px] lg:max-w-[240px] mx-auto">
                        <h1 className="text-xs font-semibold flex items-center gap-2 p-3">
                            <Image src="/icon.svg" alt="POVImage" width={20} height={20} />
                            POVImage
                        </h1>
                    </header>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "image")} className="flex flex-col items-center w-full">
                        <TabsList className="w-full flex items-center gap-1 h-8 lg:h-10">
                            <TabsTrigger
                                value={"text"}
                                className="flex-1 text-xs border border-primary/20 p-1 lg:p-2 items-center justify-center gap-0.5 min-h-0"
                            >
                                <Type className="w-2.5 h-2.5" />
                                <span className="text-[0.625rem]">Text</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value={"image"}
                                className="flex-1 text-xs border border-primary/20 p-1 lg:p-2 items-center justify-center gap-0.5 min-h-0"
                            >
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span className="text-[0.625rem]">Image</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <section className="w-full bg-secondary/50 backdrop-blur-sm rounded-2xl flex flex-col flex-grow min-h-0 overflow-visible lg:overflow-hidden h-auto lg:h-full border border-primary/10">
                        <div className="flex flex-col flex-grow min-h-0 overflow-y-auto no-scrollbar h-auto max-h-[60vh] lg:max-h-full p-3">
                            {activeTab === "text" && (
                                <div className="flex flex-col gap-4 pb-14 sm:pb-0"> {/* Add bottom padding for sticky button */}
                                    {/* Text Layers */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground">Text Layers</Label>
                                            <Button variant="outline" size="sm" onClick={addText} className="text-xs h-7 px-2">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="space-y-1">
                                            {texts.map((text, index) => (
                                                <div key={index} className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${activeTextIndex === index ? 'bg-primary/10' : 'hover:bg-primary/5'}`} onClick={() => setActiveTextIndex(index)}>
                                                    <span className="truncate text-xs" style={{ fontFamily: text.font }}>{text.content}</span>
                                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteText(index) }} className="h-5 w-5">
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Text Content */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-muted-foreground">Content</Label>
                                        <Textarea
                                            value={activeText.content}
                                            onChange={(e) => handleTextChange('content', e.target.value)}
                                            className="min-h-[50px] resize-none text-xs"
                                            placeholder="Enter your text"
                                        />
                                    </div>

                                    {/* Font Selection */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-muted-foreground">Font</Label>
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
                                    {/* Font Weight Selection */}
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-muted-foreground">Font Weight</Label>
                                        <Select value={activeText.fontWeight?.toString() ?? '700'} onValueChange={(value) => handleTextChange('fontWeight', value)}>
                                            <SelectTrigger className="w-full h-9 text-xs">
                                                <SelectValue placeholder="Select weight" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="100">100 Thin</SelectItem>
                                                <SelectItem value="200">200 Extra Light</SelectItem>
                                                <SelectItem value="300">300 Light</SelectItem>
                                                <SelectItem value="400">400 Regular</SelectItem>
                                                <SelectItem value="500">500 Medium</SelectItem>
                                                <SelectItem value="600">600 Semi Bold</SelectItem>
                                                <SelectItem value="700">700 Bold</SelectItem>
                                                <SelectItem value="800">800 Extra Bold</SelectItem>
                                                <SelectItem value="900">900 Black</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Color */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label className="text-xs text-muted-foreground">Color</Label>
                                        <div className="flex items-center gap-2 w-full relative">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <span
                                                        className="w-6 h-6 rounded-full cursor-pointer aspect-square border border-primary/10 absolute left-2 top-1/2 -translate-y-1/2"
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
                                        <Slider
                                            label="Size"
                                            value={[activeText.fontSize]}
                                            onValueChange={([val]) => handleTextChange('fontSize', val)}
                                            max={1000}
                                            step={10}
                                        />
                                        <Slider
                                            label="Opacity"
                                            value={[activeText.opacity ?? 1]}
                                            onValueChange={([val]) => handleTextChange('opacity', val)}
                                            max={1}
                                            step={0.01}
                                        />
                                        <Slider
                                            label="Letter Spacing"
                                            value={[activeText.letterSpacing ?? 0]}
                                            onValueChange={([val]) => handleTextChange('letterSpacing', val)}
                                            max={50}
                                            min={-50}
                                            step={1}
                                        />
                                        <Slider
                                            label="Line Height"
                                            value={[activeText.lineHeight ?? 1.2]}
                                            onValueChange={([val]) => handleTextChange('lineHeight', val)}
                                            max={3}
                                            min={-3}
                                            step={0.1}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <Label className="text-xs text-muted-foreground mb-1">Text Position</Label>
                                        
                                                    <Slider
                                                        label="Horizontal (X)"
                                                        value={[activeText.sliderX ?? 0]}
                                                        onValueChange={([val]) => handleTextChange('sliderX', val)}
                                                        min={-100}
                                                        max={100}
                                                        step={1}
                                                    />
                                                    <Slider
                                                        label="Vertical (Y)"
                                                        value={[activeText.sliderY ?? 0]}
                                                        onValueChange={([val]) => handleTextChange('sliderY', val)}
                                                        min={-100}
                                                        max={100}
                                                        step={1}
                                                    />
                                        </div>

                                    <Button variant="outline" size="sm" onClick={resetTextEdits} className="w-full h-8 text-xs">
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Reset
                                    </Button>
                                </div>
                            )}

                            {activeTab === "image" && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-muted-foreground">Background</Label>
                                        <div className="flex flex-col gap-3">
                                            <Slider
                                                label="Brightness"
                                                value={[bgBrightness]}
                                                onValueChange={([val]) => setBgBrightness(val)}
                                                max={200}
                                                step={1}
                                            />
                                            <Slider
                                                label="Contrast"
                                                value={[bgContrast]}
                                                onValueChange={([val]) => setBgContrast(val)}
                                                max={200}
                                                step={1}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs text-muted-foreground">Foreground</Label>
                                        <div className="flex flex-col gap-3">
                                            <Slider
                                                label="Brightness"
                                                value={[fgBrightness]}
                                                onValueChange={([val]) => setFgBrightness(val)}
                                                max={200}
                                                step={1}
                                            />
                                            <Slider
                                                label="Contrast"
                                                value={[fgContrast]}
                                                onValueChange={([val]) => setFgContrast(val)}
                                                max={200}
                                                step={1}
                                            />
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm" onClick={resetImageEdits} className="w-full h-8 text-xs">
                                        <RefreshCw className="w-3 h-3 mr-1" />
                                        Reset
                                    </Button>
                                </div>
                            )}
                        </div>
                        {/* Sticky Reset Button for Text Tab on Mobile */}
                        {activeTab === "text" && (
                            <div className="lg:hidden sticky bottom-0 left-0 w-full bg-secondary/90 p-2 z-20 rounded-b-2xl border-t border-primary/10 flex">
                                <Button variant="outline" size="sm" onClick={resetTextEdits} className="w-full h-8 text-xs">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Reset
                                </Button>
                            </div>
                        )}
                    </section>
                </aside>

                {/* Main Canvas Area - Full Width */}
                {!image ? (
                    /* Full Page Upload Section */
                    <div className="flex flex-col h-[300px] sm:h-[400px] md:h-[500px] lg:h-full w-full mx-auto items-center justify-center bg-secondary/50 backdrop-blur-sm rounded-2xl border border-primary/10 overflow-hidden relative order-1 lg:order-2 mb-2 lg:mb-0">
                        <Upload className="w-12 h-12 md:w-16 md:h-16 text-primary mb-4 md:mb-6" />
                        <h1 className="text-xs font-semibold mb-2">Upload Your Image</h1>
                        <p className="text-muted-foreground mb-4 md:mb-6 text-center text-xs px-4">Choose an image to add text behind elements</p>
                        <Button onClick={() => document.getElementById('image-upload')?.click()} className="h-10 w-auto text-xs flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Image
                        </Button>
                        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                ) : (
                    <section className="flex flex-col w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full items-center justify-center bg-secondary/50 backdrop-blur-sm rounded-2xl border border-primary/10 overflow-hidden relative order-1 lg:order-2 mb-2 lg:mb-0">
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
                        <div className="hidden lg:flex fixed left-1/2 -translate-x-1/2 bottom-8 z-40 bg-white dark:bg-secondary/90 rounded-2xl shadow-lg border border-primary/10 px-2 py-1 gap-2 items-center" style={{ minWidth: '320px' }}>
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

                {/* Right Sidebar - Position Control (Desktop only) */}
                <aside className="hidden lg:flex flex-col gap-2 w-full max-w-full lg:max-w-[205px] h-auto lg:h-full overflow-visible lg:overflow-hidden order-3">
                    <div className="h-10 w-full">
                        <ThemeSwitch />
                    </div>
                    <div className="flex flex-col gap-2 w-full bg-secondary rounded-2xl p-4 border border-primary/10">
                        {/* Position Control UI removed as per edit hint */}
                    </div>
                </aside>
            </div>

            <Toaster />
        </div>
    );
}
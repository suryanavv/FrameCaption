import type { } from '@imgly/background-removal'

type RemoveBgFn = (input: Blob | string, options?: Record<string, unknown>) => Promise<Blob>;

let cachedRemoveBackground: RemoveBgFn | null = null;

type BgRemovalStats = {
	moduleLoadMs?: number;
	moduleCached: boolean;
	cacheHits: number;
	lastImageBitmapMs?: number;
	lastProcessMs?: number;
	lastCompositeMs?: number;
	lastTotalMs?: number;
};

const stats: BgRemovalStats = {
	moduleCached: false,
	cacheHits: 0,
};

export function getBackgroundRemovalStats(): BgRemovalStats {
	return { ...stats };
}

type BgRemovalConfig = {
	processingScale: number; // 0 < scale <= 1
};

const config: BgRemovalConfig = {
	processingScale: 1,
};

export function setBackgroundRemovalConfig(next: Partial<BgRemovalConfig>) {
	if (typeof next.processingScale === 'number') {
		config.processingScale = Math.min(1, Math.max(0.2, next.processingScale));
	}
}

// Weak cache per Blob instance to avoid recomputing
const blobToResultCanvasCache = new WeakMap<Blob, Promise<HTMLCanvasElement>>();

async function getRemoveBackground(): Promise<RemoveBgFn> {
	if (cachedRemoveBackground) {
		stats.moduleCached = true;
		stats.cacheHits += 1;
		return cachedRemoveBackground;
	}
	const t0 = performance.now();
	const mod = await import('@imgly/background-removal');
	stats.moduleLoadMs = performance.now() - t0;
	cachedRemoveBackground = mod.removeBackground as unknown as RemoveBgFn;
	stats.moduleCached = true;
	return cachedRemoveBackground;
}

export async function removeImageBackground(source: Blob | File, options?: Record<string, unknown>): Promise<HTMLCanvasElement> {
	// Cache per Blob instance - avoid recomputing same image
	if (blobToResultCanvasCache.has(source)) {
		console.log('[CACHE] Using cached result for background removal');
		stats.cacheHits += 1;
		return blobToResultCanvasCache.get(source)!;
	}

	const pending = (async () => {
	const tStart = performance.now();
	const removeBackground = await getRemoveBackground();

	const tBitmap0 = performance.now();
	const originalBitmap = await createImageBitmap(source);
	stats.lastImageBitmapMs = performance.now() - tBitmap0;

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas not supported');

	canvas.width = originalBitmap.width;
	canvas.height = originalBitmap.height;
	ctx.drawImage(originalBitmap, 0, 0);

	// Optional downscale for faster processing
	let processingInput: Blob | File = source;
	if (config.processingScale < 1) {
		const targetW = Math.max(64, Math.floor(originalBitmap.width * config.processingScale));
		const targetH = Math.max(64, Math.floor(originalBitmap.height * config.processingScale));

		// Type-safe OffscreenCanvas handling with performance optimizations
		const off = (typeof (window as Window & { OffscreenCanvas?: typeof OffscreenCanvas }).OffscreenCanvas !== 'undefined')
			? new (window as Window & { OffscreenCanvas: typeof OffscreenCanvas }).OffscreenCanvas(targetW, targetH)
			: document.createElement('canvas');

		off.width = targetW;
		off.height = targetH;
		const octx = off.getContext('2d', {
			// Performance optimizations
			alpha: false,
			desynchronized: true,
			willReadFrequently: false
		});

		if (octx) {
			// Disable image smoothing for better performance
			octx.imageSmoothingEnabled = false;
			octx.drawImage(originalBitmap, 0, 0, targetW, targetH);

			// Type-safe blob conversion with lower quality for speed
			let blob: Blob | null = null;
			if ((off as OffscreenCanvas).convertToBlob) {
				blob = await (off as OffscreenCanvas).convertToBlob({ type: 'image/jpeg', quality: 0.8 });
			} else {
				blob = await new Promise<Blob | null>(res => (off as HTMLCanvasElement).toBlob(res, 'image/jpeg', 0.8));
			}

			if (blob) processingInput = blob;
		}
	}

	const tProcess0 = performance.now();
	const maskBlob = options ? await removeBackground(processingInput, options) : await removeBackground(processingInput);
	stats.lastProcessMs = performance.now() - tProcess0;

	const maskBitmap = await createImageBitmap(maskBlob);

	const tComp0 = performance.now();
	ctx.globalCompositeOperation = 'destination-in';
	// If we processed at lower scale, scale mask up to full size during composite
	ctx.drawImage(maskBitmap, 0, 0, canvas.width, canvas.height);
	stats.lastCompositeMs = performance.now() - tComp0;
	stats.lastTotalMs = performance.now() - tStart;

	return canvas;
	})();

	blobToResultCanvasCache.set(source, pending);
	return pending;
}
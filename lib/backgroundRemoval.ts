import type { } from '@imgly/background-removal'

type RemoveBgFn = (input: Blob | string, options?: Record<string, unknown>) => Promise<Blob>;

let cachedRemoveBackground: RemoveBgFn | null = null;



// Adaptive scaling based on device capabilities for ultra-fast processing
function getDeviceCapabilities() {
	const cores = navigator.hardwareConcurrency || 2;
	const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;
	const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
	const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
	const isMobile = window.innerWidth < 768;

	// Ultra-low end: old mobiles, slow connections
	if (isSlowConnection || (isMobile && cores <= 2) || memory < 2) {
		return { scale: 0.15, maxDimension: 400, quality: 0.6 };
	}
	// Low end: basic mobiles, limited hardware
	else if ((isMobile && cores <= 4) || memory < 4) {
		return { scale: 0.2, maxDimension: 500, quality: 0.7 };
	}
	// Medium end: decent mobiles, tablets
	else if (isMobile || cores <= 6) {
		return { scale: 0.25, maxDimension: 600, quality: 0.75 };
	}
	// High end: modern devices
	else {
		return { scale: 0.3, maxDimension: 800, quality: 0.8 };
	}
}

// Weak cache per Blob instance to avoid recomputing
const blobToResultCanvasCache = new WeakMap<Blob, Promise<HTMLCanvasElement>>();

async function getRemoveBackground(): Promise<RemoveBgFn> {
	if (cachedRemoveBackground) {
		return cachedRemoveBackground;
	}
	const mod = await import('@imgly/background-removal');
	cachedRemoveBackground = mod.removeBackground as unknown as RemoveBgFn;
	return cachedRemoveBackground;
}

export async function removeImageBackground(source: Blob | File, options?: Record<string, unknown>): Promise<HTMLCanvasElement> {
	// Cache per Blob instance - avoid recomputing same image
	if (blobToResultCanvasCache.has(source)) {
		return blobToResultCanvasCache.get(source)!;
	}

	const pending = (async () => {
	const removeBackground = await getRemoveBackground();

	const originalBitmap = await createImageBitmap(source);

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas not supported');

	canvas.width = originalBitmap.width;
	canvas.height = originalBitmap.height;
	ctx.drawImage(originalBitmap, 0, 0);

	// Adaptive processing based on device capabilities
	let processingInput: Blob | File = source;
	const capabilities = getDeviceCapabilities();

	// Calculate target size based on device capabilities
	const maxDim = Math.max(originalBitmap.width, originalBitmap.height);
	let targetW = originalBitmap.width;
	let targetH = originalBitmap.height;

	if (maxDim > capabilities.maxDimension) {
		const scale = capabilities.maxDimension / maxDim;
		targetW = Math.max(64, Math.floor(originalBitmap.width * scale));
		targetH = Math.max(64, Math.floor(originalBitmap.height * scale));
	} else {
		targetW = Math.max(64, Math.floor(originalBitmap.width * capabilities.scale));
		targetH = Math.max(64, Math.floor(originalBitmap.height * capabilities.scale));
	}

	// Use OffscreenCanvas for better performance where available
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
		// Disable image smoothing for faster processing
		octx.imageSmoothingEnabled = false;
		octx.drawImage(originalBitmap, 0, 0, targetW, targetH);

		// Use WebP with adaptive quality based on device capabilities
		let blob: Blob | null = null;
		if ((off as OffscreenCanvas).convertToBlob) {
			blob = await (off as OffscreenCanvas).convertToBlob({ type: 'image/webp', quality: capabilities.quality });
		} else {
			blob = await new Promise<Blob | null>(res => (off as HTMLCanvasElement).toBlob(res, 'image/webp', capabilities.quality));
		}

		if (blob) processingInput = blob;
	}
	
	// Dispose of bitmap to free memory
	originalBitmap.close();

	// Use lightweight options for low-end devices
	const processingOptions = capabilities.scale < 0.2 ? {
		...options,
		publicPath: undefined, // Skip heavy initialization
	} : options;

	const maskBlob = processingOptions ? await removeBackground(processingInput, processingOptions) : await removeBackground(processingInput);

	const maskBitmap = await createImageBitmap(maskBlob);

	ctx.globalCompositeOperation = 'destination-in';
	// Scale mask up to full size during composite
	ctx.drawImage(maskBitmap, 0, 0, canvas.width, canvas.height);
	
	// Cleanup resources
	maskBitmap.close();

	return canvas;
	})();

	blobToResultCanvasCache.set(source, pending);
	return pending;
}
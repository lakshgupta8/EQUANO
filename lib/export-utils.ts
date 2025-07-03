"use client"

import type { PlotlyHTMLElement } from "plotly.js"
import jsPDF from "jspdf"

export async function exportGraph(
  plotRef: PlotlyHTMLElement,
  format: "png" | "svg" | "pdf" | "gif",
  filename = "equano-graph",
) {
  if (!plotRef) {
    throw new Error("Plot reference not available")
  }

  try {
    // Use Plotly's built-in export functionality
    const Plotly = (window as any).Plotly
    if (!Plotly) {
      throw new Error("Plotly not available")
    }

    switch (format) {
      case "png":
        await Plotly.downloadImage(plotRef, {
          format: "png",
          width: 1200,
          height: 800,
          filename: `${filename}.png`,
          scale: 2,
        })
        break

      case "svg":
        await Plotly.downloadImage(plotRef, {
          format: "svg",
          width: 1200,
          height: 800,
          filename: `${filename}.svg`,
        })
        break

      case "pdf": {
        // Export as high-res PNG first
        const pngDataUrl = await Plotly.toImage(plotRef, {
          format: "png",
          width: 1200,
          height: 800,
          scale: 2,
        });

        // Create PDF (A4 landscape)
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Load image and add to PDF when loaded
        await new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = function () {
            // Calculate dimensions to fit the page
            let imgWidth = img.width;
            let imgHeight = img.height;
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            imgWidth *= ratio;
            imgHeight *= ratio;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            pdf.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`${filename}.pdf`);
            resolve(null);
          };
          img.onerror = reject;
          img.src = pngDataUrl;
        });
        break;
      }

      case "gif":
        // For GIF export, we would need to capture multiple frames
        // This is a simplified implementation that exports a single frame as PNG
        await Plotly.downloadImage(plotRef, {
          format: "png",
          width: 800,
          height: 600,
          filename: `${filename}-frame.png`,
          scale: 1,
        })
        console.warn("GIF export: Exported single frame as PNG. Full GIF animation requires additional implementation.")
        break

      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  } catch (error) {
    console.error("Export failed:", error)
    throw error
  }
}

export function generateEmbedCode(
  shareUrl: string,
  width = 800,
  height = 600,
  options: {
    showControls?: boolean
    allowFullscreen?: boolean
    theme?: "light" | "dark" | "auto"
  } = {},
): string {
  const params = new URLSearchParams()

  if (options.showControls === false) params.set("controls", "false")
  if (options.allowFullscreen === false) params.set("fullscreen", "false")
  if (options.theme) params.set("theme", options.theme)

  const embedUrl = `${shareUrl}/embed${params.toString() ? "?" + params.toString() : ""}`

  return `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  allowfullscreen
  sandbox="allow-scripts allow-same-origin"
  title="EQUANO Graph Embed">
</iframe>`
}

export function generateQRCode(url: string): string {
  // In a real implementation, this would generate an actual QR code
  // For now, we'll return a placeholder SVG
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="white"/>
    <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">QR Code for: ${url}</text>
  </svg>`
}

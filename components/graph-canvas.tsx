"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import { useGraphStore } from "@/lib/stores/graph-store"
import { parseExpression, evaluateExpression } from "@/lib/math-parser"
import { Button } from "@/components/ui/button"
import { RotateCcw, Maximize, Download, Box } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { exportGraph } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"
import type { ThreeDCanvasProps } from './three-d-canvas'

const ThreeDCanvas = dynamic<ThreeDCanvasProps>(() => import('./three-d-canvas'), { ssr: false });

// Add props for external control
interface GraphCanvasProps {
  fitToDataTrigger?: number;
  exportFormat?: string | null;
  onExported?: () => void;
}

export default function GraphCanvas({ fitToDataTrigger, exportFormat, onExported }: GraphCanvasProps) {
  const expressions = useGraphStore(s => s.expressions)
  const sliders = useGraphStore(s => s.sliders)
  const graphSettings = useGraphStore(s => s.graphSettings)
  const updateGraphSettings = useGraphStore(s => s.updateGraphSettings)
  const is3DMode = useGraphStore(s => s.is3DMode)
  const toggle3DMode = useGraphStore(s => s.toggle3DMode)
  const theme = useGraphStore(s => s.theme)
  const isAnimating = useGraphStore(s => s.isAnimating)
  const { toast } = useToast()

  const [plotData, setPlotData] = useState<any[]>([])
  const [layout, setLayout] = useState<any>({})
  const [isExporting, setIsExporting] = useState(false)
  const [isUpdatingFromPlot, setIsUpdatingFromPlot] = useState(false)
  const plotRef = useRef<any>(null)
  const [showZoomHint, setShowZoomHint] = useState(true)
  const [pendingExport, setPendingExport] = useState<string | null>(null)

  const updateSlider = useGraphStore((s) => s.updateSlider);

  // Memoize graph settings to prevent unnecessary updates
  const memoizedGraphSettings = useMemo(
    () => graphSettings,
    [
      graphSettings.xMin,
      graphSettings.xMax,
      graphSettings.yMin,
      graphSettings.yMax,
      graphSettings.showGrid,
      graphSettings.showAxes,
      graphSettings.equalAspectRatio,
      graphSettings.title,
      graphSettings.xLabel,
      graphSettings.yLabel,
    ],
  )

  // Memoize slider values to prevent unnecessary updates
  const sliderValues = useMemo(
    () => Object.fromEntries(sliders.map((s) => [s.variable, s.value])),
    [sliders]
  );

  // Generate plot data from expressions with optimized rendering
  const generatePlotData = useCallback(() => {
    const data: any[] = []
    // Always use latest slider values
    const sliderValues = Object.fromEntries(sliders.map((s) => [s.variable, s.value]))
    console.log('generatePlotData: sliderValues', sliderValues)

    expressions.forEach((expr) => {
      if (!expr.visible) return

      try {
        const parsedExpr = parseExpression(expr.expression, sliderValues)

        if (parsedExpr.type === "function") {
          // y = f(x) functions
          const xValues = []
          const yValues = []
          const step = (memoizedGraphSettings.xMax - memoizedGraphSettings.xMin) / 1000

          for (let x = memoizedGraphSettings.xMin; x <= memoizedGraphSettings.xMax; x += step) {
            try {
              if (parsedExpr.expression) {
                const y = evaluateExpression(parsedExpr.expression, { x, ...sliderValues })
                if (isFinite(y) && y >= memoizedGraphSettings.yMin && y <= memoizedGraphSettings.yMax) {
                  xValues.push(x)
                  yValues.push(y)
                }
              }
            } catch (e) {
              // Skip invalid points
            }
          }

          if (xValues.length > 0) {
            data.push({
              x: xValues,
              y: yValues,
              type: "scatter",
              mode: "lines",
              name: expr.expression,
              line: { color: expr.color, width: 2 },
              hovertemplate: `x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`,
            })
          }
        } else if (parsedExpr.type === "parametric") {
          // Parametric equations x(t), y(t)
          const xValues = []
          const yValues = []

          if (parsedExpr.xExpr && parsedExpr.yExpr) {
            for (let t = 0; t <= 2 * Math.PI; t += 0.05) {
              try {
                const x = evaluateExpression(parsedExpr.xExpr, { t, ...sliderValues })
                const y = evaluateExpression(parsedExpr.yExpr, { t, ...sliderValues })
                if (isFinite(x) && isFinite(y)) {
                  xValues.push(x)
                  yValues.push(y)
                }
              } catch (e) {
                // Skip invalid points
              }
            }
          }

          if (xValues.length > 0) {
            data.push({
              x: xValues,
              y: yValues,
              type: "scatter",
              mode: "lines",
              name: expr.expression,
              line: { color: expr.color, width: 2 },
              hovertemplate: `x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`,
            })
          }
        } else if (parsedExpr.type === "polar") {
          // Polar equations r = f(θ)
          const xValues = []
          const yValues = []

          for (let theta = 0; theta <= 4 * Math.PI; theta += 0.02) {
            try {
              if (!parsedExpr.expression) continue
              const r = evaluateExpression(parsedExpr.expression, {
                theta,
                θ: theta,
                ...sliderValues,
              })
              if (isFinite(r) && Math.abs(r) < 100) {
                // Limit radius for better visualization
                const x = r * Math.cos(theta)
                const y = r * Math.sin(theta)
                xValues.push(x)
                yValues.push(y)
              }
            } catch (e) {
              // Skip invalid points
            }
          }

          if (xValues.length > 0) {
            data.push({
              x: xValues,
              y: yValues,
              type: "scatter",
              mode: "lines",
              name: expr.expression,
              line: { color: expr.color, width: 2 },
              hovertemplate: `r: %{customdata:.3f}<br>θ: %{meta:.3f}<extra></extra>`,
            })
          }
        } else if (parsedExpr.type === "implicit") {
          // Implicit equations like x^2 + y^2 = 1
          const size = 100 // Reduced for performance
          const xStep = (memoizedGraphSettings.xMax - memoizedGraphSettings.xMin) / size
          const yStep = (memoizedGraphSettings.yMax - memoizedGraphSettings.yMin) / size

          const z = []
          const xGrid = []
          const yGrid = []

          for (let i = 0; i <= size; i++) {
            const x = memoizedGraphSettings.xMin + i * xStep
            xGrid.push(x)
          }

          for (let j = 0; j <= size; j++) {
            const y = memoizedGraphSettings.yMin + j * yStep
            yGrid.push(y)
            const row = []

            for (let i = 0; i <= size; i++) {
              const x = memoizedGraphSettings.xMin + i * xStep
              try {
                if (!parsedExpr.leftSide || !parsedExpr.rightSide) {
                  row.push(Number.NaN)
                  continue
                }
                const value =
                  evaluateExpression(parsedExpr.leftSide, { x, y, ...sliderValues }) -
                  evaluateExpression(parsedExpr.rightSide, { x, y, ...sliderValues })
                row.push(value)
              } catch (e) {
                row.push(Number.NaN)
              }
            }
            z.push(row)
          }

          data.push({
            x: xGrid,
            y: yGrid,
            z: z,
            type: "contour",
            contours: {
              start: 0,
              end: 0,
              size: 0,
              coloring: "none",
            },
            line: { color: expr.color, width: 2 },
            showscale: false,
            name: expr.expression,
            hovertemplate: `x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`,
          })
        } else if (parsedExpr.expression && parsedExpr.expression.includes("z =")) {
          // 3D surface equations - render as contour for 2D view
          const size = 50
          const xStep = (memoizedGraphSettings.xMax - memoizedGraphSettings.xMin) / size
          const yStep = (memoizedGraphSettings.yMax - memoizedGraphSettings.yMin) / size

          const z = []
          const xGrid = []
          const yGrid = []

          for (let i = 0; i <= size; i++) {
            const x = memoizedGraphSettings.xMin + i * xStep
            xGrid.push(x)
          }

          for (let j = 0; j <= size; j++) {
            const y = memoizedGraphSettings.yMin + j * yStep
            yGrid.push(y)
            const row = []

            for (let i = 0; i <= size; i++) {
              const x = memoizedGraphSettings.xMin + i * xStep
              try {
                // Extract the right side of z = expression
                const zExpr = parsedExpr.expression.replace(/^z\s*=\s*/, "")
                const value = evaluateExpression(zExpr, { x, y, ...sliderValues })
                row.push(isFinite(value) ? value : 0)
              } catch (e) {
                row.push(0)
              }
            }
            z.push(row)
          }

          data.push({
            x: xGrid,
            y: yGrid,
            z: z,
            type: "contour",
            colorscale: "Viridis",
            showscale: true,
            name: expr.expression,
            hovertemplate: `x: %{x:.3f}<br>y: %{y:.3f}<br>z: %{z:.3f}<extra></extra>`,
          })
        }
      } catch (error) {
        console.warn("Error parsing expression:", expr.expression, error)
      }
    })

    console.log('generatePlotData: plotData', data)
    return data
  }, [expressions, sliders, memoizedGraphSettings])

  // Update plot data when dependencies change
  useEffect(() => {
    const newData = generatePlotData()
    setPlotData(newData)
  }, [expressions, sliders, memoizedGraphSettings])

  // Update layout with theme-aware colors and prevent flickering
  useEffect(() => {
    const isDark = theme === "dark"
    const backgroundColor = isDark ? "rgba(17, 24, 39, 1)" : "rgba(255, 255, 255, 1)"
    const textColor = isDark ? "#f9fafb" : "#111827"
    const gridColor = isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"
    const zeroLineColor = isDark ? "rgba(156, 163, 175, 0.6)" : "rgba(107, 114, 128, 0.6)"

    // No equation annotations
    const equationAnnotations: any[] = [];

    const newLayout = {
      title: {
        text: memoizedGraphSettings.title || "EQUANO Graph",
        font: { size: 16, color: textColor },
      },
      xaxis: {
        title: { text: memoizedGraphSettings.xLabel || "x", font: { color: textColor } },
        range: [memoizedGraphSettings.xMin, memoizedGraphSettings.xMax],
        showgrid: memoizedGraphSettings.showGrid,
        gridcolor: gridColor,
        zeroline: true,
        zerolinecolor: zeroLineColor,
        zerolinewidth: 1,
        tickfont: { color: textColor },
        visible: memoizedGraphSettings.showAxes,
      },
      yaxis: {
        title: { text: memoizedGraphSettings.yLabel || "y", font: { color: textColor } },
        range: [memoizedGraphSettings.yMin, memoizedGraphSettings.yMax],
        showgrid: memoizedGraphSettings.showGrid,
        gridcolor: gridColor,
        zeroline: true,
        zerolinecolor: zeroLineColor,
        zerolinewidth: 1,
        scaleanchor: memoizedGraphSettings.equalAspectRatio ? "x" : undefined,
        scaleratio: memoizedGraphSettings.equalAspectRatio ? 1 : undefined,
        tickfont: { color: textColor },
        visible: memoizedGraphSettings.showAxes,
      },
      plot_bgcolor: backgroundColor,
      paper_bgcolor: backgroundColor,
      font: { color: textColor },
      margin: { l: 60, r: 40, t: 60, b: 60 },
      showlegend: true,
      legend: {
        x: 1,
        y: 1,
        bgcolor: isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)",
        bordercolor: isDark ? "rgba(75, 85, 99, 0.5)" : "rgba(209, 213, 219, 0.5)",
        borderwidth: 1,
        font: { color: textColor },
      },
      hovermode: "closest",
      datarevision: Date.now() + (sliders.map(s => s.value).join(',')), // Force data update on slider changes
      annotations: equationAnnotations,
    }

    setLayout(newLayout)
  }, [memoizedGraphSettings, theme, expressions, sliders])

  const resetView = () => {
    updateGraphSettings({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
    })
    toast({
      title: "View Reset",
      description: "Graph view has been reset to default range.",
    })
  }

  const fitToData = (showToast = false) => {
    if (plotData.length === 0) {
      if (showToast) {
        toast({
          title: "No Data",
          description: "Add some expressions to fit the view to data.",
          variant: "destructive",
        })
      }
      return
    }

    let xMin = Number.POSITIVE_INFINITY,
      xMax = Number.NEGATIVE_INFINITY
    let yMin = Number.POSITIVE_INFINITY,
      yMax = Number.NEGATIVE_INFINITY

    plotData.forEach((trace) => {
      if (trace.x && trace.y) {
        trace.x.forEach((x: number) => {
          if (isFinite(x)) {
            xMin = Math.min(xMin, x)
            xMax = Math.max(xMax, x)
          }
        })
        trace.y.forEach((y: number) => {
          if (isFinite(y)) {
            yMin = Math.min(yMin, y)
            yMax = Math.max(yMax, y)
          }
        })
      }
    })

    if (isFinite(xMin) && isFinite(xMax) && isFinite(yMin) && isFinite(yMax)) {
      const xPadding = (xMax - xMin) * 0.1
      const yPadding = (yMax - yMin) * 0.1

      updateGraphSettings({
        xMin: xMin - xPadding,
        xMax: xMax + xPadding,
        yMin: yMin - yPadding,
        yMax: yMax + yPadding,
      })

      toast({
        title: "View Fitted",
        description: "Graph view has been fitted to visible data.",
      })
    }
  }

  const handleExport = async (format: "png" | "svg" | "pdf" | "gif") => {
    const plotlyEl = plotRef.current?.el || plotRef.current;
    if (!plotlyEl) return;

    setIsExporting(true);
    try {
      await exportGraph(plotlyEl, format, memoizedGraphSettings.title || "equano-graph");
      toast({
        title: "Export Successful",
        description: `Graph exported as ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export graph. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }

  // Stable wheel handler with debug logging
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      console.log('Wheel event fired for zoom');
      const ZOOM_STEP = 0.04; // 4% per scroll event for smoother zoom
      const zoomFactor = event.deltaY > 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
      const currentXRange = memoizedGraphSettings.xMax - memoizedGraphSettings.xMin
      const currentYRange = memoizedGraphSettings.yMax - memoizedGraphSettings.yMin
      const newXRange = currentXRange * zoomFactor
      const newYRange = currentYRange * zoomFactor
      const xCenter = (memoizedGraphSettings.xMin + memoizedGraphSettings.xMax) / 2
      const yCenter = (memoizedGraphSettings.yMin + memoizedGraphSettings.yMax) / 2
      updateGraphSettings({
        xMin: xCenter - newXRange / 2,
        xMax: xCenter + newXRange / 2,
        yMin: yCenter - newYRange / 2,
        yMax: yCenter + newYRange / 2,
      })
    },
    [memoizedGraphSettings, updateGraphSettings],
  )

  // Robustly attach wheel event
  useEffect(() => {
    const plotElement = plotRef.current?.el || plotRef.current;
    if (!plotElement) return;
    function wheelListener(e: WheelEvent) {
      handleWheel(e);
    }
    plotElement.addEventListener("wheel", wheelListener, { passive: false });
    return () => {
      plotElement.removeEventListener("wheel", wheelListener);
    };
  }, [handleWheel, plotRef.current]);

  // Handle plot relayout to prevent feedback loops
  const handleRelayout = useCallback(
    (eventData: any) => {
      if (isUpdatingFromPlot) return

      if (eventData["xaxis.range[0]"] !== undefined && eventData["yaxis.range[0]"] !== undefined) {
        setIsUpdatingFromPlot(true)

        // Use setTimeout to prevent immediate re-render
        setTimeout(() => {
          updateGraphSettings({
            xMin: eventData["xaxis.range[0]"],
            xMax: eventData["xaxis.range[1]"],
            yMin: eventData["yaxis.range[0]"],
            yMax: eventData["yaxis.range[1]"],
          })
          setIsUpdatingFromPlot(false)
        }, 100)
      }
    },
    [isUpdatingFromPlot, updateGraphSettings],
  )

  useEffect(() => {
    const timer = setTimeout(() => setShowZoomHint(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // React to fitToDataTrigger changes
  useEffect(() => {
    if (fitToDataTrigger !== undefined) {
      fitToData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitToDataTrigger])

  // React to exportFormat changes: set pending export
  useEffect(() => {
    if (exportFormat) {
      setPendingExport(exportFormat)
    }
  }, [exportFormat])

  // onAfterPlot: if pendingExport, do export (only if not already exporting)
  const handleAfterPlot = useCallback(() => {
    if (pendingExport && !isExporting) {
      setIsExporting(true)
      handleExport(pendingExport as any)
        .catch(() => {})
        .finally(() => {
          setPendingExport(null)
          setIsExporting(false)
          if (onExported) onExported()
        })
    }
  }, [pendingExport, isExporting, handleExport, onExported])

  // Animation loop for t variable
  useEffect(() => {
    let animationFrame: number | null = null;
    let lastTime = performance.now();

    function animate(now: number) {
      if (isAnimating) {
        const tSlider = sliders.find((s) => s.variable === "t");
        if (tSlider) {
          const dt = (now - lastTime) / 1000; // seconds
          lastTime = now;
          
          // Calculate new value with continuous wrapping
          let newValue = tSlider.value + dt * 2 * Math.PI * 0.45;
          if (newValue > tSlider.max) {
            newValue = tSlider.min + (newValue - tSlider.max);
          }
          
          // Always update without threshold check for smooth animation
          updateSlider("t", { value: newValue });
        }
        animationFrame = requestAnimationFrame(animate);
      }
    }

    if (isAnimating) {
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating, sliders, updateSlider]);

  // Debug slider manual changes
  const handleSliderChange = useCallback((variable: string, value: number) => {
    console.log('Slider changed:', variable, value);
    updateSlider(variable, { value });
  }, [updateSlider]);

  // Render either 2D or 3D view
  if (is3DMode) {
    return <ThreeDCanvas expressions={expressions} sliderValues={sliderValues} isAnimating={isAnimating} />;
  }

  return (
    <div className="flex-1 relative bg-background min-w-0">
      {/* Main Plot */}
      <Plot
        ref={plotRef}
        data={plotData}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            "pan2d",
            "lasso2d",
            "select2d",
            "autoScale2d",
            "zoom2d",
            "zoomIn2d",
            "zoomOut2d",
            "resetScale2d",
            "toImage"
          ],
          displaylogo: false,
          toImageButtonOptions: {
            format: "png",
            filename: memoizedGraphSettings.title || "equano-graph",
            height: 800,
            width: 1200,
            scale: 2,
          },
          scrollZoom: false, // We handle zoom manually
        }}
        style={{ width: "100%", height: "100%" }}
        onRelayout={handleRelayout}
        useResizeHandler={true}
        className="w-full h-full"
        onAfterPlot={handleAfterPlot}
      />

      {/* Zoom hint popup */}
      {showZoomHint && (
        <div className="absolute left-1/2 top-8 -translate-x-1/2 z-20 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-2 rounded shadow-lg">
          Hold Ctrl/Cmd + scroll to zoom
        </div>
      )}
    </div>
  )
}

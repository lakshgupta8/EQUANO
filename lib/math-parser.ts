"use client"

import { evaluate, parse, type MathNode } from "mathjs"

export interface ParsedExpression {
  type: "function" | "parametric" | "polar" | "implicit" | "inequality" | "expression"
  expression?: string
  leftSide?: string
  rightSide?: string
  xExpr?: string
  yExpr?: string
  variables: string[]
}

export function parseExpression(expr: string, variables: Record<string, number> = {}): ParsedExpression {
  const cleanExpr = expr.trim().replace(/\s+/g, " ")

  // Function: y = f(x)
  if (cleanExpr.match(/^y\s*=\s*.+/)) {
    const expression = cleanExpr.replace(/^y\s*=\s*/, "")
    return {
      type: "function",
      expression,
      variables: extractVariables(expression),
    }
  }

  // Parametric: x = f(t), y = g(t) or (f(t), g(t))
  if (cleanExpr.includes(",") && (cleanExpr.includes("x=") || cleanExpr.includes("("))) {
    const parts = cleanExpr.split(",").map((p) => p.trim())
    if (parts.length === 2) {
      let xExpr = "",
        yExpr = ""

      if (parts[0].includes("x=") && parts[1].includes("y=")) {
        xExpr = parts[0].replace(/^x\s*=\s*/, "")
        yExpr = parts[1].replace(/^y\s*=\s*/, "")
      } else if (parts[0].startsWith("(") && parts[1].endsWith(")")) {
        xExpr = parts[0].replace(/^\(\s*/, "")
        yExpr = parts[1].replace(/\s*\)$/, "")
      } else {
        xExpr = parts[0]
        yExpr = parts[1]
      }

      return {
        type: "parametric",
        xExpr,
        yExpr,
        variables: [...extractVariables(xExpr), ...extractVariables(yExpr)],
      }
    }
  }

  // Polar: r = f(θ) or r = f(theta)
  if (cleanExpr.match(/^r\s*=\s*.+/)) {
    const expression = cleanExpr.replace(/^r\s*=\s*/, "").replace(/θ/g, "theta")
    return {
      type: "polar",
      expression,
      variables: extractVariables(expression),
    }
  }

  // Inequality: contains >, <, >=, <=
  if (cleanExpr.match(/[<>]=?/)) {
    const operators = [">=", "<=", ">", "<"]
    let operator = ""
    let leftSide = ""
    let rightSide = ""

    for (const op of operators) {
      if (cleanExpr.includes(op)) {
        operator = op
        const parts = cleanExpr.split(op)
        leftSide = parts[0].trim()
        rightSide = parts[1].trim()
        break
      }
    }

    return {
      type: "inequality",
      leftSide,
      rightSide,
      variables: [...extractVariables(leftSide), ...extractVariables(rightSide)],
    }
  }

  // Implicit: contains = but not y= or r=
  if (cleanExpr.includes("=") && !cleanExpr.match(/^[yr]\s*=/)) {
    const parts = cleanExpr.split("=")
    if (parts.length === 2) {
      return {
        type: "implicit",
        leftSide: parts[0].trim(),
        rightSide: parts[1].trim(),
        variables: [...extractVariables(parts[0]), ...extractVariables(parts[1])],
      }
    }
  }

  // Default: treat as expression
  return {
    type: "expression",
    expression: cleanExpr,
    variables: extractVariables(cleanExpr),
  }
}

export function evaluateExpression(expr: string, variables: Record<string, number> = {}): number {
  try {
    // Replace common mathematical constants and functions
    const processedExpr = expr.replace(/π/g, "pi").replace(/θ/g, "theta").replace(/\^/g, "^").replace(/√/g, "sqrt")

    // Create scope with variables
    const scope = {
      ...variables,
      pi: Math.PI,
      e: Math.E,
      theta: variables.theta || variables.θ || 0,
    }

    return evaluate(processedExpr, scope)
  } catch (error) {
    throw new Error(`Invalid expression: ${expr}`)
  }
}

export function extractVariables(expr: string): string[] {
  try {
    const node = parse(expr)
    const variables = new Set<string>()

    node.traverse((node: MathNode) => {
      if (node.type === "SymbolNode") {
        const name = (node as any).name
        // Exclude mathematical constants and functions
        if (!["pi", "e", "sin", "cos", "tan", "log", "ln", "sqrt", "abs", "exp"].includes(name)) {
          variables.add(name)
        }
      }
    })

    return Array.from(variables)
  } catch (error) {
    // Fallback: simple regex extraction
    const matches = expr.match(/\b([a-zA-Z])\b/g) || []
    return [...new Set(matches.filter((v) => !["sin", "cos", "tan", "log", "ln", "exp", "pi", "e"].includes(v)))]
  }
}

export function validateExpression(expr: string): { valid: boolean; error?: string } {
  try {
    parse(expr)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid expression",
    }
  }
}

export function formatExpression(expr: string): string {
  try {
    const node = parse(expr)
    return node.toString()
  } catch (error) {
    return expr
  }
}

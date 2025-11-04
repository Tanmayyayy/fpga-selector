// Mock API for FPGA Selector Tool
// This simulates the backend functionality entirely in the frontend

// Mock FPGA boards database
const FPGA_BOARDS = [
  {
    id: "spartan6_lx9",
    name: "Xilinx Spartan-6 LX9",
    luts: 3840,
    io_pins: 102,
    frequency: "200MHz",
    features: ["Low Power", "USB", "Beginner Friendly", "Cost Effective"],
    price_range: "Low",
    description: "Entry-level FPGA perfect for learning and simple designs"
  },
  {
    id: "max10_10m08",
    name: "Intel MAX10 10M08",
    luts: 8000,
    io_pins: 176,
    frequency: "250MHz",
    features: ["Flash-based", "ADC", "Industrial Use", "Instant-on"],
    price_range: "Medium",
    description: "Flash-based FPGA with built-in ADC, great for industrial applications"
  },
  {
    id: "artix7_35t",
    name: "Xilinx Artix-7 35T",
    luts: 33280,
    io_pins: 285,
    frequency: "450MHz",
    features: ["High Performance", "DDR3", "PCIe", "Advanced Features"],
    price_range: "Medium",
    description: "Mid-range FPGA with excellent performance and features"
  },
  {
    id: "cyclone4_10cl006",
    name: "Intel Cyclone IV 10CL006",
    luts: 6272,
    io_pins: 179,
    frequency: "250MHz",
    features: ["Low Power", "Cost Effective", "Good I/O"],
    price_range: "Low",
    description: "Cost-effective FPGA with good I/O capabilities"
  },
  {
    id: "spartan7_50t",
    name: "Xilinx Spartan-7 50T",
    luts: 52160,
    io_pins: 400,
    frequency: "400MHz",
    features: ["High I/O", "Advanced Features", "Good Performance"],
    price_range: "Medium",
    description: "High I/O count FPGA for complex designs"
  },
  {
    id: "cyclone5_5cgxfc7",
    name: "Intel Cyclone V 5CGXFC7",
    luts: 77000,
    io_pins: 622,
    frequency: "500MHz",
    features: ["High Performance", "Large Capacity", "Advanced Features"],
    price_range: "High",
    description: "High-performance FPGA for complex applications"
  },
  {
    id: "kintex7_160t",
    name: "Xilinx Kintex-7 160T",
    luts: 254200,
    io_pins: 600,
    frequency: "600MHz",
    features: ["Ultra High Performance", "Large Capacity", "Advanced Features"],
    price_range: "High",
    description: "Ultra high-performance FPGA for demanding applications"
  },
  {
    id: "artix7_100t",
    name: "Xilinx Artix-7 100T",
    luts: 101440,
    io_pins: 500,
    frequency: "500MHz",
    features: ["High Performance", "Good Balance", "Advanced Features"],
    price_range: "Medium-High",
    description: "High-performance FPGA with good feature balance"
  },
  {
    id: "spartan6_lx45",
    name: "Xilinx Spartan-6 LX45",
    luts: 43661,
    io_pins: 296,
    frequency: "300MHz",
    features: ["Good Performance", "Cost Effective", "Reliable"],
    price_range: "Medium",
    description: "Reliable mid-range FPGA with good performance"
  },
  {
    id: "max10_10m50",
    name: "Intel MAX10 10M50",
    luts: 50000,
    io_pins: 288,
    frequency: "300MHz",
    features: ["Flash-based", "Good Performance", "Industrial Use"],
    price_range: "Medium",
    description: "Flash-based FPGA with good performance for industrial use"
  }
];

// Verilog analyzer functions
const analyzeVerilog = (code) => {
  const gatePatterns = {
    'and': /\band\b/gi,
    'or': /\bor\b/gi,
    'not': /\bnot\b/gi,
    'nand': /\bnand\b/gi,
    'nor': /\bnor\b/gi,
    'xor': /\bxor\b/gi,
    'xnor': /\bxnor\b/gi,
    'buf': /\bbuf\b/gi
  };

  const modulePatterns = {
    'input': /\binput\s+(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/gi,
    'output': /\boutput\s+(?:reg\s+)?(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/gi,
    'wire': /\bwire\s+(?:\[(\d+):(\d+)\]\s+)?(\w+)/gi,
    'reg': /\breg\s+(?:\[(\d+):(\d+)\]\s+)?(\w+)/gi,
    'always': /\balways\s+@/gi,
    'assign': /\bassign\s+/gi,
    'if': /\bif\s*\(/gi,
    'case': /\bcase\b/gi,
    'for': /\bfor\s*\(/gi,
    'while': /\bwhile\s*\(/gi
  };

  // Basic syntax validation
  if (!/\bmodule\s+\w+/.test(code) || !/\bendmodule\b/.test(code)) {
    return {
      compilation_success: false,
      compilation_error: "Basic syntax validation failed - missing module/endmodule",
      analysis: null
    };
  }

  // Count gates
  const gateCounts = {};
  for (const [gateType, pattern] of Object.entries(gatePatterns)) {
    const matches = code.match(pattern);
    gateCounts[gateType] = matches ? matches.length : 0;
  }

  // Count I/O and wires
  const ioCounts = {
    inputs: 0,
    outputs: 0,
    wires: 0,
    registers: 0
  };

  // Count inputs
  const inputMatches = [...code.matchAll(modulePatterns.input)];
  for (const match of inputMatches) {
    if (match[1] && match[2]) {
      const msb = parseInt(match[1]);
      const lsb = parseInt(match[2]);
      ioCounts.inputs += Math.abs(msb - lsb) + 1;
    } else {
      ioCounts.inputs += 1;
    }
  }

  // Count outputs
  const outputMatches = [...code.matchAll(modulePatterns.output)];
  for (const match of outputMatches) {
    if (match[1] && match[2]) {
      const msb = parseInt(match[1]);
      const lsb = parseInt(match[2]);
      ioCounts.outputs += Math.abs(msb - lsb) + 1;
    } else {
      ioCounts.outputs += 1;
    }
  }

  // Count wires
  const wireMatches = [...code.matchAll(modulePatterns.wire)];
  for (const match of wireMatches) {
    if (match[1] && match[2]) {
      const msb = parseInt(match[1]);
      const lsb = parseInt(match[2]);
      ioCounts.wires += Math.abs(msb - lsb) + 1;
    } else {
      ioCounts.wires += 1;
    }
  }

  // Count registers
  const regMatches = [...code.matchAll(modulePatterns.reg)];
  for (const match of regMatches) {
    if (match[1] && match[2]) {
      const msb = parseInt(match[1]);
      const lsb = parseInt(match[2]);
      ioCounts.registers += Math.abs(msb - lsb) + 1;
    } else {
      ioCounts.registers += 1;
    }
  }

  // Count control structures
  const controlCounts = {};
  for (const [structure, pattern] of Object.entries(modulePatterns)) {
    if (['always', 'assign', 'if', 'case', 'for', 'while'].includes(structure)) {
      const matches = code.match(pattern);
      controlCounts[structure] = matches ? matches.length : 0;
    }
  }

  // Estimate resources
  const totalGates = Object.values(gateCounts).reduce((sum, count) => sum + count, 0);
  
  // Calculate base LUT count from gates
  let baseLuts = 0;
  baseLuts += (gateCounts.and || 0) * 1; // 1 LUT per AND
  baseLuts += (gateCounts.or || 0) * 1;  // 1 LUT per OR
  baseLuts += (gateCounts.not || 0) * 0.5; // 0.5 LUT per NOT (often combined)
  baseLuts += (gateCounts.nand || 0) * 1; // 1 LUT per NAND
  baseLuts += (gateCounts.nor || 0) * 1;  // 1 LUT per NOR
  baseLuts += (gateCounts.xor || 0) * 1;  // 1 LUT per XOR
  baseLuts += (gateCounts.xnor || 0) * 1; // 1 LUT per XNOR
  baseLuts += (gateCounts.buf || 0) * 0.5; // 0.5 LUT per BUF (often optimized out)

  // Add LUTs for control structures
  let controlLuts = 0;
  controlLuts += (controlCounts.always || 0) * 3; // State machine overhead
  controlLuts += (controlCounts.if || 0) * 2;     // Conditional logic
  controlLuts += (controlCounts.case || 0) * 4;   // Case statement decoder
  controlLuts += (controlCounts.for || 0) * 5;    // Loop counter and logic
  controlLuts += (controlCounts.while || 0) * 4;  // Loop condition logic
  controlLuts += (controlCounts.assign || 0) * 1; // Simple assignments

  // Add LUTs for wide signals
  let signalLuts = 0;
  const countBits = (matches) => {
    return matches.reduce((sum, match) => {
      if (match[1] && match[2]) {
        const msb = parseInt(match[1]);
        const lsb = parseInt(match[2]);
        return sum + Math.abs(msb - lsb) + 1;
      }
      return sum + 1;
    }, 0);
  };

  const inputBits = countBits([...code.matchAll(modulePatterns.input)]);
  const outputBits = countBits([...code.matchAll(modulePatterns.output)]);
  signalLuts += Math.ceil((inputBits + outputBits) * 0.25); // Wide I/O handling

  // Calculate total estimated LUTs with minimum value
  const estimatedLuts = Math.max(
    Math.ceil(baseLuts + controlLuts + signalLuts),
    Math.ceil(totalGates * 0.75), // Ensure reasonable minimum based on gates
    5 // Absolute minimum for any design
  );

  // Estimate flip-flops based on registers and control structures
  const estimatedFlipFlops = Math.max(
    ioCounts.registers + 
    (controlCounts.always || 0) * 4 + // State registers
    (controlCounts.for || 0) * 2 +    // Loop counters
    Math.ceil(outputBits * 0.5),      // Output registers
    1 // Minimum flip-flops
  );

  // Calculate complexity score
  const totalControl = Object.values(controlCounts).reduce((sum, count) => sum + count, 0);
  
  // Calculate weighted complexity factors
  const gateComplexity = totalGates * 1;
  const controlComplexity = (
    (controlCounts.always || 0) * 10 +  // State machines are complex
    (controlCounts.case || 0) * 8 +     // Case statements add significant complexity
    (controlCounts.for || 0) * 6 +      // Loops are moderately complex
    (controlCounts.while || 0) * 6 +    // While loops similar to for loops
    (controlCounts.if || 0) * 3 +       // If statements add some complexity
    (controlCounts.assign || 0) * 1     // Assignments are simple
  );
  const ioComplexity = Math.ceil((inputBits + outputBits) * 0.5); // Wide I/O adds complexity
  const registerComplexity = ioCounts.registers * 2;               // Registers add state complexity
  
  const complexity = gateComplexity + controlComplexity + ioComplexity + registerComplexity;
  
  let complexityScore = "Low";
  if (complexity >= 150) complexityScore = "High";
  else if (complexity >= 40) complexityScore = "Medium";

  return {
    compilation_success: true,
    compilation_message: "Compilation successful (mock)",
    compilation_error: null,
    analysis: {
      gate_counts: gateCounts,
      io_counts: ioCounts,
      control_counts: controlCounts,
      estimated_luts: estimatedLuts,
      estimated_flip_flops: estimatedFlipFlops,
      complexity_score: complexityScore,
      total_gates: totalGates,
      total_io: ioCounts.inputs + ioCounts.outputs
    }
  };
};

// Board matching function
const getBoardRecommendations = (analysis) => {
  const { 
    estimated_luts, 
    total_io, 
    complexity_score,
    estimated_flip_flops,
    control_counts
  } = analysis;
  
  // Calculate resource margins
  const minLutMargin = 1.2;  // 20% minimum overhead
  const minIoMargin = 1.15;  // 15% minimum overhead
  const idealLutMargin = 2.0; // Ideal is 100% room for growth
  const idealIoMargin = 1.5;  // Ideal is 50% room for growth

  const recommendations = FPGA_BOARDS
    .filter(board => {
      // Basic requirements
      const hasEnoughLuts = board.luts >= estimated_luts * minLutMargin;
      const hasEnoughIo = board.io_pins >= total_io * minIoMargin;
      
      // Complexity requirements
      const isComplexityMatch = 
        (complexity_score === "High" && board.features.some(f => f.includes("High Performance"))) ||
        (complexity_score === "Low" && board.features.some(f => f.includes("Beginner Friendly"))) ||
        complexity_score === "Medium";

      return hasEnoughLuts && hasEnoughIo && isComplexityMatch;
    })
    .map(board => {
      // Calculate detailed scores
      const lutMargin = board.luts / estimated_luts;
      const ioMargin = board.io_pins / total_io;
      
      // LUT utilization score (penalize both under and over-provisioning)
      const lutScore = lutMargin <= idealLutMargin
        ? (lutMargin - minLutMargin) / (idealLutMargin - minLutMargin) * 100
        : Math.max(0, 100 - (lutMargin - idealLutMargin) * 20);
      
      // I/O utilization score
      const ioScore = ioMargin <= idealIoMargin
        ? (ioMargin - minIoMargin) / (idealIoMargin - minIoMargin) * 100
        : Math.max(0, 100 - (ioMargin - idealIoMargin) * 20);

      // Feature matching score
      let featureScore = 0;
      if (complexity_score === "High") {
        featureScore += board.features.includes("High Performance") ? 20 : 0;
        featureScore += board.features.includes("Advanced Features") ? 15 : 0;
        featureScore += board.features.includes("Large Capacity") ? 15 : 0;
      } else if (complexity_score === "Medium") {
        featureScore += board.features.includes("Good Performance") ? 20 : 0;
        featureScore += board.features.includes("Good Balance") ? 15 : 0;
      } else {
        featureScore += board.features.includes("Beginner Friendly") ? 20 : 0;
        featureScore += board.features.includes("Cost Effective") ? 15 : 0;
      }

      // Price range score (prefer cost-effective solutions unless high complexity)
      const priceScore = 
        (complexity_score === "High" && board.price_range === "High") ? 20 :
        (complexity_score === "Medium" && board.price_range === "Medium") ? 20 :
        (complexity_score === "Low" && board.price_range === "Low") ? 20 : 10;

      // Calculate final score with weights
      const score = (
        lutScore * 0.35 +      // LUT utilization is most important
        ioScore * 0.25 +       // I/O utilization is second
        featureScore * 0.25 +  // Features matter for usability
        priceScore * 0.15      // Price is a factor but not dominant
      );

      // Generate detailed reasons
      const reasons = [];
      
      // Resource reasons
      if (lutMargin >= idealLutMargin) {
        reasons.push(`Excellent LUT capacity (${Math.floor(lutMargin * 100 - 100)}% headroom)`);
      } else if (lutMargin >= minLutMargin * 1.5) {
        reasons.push(`Good LUT capacity (${Math.floor(lutMargin * 100 - 100)}% headroom)`);
      } else {
        reasons.push(`Sufficient LUT capacity (${Math.floor(lutMargin * 100 - 100)}% headroom)`);
      }

      if (ioMargin >= idealIoMargin) {
        reasons.push(`Excellent I/O count (${Math.floor(ioMargin * 100 - 100)}% extra)`);
      } else if (ioMargin >= minIoMargin * 1.3) {
        reasons.push(`Good I/O count (${Math.floor(ioMargin * 100 - 100)}% extra)`);
      } else {
        reasons.push(`Adequate I/O pins (${Math.floor(ioMargin * 100 - 100)}% extra)`);
      }

      // Feature reasons
      if (board.features.includes("Beginner Friendly") && complexity_score === "Low") {
        reasons.push("Perfect for learning and development");
      }
      if (board.features.includes("High Performance") && complexity_score === "High") {
        reasons.push("Matches your design's performance needs");
      }
      if (board.features.includes("Cost Effective")) {
        reasons.push("Cost-effective solution");
      }
      if (board.features.includes("Advanced Features") && control_counts.always > 2) {
        reasons.push("Supports complex state machines");
      }
      if (board.features.includes("Large Capacity") && estimated_flip_flops > 100) {
        reasons.push("Good for register-heavy designs");
      }

      return {
        board,
        score,
        reasons,
        match_percentage: Math.min(Math.round(score), 100)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return recommendations;
};

// Mock API functions
export const analyzeCode = async (code) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const analysis = analyzeVerilog(code);
  if (!analysis.compilation_success) {
    return analysis;
  }

  const recommendations = getBoardRecommendations(analysis.analysis);
  
  return {
    success: true,
    compilation_success: true,
    compilation_message: analysis.compilation_message,
    compilation_error: null,
    analysis: analysis.analysis,
    recommendations
  };
};

export const uploadFile = async (file) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        success: true,
        filename: file.name,
        code: e.target.result,
        message: "File uploaded successfully"
      });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

export const getBoards = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return { boards: FPGA_BOARDS };
};

export const getBoardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const luts = FPGA_BOARDS.map(b => b.luts);
  const ioPins = FPGA_BOARDS.map(b => b.io_pins);
  
  return {
    total_boards: FPGA_BOARDS.length,
    board_ranges: {
      luts: { min: Math.min(...luts), max: Math.max(...luts) },
      io_pins: { min: Math.min(...ioPins), max: Math.max(...ioPins) }
    }
  };
};

export const healthCheck = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  };
}; 

// Multi-AI Comparison call (backend)
export const compareAIs = async ({ code, analysis, recommendations }) => {
  const resp = await fetch('http://localhost:3001/api/llm/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, analysis, recommendations })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(text || 'Multi-AI comparison error');
  }
  return resp.json();
};

// Google Gemini LLM call (backend)
export const askLLM = async ({ code, analysis, recommendations, userQuestion }) => {
  const resp = await fetch('http://localhost:3001/api/llm/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, analysis, recommendations, userQuestion })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(text || 'Google Gemini API error');
  }
  return resp.json();
};
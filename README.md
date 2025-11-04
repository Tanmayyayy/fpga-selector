# FPGA Selector Tool

A production-quality tool that assists engineers and students working with Verilog by analyzing their code and recommending the most suitable FPGA boards.

## 🌐 Live Site

**Frontend (GitHub Pages):** https://tanmayyayy.github.io/fpga-selector/

The frontend is live and fully functional! The backend (for AI features) can be deployed separately - see [Backend Deployment Guide](BACKEND_DEPLOYMENT.md).

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** (for React app)
- **npm** (comes with Node.js)

### Installation & Running

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## ✨ Features

- **Code Analysis**: Upload or write Verilog code and get detailed resource analysis
- **FPGA Recommendations**: Get matched FPGA boards based on your design requirements
- **Professional UI**: Clean, modern interface with dark/light mode support
- **Static Analysis**: Analyzes Verilog code without external dependencies
- **Resource Estimation**: Counts gates, I/O, wires, and estimates LUTs/flip-flops

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Analysis**: Pure JavaScript Verilog parser
- **Database**: Embedded JSON database of FPGA boards
- **No Backend Required**: Everything runs in the browser

## 📁 Project Structure

```
fpga-selector/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/           # API utilities (mock)
│   │   └── App.js           # Main application
│   ├── public/              # Static files
│   └── package.json         # Dependencies
├── examples/                # Sample Verilog files
│   ├── simple_counter.v
│   └── complex_alu.v
└── README.md               # This file
```

## 🎯 How It Works

1. **Code Input**: Upload a `.v` file or write code in the built-in editor
2. **Analysis**: The tool analyzes your Verilog code using regex patterns to count:
   - Logic gates (AND, OR, NOT, XOR, etc.)
   - Inputs, outputs, wires, and registers
   - Control structures (always blocks, if statements, etc.)
3. **Resource Estimation**: Estimates LUTs and flip-flops based on the analysis
4. **Board Matching**: Compares your requirements with the FPGA board database
5. **Recommendations**: Returns the top 3 matching boards with reasons

## 📊 FPGA Board Database

The tool includes a comprehensive database of 10 popular FPGA boards:

- **Entry Level**: Xilinx Spartan-6, Intel MAX10
- **Mid Range**: Xilinx Artix-7, Intel Cyclone IV/V
- **High Performance**: Xilinx Kintex-7, Advanced Artix-7

Each board includes:
- LUT count and I/O pins
- Operating frequency
- Features and use cases
- Price range
- Detailed description

## 🎨 UI Features

- **Dark/Light Mode**: Toggle between themes
- **File Upload**: Drag & drop `.v` files
- **Code Editor**: Built-in Verilog editor with syntax highlighting
- **Responsive Design**: Works on desktop and tablet
- **Loading States**: Smooth animations and feedback
- **Error Handling**: Clear error messages and validation

## 🔧 Development

### Adding New FPGA Boards

Edit `frontend/src/utils/api.js` and add new boards to the `FPGA_BOARDS` array:

```javascript
{
  id: "your_board_id",
  name: "Your FPGA Board Name",
  luts: 50000,
  io_pins: 300,
  frequency: "400MHz",
  features: ["Feature1", "Feature2"],
  price_range: "Medium",
  description: "Description of the board"
}
```

### Customizing Analysis

The Verilog analysis logic is in the `analyzeVerilog` function in `frontend/src/utils/api.js`. You can modify:

- Gate detection patterns
- Resource estimation algorithms
- Complexity scoring
- Board matching criteria

## 🧪 Testing

Try the included example files:

1. **Simple Counter** (`examples/simple_counter.v`): Basic 8-bit counter
2. **Complex ALU** (`examples/complex_alu.v`): 16-bit arithmetic logic unit

## 📈 Future Enhancements

- **Real Compilation**: Integrate with iverilog for actual compilation
- **More Boards**: Expand the FPGA database
- **Export Features**: Generate reports and documentation
- **Advanced Analysis**: More sophisticated resource estimation
- **User Accounts**: Save and share analyses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that Node.js and npm are installed
2. Ensure all dependencies are installed (`npm install`)
3. Try clearing the browser cache
4. Check the browser console for errors

---

**Built with ❤️ for the FPGA community** 
// Test script for Google Gemini AI
const testData = {
  code: "module test(input, output); input clk; output reg [3:0] count; always @(posedge clk) count <= count + 1; endmodule",
  analysis: { estimated_luts: 10, total_io: 5 },
  recommendations: [],
  userQuestion: "Explain this code"
};

fetch('http://localhost:3001/api/llm/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('AI Response:', data);
  if (data.success) {
    console.log('✅ AI is working!');
    console.log('Answer:', data.answer.substring(0, 200) + '...');
  } else {
    console.log('❌ AI Error:', data.error);
  }
})
.catch(err => console.log('❌ Request Error:', err));


module complex_alu (
    input wire [15:0] a,
    input wire [15:0] b,
    input wire [3:0] op,
    input wire clk,
    input wire reset,
    output reg [15:0] result,
    output reg [3:0] flags
);

    // Internal signals
    reg [15:0] temp_result;
    reg carry, zero, negative, overflow;
    
    // ALU operations
    always @(*) begin
        case (op)
            4'b0000: temp_result = a + b;      // ADD
            4'b0001: temp_result = a - b;      // SUB
            4'b0010: temp_result = a & b;      // AND
            4'b0011: temp_result = a | b;      // OR
            4'b0100: temp_result = a ^ b;      // XOR
            4'b0101: temp_result = ~a;         // NOT
            4'b0110: temp_result = a << 1;     // SHL
            4'b0111: temp_result = a >> 1;     // SHR
            4'b1000: temp_result = a * b;      // MUL
            4'b1001: temp_result = a / b;      // DIV
            default: temp_result = 16'b0;
        endcase
    end
    
    // Flag generation
    always @(*) begin
        zero = (temp_result == 16'b0);
        negative = temp_result[15];
        carry = (op == 4'b0000) && (a + b < a);
        overflow = (op == 4'b0000) && (a[15] == b[15]) && (temp_result[15] != a[15]);
    end
    
    // Sequential logic
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            result <= 16'b0;
            flags <= 4'b0;
        end else begin
            result <= temp_result;
            flags <= {carry, zero, negative, overflow};
        end
    end

endmodule
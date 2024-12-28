# Privacy Policy Analyzer

## Setup Instructions

### Extension Setup
1. Load the extension in Chrome...
[extension setup instructions]

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd policy-analyzer-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   - Copy `.env.example` to `.env`
   - Replace `your_api_key_here` with your actual OpenAI API key

4. Start the server:
   ```bash
   node server.js
   ```
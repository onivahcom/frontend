import fs from 'fs';

const filePath = './src/screens/rough/Rough.jsx';

// ✅ Check if file exists BEFORE trying to read it
if (!fs.existsSync(filePath)) {
    console.error("❌ File not found at:", filePath);
    process.exit(1);
}

async function updateComponent(userCommand) {
    const existingCode = fs.readFileSync(filePath, 'utf8');

    const prompt = `
You are a helpful React coding assistant.

Given this existing component:
---
${existingCode}
---

Apply the following instruction:
"${userCommand}"

Make sure to:
- Use a valid functional React component
- Use ES6 syntax
- Return the full updated code
- Include: const Rough = () => { ... }
- End with: export default Rough
`;

    // ✅ Call LM Studio's local API (OpenAI format)
    const res = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'lmstudio',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that edits React components.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });

    const data = await res.json();

    // ✅ Safely access the model's response
    const updatedCode = data.choices?.[0]?.message?.content?.trim();

    fs.writeFileSync(filePath, updatedCode);
    console.log('✅ Rough.jsx updated!');
}

// 🧠 Get user command from CLI
const userCommand = process.argv.slice(2).join(' ');

if (!userCommand) {
    console.log('❗ Please pass a command like:\nnode ai-writer-react.mjs "Add a Like button"');
    process.exit();
}

updateComponent(userCommand);


// import fs from 'fs';
// import path from 'path';

// // ✨ Set a dynamic file path — e.g., from CLI or hardcoded
// const filePath = './src/screens/features/NewFeature.jsx';

// // ✅ Step 1: Ensure the folder exists
// fs.mkdirSync(path.dirname(filePath), { recursive: true });

// // ✅ Step 2: If file doesn’t exist, create a starter
// if (!fs.existsSync(filePath)) {
//   fs.writeFileSync(filePath, '// Placeholder\n');
//   console.log(`📄 Created new file: ${filePath}`);
// }

// // ✅ Step 3: Read existing or placeholder code
// const existingCode = fs.readFileSync(filePath, 'utf8');

// // 🔮 Prompt the AI with the request
// const prompt = `
// You are a helpful React assistant.

// Create or update this component to fulfill the instruction:
// "Create a new feature component with a heading and a red button."

// Use functional React syntax (ES6).
// Return the full updated component. End with 'export default'.
// `;

// async function updateComponent() {
//   const res = await fetch('http://localhost:11434/api/generate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'mistral',
//       prompt,
//       stream: false
//     })
//   });

//   const data = await res.json();
//   const updatedCode = data.response.trim();

//   fs.writeFileSync(filePath, updatedCode);
//   console.log(`✅ File updated: ${filePath}`);
// }

// updateComponent();


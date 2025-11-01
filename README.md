# 🤖 Automated AI Interviewer

```
⚡ ◉ ◉ ⚡
┌─🤖─┐
├─⚙️─⚙️─┤
└─────┘
```

A modern, responsive web application that conducts automated AI-powered job interviews using voice interaction and real-time video feedback.

## ✨ Features

### 🎯 Core Functionality
- **Voice-to-Text Recognition** - Real-time speech recognition for natural conversation
- **AI-Powered Interviews** - Intelligent question generation based on job descriptions
- **Live Video Feed** - Mirror-view camera for realistic interview experience
- **Real-time Feedback** - Instant AI responses with text-to-speech
- **Interview Analytics** - Performance evaluation and detailed feedback

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Theme** - Professional dark interface with blue accent colors
- **Animated Robot Mascot** - Interactive ASCII art with subtle animations
- **Accessibility First** - ARIA labels, keyboard navigation, reduced motion support
- **Real-time Transcript** - Live display of speech recognition results

### 🔧 Technical Features
- **Chrome AI APIs** - Uses experimental Prompt API and Language Model
- **WebRTC Camera** - Real-time video streaming with mirror effect
- **Speech Synthesis** - AI responses are spoken aloud
- **Progressive Enhancement** - Graceful degradation for unsupported browsers
- **No Backend Required** - Runs entirely in the browser

## 🚀 Quick Start

### Prerequisites
- **Chrome Dev/Canary** with AI flags enabled
- **HTTPS connection** (required for camera and microphone access)
- **Microphone permissions** for voice input

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd automated-ai-interviewer
   ```

2. Serve the files over HTTPS:
   ```bash
   # Using Python
   python -m http.server 3000 --bind 127.0.0.1
   
   # Using Node.js
   npx serve . -p 3000
   
   # Using Live Server (VS Code extension)
   # Right-click index.html → "Open with Live Server"
   ```

3. Open in Chrome Dev/Canary:
   ```
   https://localhost:3000
   ```

### Chrome AI Setup
Enable the following flags in `chrome://flags/`:
- `#prompt-api-for-gemini-nano`
- `#optimization-guide-on-device-model`
- `#ai-prompt-api-multimodal-input`

## 🎮 How to Use

### Starting an Interview
1. **Grant Permissions** - Allow camera and microphone access
2. **Click "Start Listening"** - Begin voice recording
3. **Speak Your Response** - Answer the AI interviewer's questions
4. **Click "Stop Listening"** - End your response (or pause naturally)
5. **Get AI Feedback** - The AI will ask follow-up questions

### Controls
- **🎤 Start Listening** - Begin voice recording
- **⏹️ Stop Listening** - End current recording
- **🔄 Reset** - Clear conversation and restart interview
- **✅ Finish Interview** - Get comprehensive feedback and performance rating

### Interview Flow
1. **Introduction** - AI asks you to introduce yourself
2. **Technical Questions** - Job-specific technical inquiries
3. **Behavioral Questions** - Experience and situation-based questions
4. **Final Evaluation** - Comprehensive feedback with performance rating

## 🏗️ Project Structure

```
automated-ai-interviewer/
├── index.html          # Main HTML structure
├── style.css           # Modern responsive styles
├── script.js           # Core JavaScript functionality
└── README.md          # Project documentation
```

### Key Components

#### `index.html`
- Semantic HTML structure
- Accessibility attributes (ARIA labels)
- Responsive viewport configuration
- Google Fonts integration

#### `style.css`
- CSS Grid layout for responsive design
- CSS custom properties for theming
- Smooth animations and transitions
- Mobile-first responsive breakpoints
- Accessibility considerations (reduced motion)

#### `script.js`
- Chrome AI API integration
- Speech recognition and synthesis
- Camera stream management
- Interview state management
- Real-time UI updates

## 🎨 Design System

### Color Palette
```css
--bg: #0a0e1a              /* Primary background */
--bg-secondary: #111827     /* Secondary background */
--accent: #3b82f6           /* Primary accent (blue) */
--accent-light: #60a5fa     /* Light accent */
--success: #10b981          /* Success/candidate (green) */
--fg: #f8fafc              /* Primary text */
--muted: #94a3b8           /* Muted text */
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: SF Mono, Monaco, Roboto Mono
- **Sizes**: Fluid typography using `clamp()`
- **Weights**: 400, 500, 600, 700, 800

### Responsive Breakpoints
- **Desktop**: > 1024px (Two-column layout)
- **Tablet**: 768px - 1024px (Adjusted columns)
- **Mobile**: < 768px (Single column, stacked)
- **Small Mobile**: < 480px (Optimized spacing)

## 🔧 Configuration

### Job Description Customization
Edit the job details in `script.js`:

```javascript
const JOB_TITLE = "AI Scientist";
const JOB_DESCRIPTION = `
Your custom job description here...
`;
```

### AI Model Parameters
Adjust AI behavior in `script.js`:

```javascript
session = await LanguageModel.create({
  temperature: 0.3,    // Creativity level (0-1)
  topK: 3,            // Response diversity
  output: { language: "en" },
  initialPrompts: [{ role: "system", content: SYSTEM_PROMPT }],
});
```

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ **Chrome Dev/Canary** (with AI flags enabled)
- ⚠️ **Chrome Stable** (limited AI features)
- ❌ **Firefox, Safari, Edge** (AI APIs not available)

### Required APIs
- **Prompt API** (Chrome experimental)
- **Speech Recognition API** (WebKit/Chrome)
- **Speech Synthesis API** (Most modern browsers)
- **MediaDevices API** (Camera access)

## 🔒 Privacy & Security

### Data Handling
- **No Data Storage** - All processing happens locally
- **No Server Communication** - Runs entirely in browser
- **Local AI Processing** - Uses on-device language models
- **Temporary Sessions** - No persistent data storage

### Permissions Required
- **Microphone** - For voice input during interview
- **Camera** - For video feed display
- **HTTPS** - Required for secure API access

## 🚧 Known Limitations

### Technical Constraints
- **Chrome Only** - Requires Chrome with experimental AI flags
- **Internet Required** - For Google Fonts and initial model download
- **Performance** - AI processing may be slower on older devices
- **Language** - Currently optimized for English only

### Feature Limitations
- **No Recording** - Sessions are not saved or recorded
- **Single Session** - No multi-session interview tracking
- **Basic Analytics** - Limited performance metrics

## 🛠️ Development

### Local Development
```bash
# Clone and serve
git clone <repository-url>
cd automated-ai-interviewer
python -m http.server 3000

# Open in Chrome Dev/Canary
open https://localhost:3000
```

### Code Style
- **ES6+ JavaScript** - Modern JavaScript features
- **CSS Grid & Flexbox** - Modern layout techniques
- **Semantic HTML** - Accessible markup
- **Mobile-First** - Responsive design approach

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different screen sizes
5. Submit a pull request

## 📱 Mobile Experience

### Optimizations
- **Touch-Friendly** - 48px minimum touch targets
- **Responsive Layout** - Single column on mobile
- **Optimized Fonts** - Fluid typography scaling
- **Safe Areas** - Support for notched devices
- **Landscape Mode** - Optimized horizontal layout

## 🎯 Use Cases

### Educational
- **Interview Practice** - Students preparing for job interviews
- **Communication Skills** - Improving verbal communication
- **Technical Preparation** - Practice technical questions

### Professional
- **HR Training** - Training recruiters on interview techniques
- **Self-Assessment** - Personal interview skill evaluation
- **Mock Interviews** - Realistic interview simulation

### Research
- **AI Interaction Studies** - Human-AI communication research
- **Speech Recognition Testing** - Voice interface evaluation
- **UX Research** - Interview experience optimization

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Chrome Team** - For experimental AI APIs
- **Web Speech API** - For speech recognition capabilities
- **Inter Font** - By Rasmus Andersson
- **Modern CSS** - Inspired by contemporary design systems

## 📞 Support

### Troubleshooting
- **No AI Response**: Check Chrome flags and HTTPS connection
- **No Voice Recognition**: Verify microphone permissions
- **Camera Issues**: Ensure HTTPS and camera permissions
- **Performance Issues**: Try Chrome Canary with latest AI features

### Resources
- [Chrome AI Documentation](https://developer.chrome.com/docs/ai/)
- [Web Speech API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [WebRTC Documentation](https://webrtc.org/getting-started/)

---

**Built with ❤️ using modern web technologies and Chrome's Built-In AI APIs**
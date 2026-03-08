#  AI Chat Application

A modern, full-featured AI chat application built with Next.js and OpenAI. Experience seamless conversations with multiple AI models, beautiful UI, and powerful features.

## Features

### AI Chat
- **Multiple Model Support**: Choose from GPT-4o, GPT-4o-mini, GPT-4, or GPT-3.5-turbo
- **Streaming Responses**: Real-time streaming for instant feedback
- **Markdown Rendering**: Markdown support with syntax highlighting


### Chat Management
- **Chat History**: Persistent chat history stored locally
- **Rename Chats**: Customize chat titles
- **Delete Chats**: Remove unwanted conversations
- **Auto-titles**: Automatic title generation from first message


## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognizant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)


## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **AI Integration**: [OpenAI API](https://platform.openai.com/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)

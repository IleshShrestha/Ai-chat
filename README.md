# Cognizant - AI Chat Application

A modern, full-featured AI chat application built with Next.js and OpenAI. Experience seamless conversations with multiple AI models, beautiful UI, and powerful features.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-6.16.0-green)

## Features

### AI Chat
- **Multiple Model Support**: Choose from GPT-4o, GPT-4o-mini, GPT-4, or GPT-3.5-turbo
- **Streaming Responses**: Real-time streaming for instant feedback
- **Markdown Rendering**: Beautiful markdown support with syntax highlighting
- **Code Blocks**: Syntax-highlighted code blocks with proper formatting

### Chat Management
- **Chat History**: Persistent chat history stored locally
- **Create New Chats**: Start fresh conversations anytime
- **Rename Chats**: Customize chat titles
- **Delete Chats**: Remove unwanted conversations
- **Auto-titles**: Automatic title generation from first message

### Themes
- **Three Themes**: Light, Dark, and Green color schemes
- **Persistent Preferences**: Theme choice saved across sessions
- **Smooth Transitions**: Beautiful theme switching animations

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Powered by Motion (Framer Motion)
- **Auto-scroll**: Automatic scrolling to latest messages
- **Loading States**: Visual feedback during AI processing

### Technical Features
- **TypeScript**: Full type safety
- **Server-Sent Events**: Efficient streaming implementation
- **Local Storage**: Client-side chat persistence
- **Custom Hooks**: Reusable React hooks for chat functionality

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

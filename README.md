# 🏔️ Nepal Counselor Tool

[![CI](https://github.com/scuba3198/nep-counselor-tool/actions/workflows/ci.yml/badge.svg)](https://github.com/scuba3198/nep-counselor-tool/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Codecov](https://codecov.io/gh/scuba3198/nep-counselor-tool/branch/main/graph/badge.svg)](https://codecov.io/gh/scuba3198/nep-counselor-tool)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

<ctrl94> [!NOTE]
> **Empowering Nepali Counselors with AI.** Nepal Counselor Tool is a state-of-the-art platform designed to streamline guidance and support services with a focus on local context and premium user experience.

---

## ✨ Features

- **🚀 Ultra-Fast Interaction**: Built on Next.js 15+ for blazing fast performance.
- **🛡️ Secure by Design**: Integrated with GitGuardian and TruffleHog for maximum security.
- **🧪 Robust Testing**: Comprehensive suite using Vitest, Playwright, and MSW.
- **🎨 Premium UI**: Modern aesthetics with dark mode support and micro-animations.
- **🤖 Powered by Google Gemini**: Advanced AI integration for intelligent counseling support.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) |
| **Logic** | [React](https://reactjs.org/), [Zod](https://zod.dev/) |
| **Styling** | Vanilla CSS (Premium Custom Design) |
| **AI** | [Google Generative AI](https://ai.google.dev/) |
| **Quality** | [Biome](https://biomejs.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Testing** | Vitest, Playwright, MSW |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/scuba3198/nep-counselor-tool.git
   cd nep-counselor-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```

---

## 🛡️ Verification & Standards

We maintain the highest engineering standards. Before pushing any code, ensure you run:

```powershell
.\verify.ps1
```

This script executes:
- **Biome**: Linting and formatting.
- **TypeScript**: Strict type checking.
- **Vitest**: Unit and Integration tests with coverage.
- **Knip**: Dead code analysis.
- **Dependency Cruiser**: Architectural boundary enforcement.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

**Mumukshu D.C** - [GitHub](https://github.com/scuba3198)

---

<p align="center">Made with ❤️ for Nepal</p>

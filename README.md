# GoLearn - Modern Learning Management System

GoLearn is a high-performance, modern Learning Management System (LMS) built with Next.js 14. It provides a seamless experience for both instructors to create courses and students to learn anything, anywhere.

![GoLearn Preview](https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200)

## 🚀 Features

- **🎓 Student Dashboard**: Track progress and access enrolled courses easily.
- **👨‍🏫 Instructor Suite**: Create and manage courses, lessons, and quizzes.
- **🛡️ Secure Authentication**: Built with Next-Auth for robust user security.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **⚡ Real-time Updates**: Instant feedback and seamless navigation using Next.js 14 App Router.
- **📊 Database Management**: Powered by Drizzle ORM and SQLite for efficient data handling.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Database**: [SQLite](https://sqlite.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Next-Auth (v5)](https://authjs.dev/)
- **Animations**: [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/golearn-lms.git
   cd golearn-lms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   AUTH_SECRET=your_nextauth_secret
   # Add other necessary variables
   ```

4. **Initialize the Database**:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed # Optional: populate with sample data
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

1. **Fork** the project.
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`).
4. **Push to the Branch** (`git push origin feature/AmazingFeature`).
5. **Open a Pull Request**.

Please ensure your code follows the existing style and includes proper TypeScript types.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by the GoLearn Team.

# Social Frontend

Dự án frontend cho ứng dụng social network được xây dựng với React, TypeScript và Vite.

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 20.0.0
- npm >= 9.0.0

### Cài đặt dependencies

```bash
npm install
```

## 🛠️ Scripts

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Format code với Prettier
npm run format

# Kiểm tra format
npm run format:check
```

## 📁 Cấu trúc dự án

```
frontend/
├── public/               # Static files
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── css/              # Global styles
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── config/           # Configuration files
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── .vscode/              # VS Code settings
├── .prettierrc           # Prettier configuration
├── .prettierignore       # Prettier ignore rules
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # App TypeScript config
├── tsconfig.node.json    # Node TypeScript config
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies & scripts
```

## 🔧 Cấu hình

### Code Formatting

Dự án sử dụng Prettier với cấu hình:

- Single quotes
- 2 spaces indentation
- 200 characters line width
- Trailing commas
- Semicolons

### Linting

ESLint được cấu hình với:

- TypeScript support
- React hooks rules
- React refresh rules

## 🚀 Development

### Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:8000`

### Hot Module Replacement (HMR)

Dự án hỗ trợ HMR với SWC để reload nhanh khi development.

## 📦 Build

### Build production

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

## 🔍 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
# Format tất cả files
npm run format

# Kiểm tra format
npm run format:check
```

## 🛠️ IDE Setup

## 📝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License.

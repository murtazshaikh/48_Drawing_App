# 🖌️ Drawing App

An interactive drawing application built with **React**, **TypeScript**, and **Konva**. Easily draw rectangles, circles, and lines, select and style them, and save your work!

---

## 🚀 Features

- Draw **Rectangles**, **Circles**, and **Lines**
- Select and modify shape styles:
  - Fill color
  - Stroke color
  - Stroke width
- **Erase** individual elements
- **Clear All** drawings
- **Save** the canvas state (JSON format)
- **Responsive UI** for desktop and mobile

---

## 🛠️ Technologies Used

- React (with Hooks)
- TypeScript
- Konva + React-Konva
- CSS modules

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/48_Drawing_App.git
   cd 48_Drawing_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

---

## 🧾 Folder Structure

```
src/
│
├── components/
│   ├── Toolbar.tsx         # Tool buttons and icons
│   └── StylePanel.tsx      # Styling options for selected shape
│
├── types.ts                # Shape and tool type definitions
├── App.tsx                 # Main drawing logic
├── App.css                 # Styling
```

---

## 📂 Saving Output

The app saves drawing data as a JSON array of shapes. This can be extended later for:
- SVG/PNG export
- Persistent backend storage
- Importing previously saved files

---

## 📱 Responsive

The layout is responsive and works on mobile browsers too. 🧑‍🎨📱

---

## 👤 Author

Made with ❤️

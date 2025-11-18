# Modern Login Page

A beautiful, responsive login page with username and password fields, featuring password visibility toggle and automatic light/dark mode support.

## 🎨 Features

### Core Functionality
- ✅ **Username & Password Fields** - Clean, modern input fields with icons
- ✅ **Password Visibility Toggle** - Eye icon button to show/hide password
- ✅ **Remember Me Checkbox** - Custom-styled checkbox
- ✅ **Forgot Password Link** - Easy password recovery access
- ✅ **Social Login Options** - Google, GitHub, and Apple sign-in buttons

### Design & UX
- 🎨 **Modern UI Design** - Clean, professional interface with smooth animations
- 🌓 **Automatic Light/Dark Mode** - Adapts to system preferences
- 📱 **Fully Responsive** - Works perfectly on all screen sizes:
  - Desktop (1920px+)
  - Laptop (1024px - 1920px)
  - Tablet (768px - 1024px)
  - Mobile (320px - 768px)
- ♿ **Accessibility Features** - WCAG compliant with keyboard navigation
- 🎭 **Smooth Animations** - Fade-in effects and hover transitions
- 🎯 **Focus States** - Clear visual feedback for keyboard users

### Technical Features
- ⚡ **Pure HTML/CSS/JavaScript** - No frameworks required
- 🔒 **Form Validation** - Client-side validation with visual feedback
- 📢 **Notification System** - Toast notifications for user feedback
- 🎨 **CSS Variables** - Easy theme customization
- 📦 **Zero Dependencies** - Lightweight and fast

## 📁 Files

- `login.html` - Main HTML structure
- `styles.css` - Complete styling with light/dark mode support
- `script.js` - Interactive functionality and form handling

## 🚀 Usage

### Local Development
Simply open `login.html` in any modern web browser, or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000/login.html`

### Integration
To integrate into your project:

1. Copy the three files to your project directory
2. Update the form action in `login.html` to point to your backend API
3. Modify the form submission handler in `script.js` to match your authentication flow

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #3b82f6;  /* Primary brand color */
    --accent-hover: #2563eb;    /* Hover state color */
    /* ... more variables */
}
```

### Responsive Breakpoints
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 769px and above

### Dark Mode
Dark mode automatically activates based on system preferences. The page uses `prefers-color-scheme` media query to detect and apply the appropriate theme.

## 🔧 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The page adapts seamlessly to different screen sizes:

- **Desktop**: Full-featured layout with spacious design
- **Tablet**: Optimized spacing and touch-friendly buttons
- **Mobile**: Compact layout with easy thumb-reach controls
- **Small Mobile**: Further optimized for devices 360px and below

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators for all interactive elements
- High contrast mode support
- Reduced motion support for users with vestibular disorders

## 🎯 Form Validation

The page includes:
- Required field validation
- Visual error states
- Real-time feedback
- Accessible error messages

## 📝 License

Free to use for personal and commercial projects.

## 🤝 Contributing

Feel free to customize and enhance this login page for your specific needs!

---

**Created with ❤️ using modern web standards**

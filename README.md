# PPSP Website - GitHub Pages Deployment

This is the static website for Professional Property Solutions Provider (PPSP), optimized for GitHub Pages deployment.

## Files Structure

```
docs/
├── index.html          # Main website file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── logo.png           # PPSP company logo
└── README.md          # This file
```

## Deployment Instructions

### Method 1: Direct GitHub Pages Setup

1. **Create a new GitHub repository** for your website
2. **Upload all files** from the `docs/` folder to the repository root
3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
4. **Access your website** at: `https://yourusername.github.io/repository-name`

### Method 2: Using docs/ Folder

1. **Create a new GitHub repository**
2. **Upload the entire project** including the `docs/` folder
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder
   - Click "Save"
4. **Access your website** at: `https://yourusername.github.io/repository-name`

## Features

- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional design with PPSP branding
- **Interactive Elements**: Smooth scrolling, mobile menu, contact form
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance Optimized**: Lazy loading, efficient CSS/JS

## Customization

### Colors
The website uses PPSP's brand colors:
- Primary Red: #dc2626
- Dark Red: #b91c1c
- Gray: #374151
- Light Gray: #f9fafb

### Content Updates
To update content, edit the `index.html` file:
- Company information in the About section
- Services in the Services section
- Contact details in the Contact section
- Mission and values content

### Styling
Custom styles are in `styles.css`. The website also uses Tailwind CSS via CDN for utility classes.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+

## Contact

For questions about the website, contact PPSP:
- Website: www.ppsp.co.za
- Email: info@ppsp.co.za
- Phone: (+27) 66 429 9398
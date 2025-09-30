#!/usr/bin/env node

/**
 * Migration Script: React Web to React Native
 * Helps automate the conversion of components
 */

const fs = require('fs');
const path = require('path');

// Mapping of web elements to React Native components
const elementMappings = {
  'div': 'View',
  'span': 'Text',
  'p': 'Text',
  'h1': 'Text',
  'h2': 'Text',
  'h3': 'Text',
  'h4': 'Text',
  'h5': 'Text',
  'h6': 'Text',
  'button': 'TouchableOpacity',
  'input': 'TextInput',
  'img': 'Image',
  'a': 'TouchableOpacity',
  'ul': 'View',
  'li': 'View',
  'section': 'View',
  'article': 'View',
  'header': 'View',
  'footer': 'View',
  'nav': 'View',
  'main': 'View',
  'aside': 'View',
  'form': 'View',
};

// Mapping of CSS properties to React Native styles
const styleMappings = {
  // Flexbox
  'display: flex': 'flex: 1',
  'flex-direction': 'flexDirection',
  'justify-content': 'justifyContent',
  'align-items': 'alignItems',
  'align-self': 'alignSelf',
  'flex-wrap': 'flexWrap',
  
  // Spacing
  'margin': 'margin',
  'margin-top': 'marginTop',
  'margin-bottom': 'marginBottom',
  'margin-left': 'marginLeft',
  'margin-right': 'marginRight',
  'padding': 'padding',
  'padding-top': 'paddingTop',
  'padding-bottom': 'paddingBottom',
  'padding-left': 'paddingLeft',
  'padding-right': 'paddingRight',
  
  // Sizing
  'width': 'width',
  'height': 'height',
  'min-width': 'minWidth',
  'min-height': 'minHeight',
  'max-width': 'maxWidth',
  'max-height': 'maxHeight',
  
  // Typography
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-family': 'fontFamily',
  'text-align': 'textAlign',
  'line-height': 'lineHeight',
  'letter-spacing': 'letterSpacing',
  'color': 'color',
  
  // Background
  'background-color': 'backgroundColor',
  'background': 'backgroundColor',
  
  // Border
  'border': 'borderWidth',
  'border-width': 'borderWidth',
  'border-color': 'borderColor',
  'border-radius': 'borderRadius',
  'border-style': 'borderStyle',
  
  // Position
  'position': 'position',
  'top': 'top',
  'bottom': 'bottom',
  'left': 'left',
  'right': 'right',
  'z-index': 'zIndex',
  
  // Other
  'opacity': 'opacity',
  'overflow': 'overflow',
};

/**
 * Convert a React component file to React Native
 */
function convertComponent(inputPath, outputPath) {
  console.log(`Converting ${inputPath}...`);
  
  let content = fs.readFileSync(inputPath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import\s+.*?from\s+['"]react['"]/g,
    "import React from 'react'"
  );
  
  // Add React Native imports
  const rnImports = `import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';`;
  
  content = content.replace(
    /import\s+React/,
    `import React from 'react';\n${rnImports}`
  );
  
  // Replace HTML elements with React Native components
  Object.entries(elementMappings).forEach(([html, rn]) => {
    // Opening tags
    content = content.replace(
      new RegExp(`<${html}(\\s|>)`, 'g'),
      `<${rn}$1`
    );
    // Closing tags
    content = content.replace(
      new RegExp(`</${html}>`, 'g'),
      `</${rn}>`
    );
  });
  
  // Replace className with style
  content = content.replace(/className=/g, 'style=');
  
  // Convert Tailwind classes to style objects (basic conversion)
  content = content.replace(
    /style="([^"]+)"/g,
    (match, classes) => {
      const styleObj = convertTailwindToStyle(classes);
      return `style={${JSON.stringify(styleObj)}}`;
    }
  );
  
  // Replace onClick with onPress for TouchableOpacity
  content = content.replace(/onClick=/g, 'onPress=');
  
  // Replace onChange with onChangeText for TextInput
  content = content.replace(
    /<TextInput([^>]*?)onChange=\{([^}]+)\}/g,
    '<TextInput$1onChangeText={$2'
  );
  
  // Add .native to the filename if not already present
  if (!outputPath.includes('.native')) {
    outputPath = outputPath.replace('.tsx', '.native.tsx');
  }
  
  // Write the converted file
  fs.writeFileSync(outputPath, content);
  console.log(`✅ Converted to ${outputPath}`);
}

/**
 * Basic Tailwind to React Native style conversion
 */
function convertTailwindToStyle(classes) {
  const classList = classes.split(' ');
  const styles = {};
  
  classList.forEach(cls => {
    // Padding classes
    if (cls.startsWith('p-')) {
      const value = parseInt(cls.replace('p-', '')) * 4;
      styles.padding = value;
    }
    if (cls.startsWith('px-')) {
      const value = parseInt(cls.replace('px-', '')) * 4;
      styles.paddingHorizontal = value;
    }
    if (cls.startsWith('py-')) {
      const value = parseInt(cls.replace('py-', '')) * 4;
      styles.paddingVertical = value;
    }
    
    // Margin classes
    if (cls.startsWith('m-')) {
      const value = parseInt(cls.replace('m-', '')) * 4;
      styles.margin = value;
    }
    if (cls.startsWith('mx-')) {
      const value = parseInt(cls.replace('mx-', '')) * 4;
      styles.marginHorizontal = value;
    }
    if (cls.startsWith('my-')) {
      const value = parseInt(cls.replace('my-', '')) * 4;
      styles.marginVertical = value;
    }
    
    // Flexbox classes
    if (cls === 'flex') styles.display = 'flex';
    if (cls === 'flex-row') styles.flexDirection = 'row';
    if (cls === 'flex-col') styles.flexDirection = 'column';
    if (cls === 'items-center') styles.alignItems = 'center';
    if (cls === 'justify-center') styles.justifyContent = 'center';
    if (cls === 'justify-between') styles.justifyContent = 'space-between';
    
    // Text classes
    if (cls === 'text-center') styles.textAlign = 'center';
    if (cls === 'font-bold') styles.fontWeight = 'bold';
    if (cls.startsWith('text-')) {
      const size = cls.replace('text-', '');
      const sizeMap = {
        'xs': 12,
        'sm': 14,
        'base': 16,
        'lg': 18,
        'xl': 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
      };
      if (sizeMap[size]) {
        styles.fontSize = sizeMap[size];
      }
    }
    
    // Background classes
    if (cls.startsWith('bg-')) {
      const color = cls.replace('bg-', '');
      if (color === 'white') styles.backgroundColor = '#FFFFFF';
      if (color === 'black') styles.backgroundColor = '#000000';
      if (color === 'gray-100') styles.backgroundColor = '#F3F4F6';
      if (color === 'gray-200') styles.backgroundColor = '#E5E7EB';
      if (color === 'blue-500') styles.backgroundColor = '#3B82F6';
    }
    
    // Border classes
    if (cls === 'border') styles.borderWidth = 1;
    if (cls.startsWith('rounded-')) {
      const radius = cls.replace('rounded-', '');
      if (radius === 'lg') styles.borderRadius = 8;
      if (radius === 'xl') styles.borderRadius = 12;
      if (radius === 'full') styles.borderRadius = 9999;
    }
  });
  
  return styles;
}

/**
 * Process a directory of components
 */
function processDirectory(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  
  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    if (fs.statSync(inputPath).isDirectory()) {
      processDirectory(inputPath, outputPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      convertComponent(inputPath, outputPath);
    }
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node migrate-to-native.js <input-dir> <output-dir>');
  console.log('Example: node migrate-to-native.js ./src/components ./src/components/native');
  process.exit(1);
}

const [inputDir, outputDir] = args;

if (!fs.existsSync(inputDir)) {
  console.error(`Input directory ${inputDir} does not exist`);
  process.exit(1);
}

console.log('🚀 Starting React Native migration...');
console.log(`Input: ${inputDir}`);
console.log(`Output: ${outputDir}`);
console.log('');

processDirectory(inputDir, outputDir);

console.log('');
console.log('✨ Migration complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review the generated files and fix any conversion issues');
console.log('2. Update imports in the converted files');
console.log('3. Create StyleSheet objects for complex styles');
console.log('4. Test components on iOS and Android simulators');
console.log('5. Optimize performance and platform-specific code');

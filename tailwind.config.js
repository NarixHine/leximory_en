import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: '#FAFDF6',
          primary: {
            DEFAULT: '#7D9161',
            100: '#F8FAF0',
            200: '#F1F6E1',
            300: '#DCE5C8',
            400: '#C0CBAB',
            500: '#9CA986',
            600: '#7D9161',
            700: '#617943',
            800: '#47622A',
            900: '#345119'
          },
          secondary: {
            DEFAULT: '#9ABB8B',
            100: '#FAFDF6',
            200: '#F5FBEE',
            300: '#EAF3E1',
            400: '#DCE8D3',
            500: '#C9DABF',
            600: '#9ABB8B',
            700: '#6F9C60',
            800: '#497E3C',
            900: '#2D6824'
          },
          danger: {
            DEFAULT: '#5F6F65',
            100: '#F0F7F0',
            200: '#E2F0E3',
            300: '#C1D3C4',
            400: '#96A89B',
            500: '#5F6F65',
            600: '#455F51',
            700: '#2F4F42',
            800: '#1E4035',
            900: '#12352D'
          },
          warning: {
            DEFAULT: '#808D7C',
            100: '#F6F9F3',
            200: '#EDF3E7',
            300: '#BDC9C3',
            400: '#AEBAA9',
            500: '#808D7C',
            600: '#5F795A',
            700: '#42653E',
            800: '#285127',
            900: '#17431A'
          }
        }
      },
      dark: {
        colors: {
          background: '#383E38',
          primary: {
            DEFAULT: '#7D9161',
            900: '#F8FAF0',
            800: '#F1F6E1',
            700: '#DCE5C8',
            600: '#C0CBAB',
            500: '#9CA986',
            400: '#7D9161',
            300: '#617943',
            200: '#47622A',
            100: '#345119'
          },
          secondary: {
            DEFAULT: '#C9DABF',
            900: '#FAFDF6',
            800: '#F5FBEE',
            700: '#EAF3E1',
            600: '#DCE8D3',
            500: '#C9DABF',
            400: '#9ABB8B',
            300: '#6F9C60',
            200: '#497E3C',
            100: '#2D6824'
          },
          danger: {
            DEFAULT: '#96A89B',
            900: '#F0F7F0',
            800: '#E2F0E3',
            700: '#C1D3C4',
            600: '#96A89B',
            500: '#5F6F65',
            400: '#455F51',
            300: '#2F4F42',
            200: '#1E4035',
            100: '#12352D'
          },
          warning: {
            DEFAULT: '#AEBAA9',
            900: '#F6F9F3',
            800: '#EDF3E7',
            700: '#BDC9C3',
            600: '#AEBAA9',
            500: '#808D7C',
            400: '#5F795A',
            300: '#42653E',
            200: '#285127',
            100: '#17431A'
          }
        }
      },
    }
  }), require('tailwindcss-animate')],
}

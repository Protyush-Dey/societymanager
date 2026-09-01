import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#0058cc',
              borderRadius: 6,
              controlHeight: 40,
              fontFamily: 'Inter, sans-serif',
              colorText: '#1e293b',
              colorBorder: '#cbd5e1',
            },
            components: {
              Button: {
                colorPrimary: '#0058cc',
                colorPrimaryHover: '#004bb0',
                colorPrimaryActive: '#003e91',
                controlHeight: 40,
                borderRadius: 6,
                fontWeight: 500,
              },
              Input: {
                activeBorderColor: '#0058cc',
                hoverBorderColor: '#0058cc',
                activeShadow: '0 0 0 2px rgba(0, 88, 204, 0.15)',
              },
              Checkbox: {
                colorPrimary: '#0058cc',
              },
            },
          }}
        >
    <App /></ConfigProvider>
  </StrictMode>,
)

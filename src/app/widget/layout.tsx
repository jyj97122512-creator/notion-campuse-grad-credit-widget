export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: #eef3db !important;
          margin: 0;
          padding: 0;
          min-height: 400px;
          overflow-y: visible;
          -webkit-text-size-adjust: none;
        }
      `}</style>
      {children}
    </>
  )
}

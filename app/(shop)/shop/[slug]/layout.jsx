// Font Awesome + the Bengali/Latin font pairing from the provided design,
// scoped to this route only so the rest of the site is untouched.
export default function ProductDetailsLayout({ children }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          fontFamily: "'Noto Sans Bengali', 'Plus Jakarta Sans', sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
}

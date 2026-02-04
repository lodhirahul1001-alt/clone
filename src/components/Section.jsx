const Section = ({ id, title, subtitle, children }) => {
  return (
    <section
      id={id}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
    >
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[color:var(--muted)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
};

export default Section;

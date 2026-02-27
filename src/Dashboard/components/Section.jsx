const Section = ({ id, title, subtitle, children }) => {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="mt-2 text-[color:var(--muted)]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
};

export default Section;

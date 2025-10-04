const Footer = () => {
  return (
    <footer className="glass border-t border-success/30 mt-20">
      <div className="container mx-auto px-4 py-16 text-center">
        <blockquote className="text-xl md:text-2xl italic max-w-4xl mx-auto mb-8 text-muted-foreground border-l-4 border-primary pl-8 leading-relaxed">
          "Das Internet der Zukunft ist keine Utopie - es entsteht jetzt durch die Arbeit tausender 
          Entwickler, Forscher und Visionäre weltweit. Diese Seite zeigt den aktuellen Stand einer 
          technologischen Revolution."
        </blockquote>
        <p className="text-muted-foreground">
          Alle Inhalte sind technisch umsetzbar und basieren auf aktuellen Forschungsergebnissen
        </p>
      </div>
    </footer>
  );
};

export default Footer;

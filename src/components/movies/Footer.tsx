export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-8">
      <div className="px-4 sm:px-8 lg:px-12 text-center">
        <h3 className="text-xl font-bold text-red-600 mb-3">BlitarFlix</h3>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-3">
          This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
        </p>
        <a href="mailto:contact@blitarflix.com" className="text-gray-600 text-sm hover:text-red-600 transition-colors">
          contact@blitarflix.com
        </a>
      </div>
    </footer>
  );
}

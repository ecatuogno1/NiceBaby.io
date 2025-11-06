export function Footer() {
  return (
    <footer className="border-t border-blush-100 bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} NiceBaby.io. Built for private family journaling.</p>
        <div className="flex gap-4">
          <a href="#stack" className="hover:text-blush-600">
            Architecture
          </a>
          <a href="#modules" className="hover:text-blush-600">
            Modules
          </a>
          <a href="#playbook" className="hover:text-blush-600">
            Playbook
          </a>
        </div>
      </div>
    </footer>
  );
}

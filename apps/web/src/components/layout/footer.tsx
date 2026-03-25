export function Footer() {
  return (
    <footer className="border-t border-border py-4 px-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>&copy; 2026 Chat Node</span>
        <div className="flex gap-3">
          <a href="#" className="hover:text-foreground transition-colors">
            이용약관
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}

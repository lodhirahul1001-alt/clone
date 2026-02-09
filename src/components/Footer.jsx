import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Linkedin, YoutubeIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="container-page pb-10">
        <div className="glass-soft px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 grid place-items-center">
                   <div className="h-9 w-9 rounded-full grid place-items-center border border-white/10 bg-white/5">
              <img
                src="/newlogo.png"
                alt="Silent Music Group logo"
                className="h-7 w-7 object-contain"
              />
            </div>
                </div>
                <div className="font-semibold">Silent Music Group</div>
              </div>
              <p className="text-sm text-[color:var(--muted)]">
                Distribute, manage and track your releases with a modern dashboard experience.
              </p>
              <div className="flex gap-3 mt-5">
                <a
                  className="h-10 w-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center transition-colors"
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  className="h-10 w-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center transition-colors"
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  className="h-10 w-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center transition-colors"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  className="h-10 w-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center transition-colors"
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  className="h-10 w-10 rounded-full border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid place-items-center transition-colors"
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                <li><Link to="/about" className="hover:text-[color:var(--text)]">About</Link></li>
                <li><Link to="/projects" className="hover:text-[color:var(--text)]">Projects</Link></li>
                <li><Link to="/support" className="hover:text-[color:var(--text)]">Support</Link></li>
                <li><Link to="/contact" className="hover:text-[color:var(--text)]">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                <li><Link to="/services" className="hover:text-[color:var(--text)]">Services</Link></li>
                <li><Link to="/pricing" className="hover:text-[color:var(--text)]">Pricing</Link></li>
                <li><Link to="/signup" className="hover:text-[color:var(--text)]">Create account</Link></li>
                <li><Link to="/login" className="hover:text-[color:var(--text)]">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Get in touch</h3>
              <p className="text-sm text-[color:var(--muted)]">
                Have questions? We’re here to help.
              </p>
              <div className="mt-4 flex gap-3">
                <Link className="btn-primary" to="/contact">Contact us</Link>
                <Link className="btn-ghost" to="/support">Help</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-black/10 dark:border-white/10 text-sm text-[color:var(--muted)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} Silent Music Group All rights reserved.</span>
            <span className="text-xs">Contect For Website Create - Lodhirahul7002@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

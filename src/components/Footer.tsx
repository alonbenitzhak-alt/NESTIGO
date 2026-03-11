import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IV</span>
              </div>
              <span className="text-xl font-bold text-white">ISRAVEST</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              ISRAVEST connects Israeli investors with premium international real estate
              opportunities. Explore curated properties in top global markets with
              transparent pricing and expert guidance.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/countries" className="hover:text-white transition-colors">Countries</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">ROI Calculator</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare Properties</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Investment Countries</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/countries/greece" className="hover:text-white transition-colors">Greece</Link></li>
              <li><Link href="/countries/cyprus" className="hover:text-white transition-colors">Cyprus</Link></li>
              <li><Link href="/countries/georgia" className="hover:text-white transition-colors">Georgia</Link></li>
              <li><Link href="/countries/portugal" className="hover:text-white transition-colors">Portugal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@isravest.com" className="hover:text-white transition-colors">
                  info@isravest.com
                </a>
              </li>
              <li className="text-gray-400">Tel Aviv, Israel</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Legal Disclaimer:</strong> ISRAVEST is an information platform and does not provide financial,
            legal, or tax advice. All investment decisions should be made after consulting with qualified
            professionals. Property values, rental yields, and ROI estimates are projections based on market
            data and are not guaranteed. Past performance does not indicate future results. ISRAVEST does not
            act as a broker or agent in any jurisdiction. All transactions are subject to local laws and regulations.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} ISRAVEST. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

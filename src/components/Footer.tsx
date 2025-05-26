import {faReddit} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 flex h-20 w-full flex-col items-center justify-between gap-4 border-t border-slate-700 bg-gray-900 px-4 py-6 text-xs text-slate-300 md:flex-row">
      <div className="flex-1 text-center md:text-left">
        FINAL FANTASY XI ©2002 - 2025 SQUARE ENIX CO., LTD. FINAL FANTASY is a registered trademark
        of Square Enix Holdings Co., Ltd. All material used under license.
      </div>

      <div className="flex flex-shrink-0 items-center gap-4">
        <a
          href="https://ko-fi.com/noranda"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-pink-500/90 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <FontAwesomeIcon icon={faCoffee} size="lg" />
          Buy me a coffee
        </a>
        <a
          href="mailto:mandragora-mania@norandabrown.com"
          className="inline-flex items-center justify-center rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          title="Email"
        >
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
        <a
          href="https://www.reddit.com/user/noranda"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          title="Reddit"
        >
          <FontAwesomeIcon icon={faReddit} size="lg" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

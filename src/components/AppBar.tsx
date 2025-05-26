import {useState} from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {cn} from '@/lib/utils';
import AnalyzerRulesModal from './AnalyzerRulesModal';
import GameRulesModal from './GameRulesModal';

const AppBar: React.FC = () => {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [analyzerRulesOpen, setAnalyzerRulesOpen] = useState(false);

  return (
    <div className="relative flex w-full items-center justify-center gap-3 p-2">
      <img
        src="/images/adenium-pink.png"
        alt="Adenium Pink"
        className="ml-4 h-16 w-16 rounded-full object-cover object-top drop-shadow"
      />

      <h1
        className="-mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text pr-20 font-bold leading-8 text-transparent min-[500px]:leading-tight"
        style={{
          fontSize: 'clamp(1.25rem, 4vw + 1rem, 3.75rem)', // xl (1.25rem) to 6xl (3.75rem)
        }}
      >
        Mandragora Mania
      </h1>

      {/* Navigation Menu */}
      <div className={cn('absolute right-5', 'md:right-8')}>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="hidden bg-slate-700 hover:border-pink-400 md:block">
                <span className="mr-1">Rules</span>
              </NavigationMenuTrigger>

              <NavigationMenuTrigger className="bg-slate-700 hover:border-pink-400 md:block md:hidden" />

              <NavigationMenuContent>
                <div className="flex w-60 flex-col bg-slate-700">
                  <NavigationMenuLink
                    asChild
                    className="w-full cursor-pointer px-4 py-3 text-left hover:bg-slate-800 focus:bg-slate-800"
                    onClick={() => setRulesOpen(true)}
                  >
                    <span>Game Rules</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    asChild
                    className="w-full cursor-pointer border-t border-slate-700 px-4 py-3 text-left hover:bg-slate-800 focus:bg-slate-800"
                    onClick={() => setAnalyzerRulesOpen(true)}
                  >
                    <span>Analyzer Scoring Rules</span>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <GameRulesModal open={rulesOpen} onOpenChange={setRulesOpen} />

      <AnalyzerRulesModal open={analyzerRulesOpen} onOpenChange={setAnalyzerRulesOpen} />
    </div>
  );
};

export default AppBar;

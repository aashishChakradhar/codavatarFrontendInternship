import { Suspense, useState } from "react";
import PokemonList from "@/components/pokemon/pokemonListComponent";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

import { SpinnerCustom } from "@/components/spinner/spinner";
import { PokemonResult } from "@/components/pokemon/pokemonComponent";
import { SkeletonCard } from "@/components/skeleton/skeleton";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
export default function PokemonPage() {
  const [selected, setSelected] = useState<string>("pikachu");

  return (
    <ThemeProvider>
      <ModeToggle />
      <div className=" min-h-100vh flex lg:flex-col items-center justify-center w-full">
        <Suspense fallback={<SpinnerCustom />}>
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-50  max-w-md rounded-lg border md:min-w-full"
          >
            <ResizablePanel minSize="15%" maxSize="50%" defaultSize="25%">
              <div className=" flex h-full  items-center justify-center p-6">
                <Suspense fallback={<SkeletonCard />}>
                  <PokemonResult name={selected} />
                </Suspense>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="75%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                  <PokemonList selected={selected} onSelect={setSelected} />
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

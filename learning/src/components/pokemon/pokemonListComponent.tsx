import usePokemonList from "../../api/pokemon/pokemonlistAPI";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  selected?: string;
  onSelect?: (name: string) => void;
};

export default function PokemonList({ selected, onSelect }: Props) {
  const { pokemons, errorMessage, loading } = usePokemonList();
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div>
      <h2>10 Pokémon</h2>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : (
        <Table>
          <TableCaption>A list of pokemons.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25 text-center">Name</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pokemons.map((p) => (
              <TableRow
                key={p.id}
                className={`cursor-pointer ${selected === p.name ? "bg-muted" : ""}`}
                onClick={() => onSelect?.(p.name)}
              >
                <TableCell className="font-medium flex items-center justify-center px-15 gap-5">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-12 w-12" />
                  ) : (
                    "Unknown"
                  )}
                  {p.name}
                </TableCell>
                <TableCell>
                  {p.types.length > 0 ? p.types.join(", ") : "Unknown"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

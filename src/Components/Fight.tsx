import { useRef, useState } from "react";
import { gifUrl } from "../data/backgrounds";
import { getRandNumber, usePokemon } from "../data/utils";
import PokemonMain from "./PokemonMain";
import Battle from "./Battle";

export default function Fight({
  activeLocationNumber,
  activeLocationName,
  pocket,
  selectedPokemonId,
  onClose,
}: {
  activeLocationNumber: number;
  activeLocationName: string;
  pocket: number[];
  selectedPokemonId: number;
  onClose: (newPocket: number[]) => void;
}) {
  const [enemyActualHP, setEnemyActualHP] = useState(-10);
  const [playerActualHP, setPlayerActualHP] = useState(-10);
  const [demageToPlayer, setDemageToPlayer] = useState(0);
  const [demageToEnemy, setDemageToEnemy] = useState(0);

  const randomNumber = useRef(getRandNumber(1, 1025));
  const enemyData = usePokemon(randomNumber.current);
  const playerData = usePokemon(selectedPokemonId);

  return (
    <div className="full-width-1024px text-black">
      {/* Actual city name, bg image */}
      <h1>{activeLocationName}</h1>
      <img
        src={gifUrl[activeLocationNumber - 1]}
        alt="background"
        className="w-full h-full object-cover"
      />

      <div className="overlay-components">
        <div className="w-3/5 grid grid-cols-1 gap-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Player data load */}
            {playerData.error && (
              <h1 className="warning-message">Something went wrong...</h1>
            )}
            {playerData.isLoading && <h1 className="load-info">Loading...</h1>}
            {playerData.isSuccess && (
              <PokemonMain
                pokemonById={playerData.data}
                newHP={playerActualHP}
              />
            )}
            {/* Enemy data load */}
            {enemyData.error && (
              <h1 className="warning-message">Something went wrong...</h1>
            )}

            {enemyData.isLoading && <h1 className="load-info">Loading...</h1>}
            {enemyData.isSuccess && (
              <PokemonMain pokemonById={enemyData.data} newHP={enemyActualHP} />
            )}
          </div>

          {/* Battle component */}
          <div className="grid grid-cols-1">
            {enemyData.isSuccess && playerData.isSuccess && (
              <Battle
                actualPocket={pocket}
                player={{
                  id: selectedPokemonId,
                  hp: playerData.data.stats[0].base_stat,
                  attack: playerData.data.stats[1].base_stat,
                  defense: playerData.data.stats[2].base_stat,
                }}
                enemy={{
                  id: enemyData.data.id,
                  hp: enemyData.data.stats[0].base_stat,
                  attack: enemyData.data.stats[1].base_stat,
                  defense: enemyData.data.stats[2].base_stat,
                }}
                onClose={(newPocket) => {
                  onClose(newPocket);
                }}
                onHPChange={(
                  newEnemyHP,
                  newPlayerHP,
                  damageToEnemy,
                  damageToPlayer
                ) => {
                  setEnemyActualHP(newEnemyHP);
                  setPlayerActualHP(newPlayerHP);
                  setDemageToEnemy(damageToEnemy);
                  setDemageToPlayer(damageToPlayer);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

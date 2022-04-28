import React, { useRef, useState, Suspense, useEffect } from "react";
React.useLayoutEffect = React.useEffect;
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import Anna from "./models/Anna";
import Timmy from "./models/Timmy";
import Can from "./models/Can";
import Telephone from "./models/Telephone";

const Background = () => {
  const texture = useLoader(
    THREE.TextureLoader,
    "./Combat/combatBackground.jpg"
  );
  return (
    <mesh position={[0, 0, -1]}>
      <planeBufferGeometry attach="geometry" args={[15, 15]} />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
};

const Stage = () => {
  const texture = useLoader(THREE.TextureLoader, "./Combat/dirtTexture.jpg");
  return (
    <group>
      <Telephone position={[4, -5, -0.9]} rotation={[0, 1.5, 0]} />
      <Can position={[-4, -1.5, -0.9]} rotation={[Math.PI / 2, 0, -1.5]} />
      <Can position={[-4, -2.8, -0.4]} rotation={[Math.PI / 2, 1.5, -1.5]} />
      <Box args={[10, 1, 2]} position={[0, -4, 0]}>
        <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
      </Box>
    </group>
  );
};

const HealthBars = ({ position, name, health }) => {
  return (
    <group>
      <Box args={[2, 0.5, 0.3]} position={position[0]}>
        <meshBasicMaterial color="red" />
      </Box>
      <Box args={[2.1, 0.6, 0.3]} position={position[1]}>
        <meshBasicMaterial color="black" />
      </Box>
      <Text
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        rotation={[0, 0, 0]}
        position={position[2]}
      >
        {name}
      </Text>
      <Text
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.4}
        rotation={[0, 0, 0]}
        position={position[3]}
      >
        {health.toString()}
        {"/10"}
      </Text>
    </group>
  );
};

const ActionButton = ({ position, rotation, color, action, actionText }) => {
  return (
    <group>
      <Box
        args={[2, 0.7, 0.3]}
        position={position[0]}
        rotation={rotation[0]}
        onClick={() => {
          action();
        }}
      >
        <meshBasicMaterial color={color} />
      </Box>
      <Box
        args={[2.15, 0.85, 0.3]}
        position={position[1]}
        rotation={rotation[0]}
      >
        <meshBasicMaterial color="black" />
      </Box>
      <Text
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        rotation={rotation[0]}
        position={position[2]}
      >
        {actionText}
      </Text>
    </group>
  );
};

const PreventActionButton = ({ rotation, color, actionText }) => {
  return (
    <group>
      <Box args={[4, 0.7, 0.3]} position={[0, -4, 2]} rotation={rotation[0]}>
        <meshBasicMaterial color={color} />
      </Box>
      <Box
        args={[4.15, 0.85, 0.3]}
        position={[0, -4, 1.9]}
        rotation={rotation[0]}
      >
        <meshBasicMaterial color="black" />
      </Box>
      <Text
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        rotation={rotation[0]}
        position={[0, -3.7, 2.5]}
      >
        {actionText}
      </Text>
    </group>
  );
};

const EndScreen = ({ text, action }) => {
  return (
    <group>
      <Box
        args={[10, 4, 6]}
        position={[0, 0, 0]}
        onClick={() => {
          action();
        }}
      >
        <meshBasicMaterial color="white" />
      </Box>
      <Box args={[10.15, 4.5, 5.9]} position={[0, 0, -0.1]}>
        <meshBasicMaterial color="black" />
      </Box>
      <Text
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        position={[0, 0, 3.5]}
      >
        {text}
      </Text>
      <Text
        color="black"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
        position={[0, -0.4, 3.5]}
      >
        {"Click me to return back to World Map"}
      </Text>
    </group>
  );
};

const Combat = () => {
  const [action, setAction] = useState("NeutralIdle");
  const [enemyAction, setEnemyAction] = useState("NeutralIdle");
  const [health, setHealth] = useState(10);
  const [enemyHealth, setEnemyHealth] = useState(10);
  const [turn, setTurn] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [endScreenText, setEndScreenText] = useState("");

  const firstUpdate = useRef([true]);

  useEffect(() => {
    if (firstUpdate.current[0]) {
      firstUpdate.current[0] = false;
      return;
    }
    console.log("Inside First UseEffect");
    checkWinCondition();
  }, [health, enemyHealth]);

  useEffect(() => {
    if (firstUpdate.current[1]) {
      firstUpdate.current[1] = false;
      return;
    }

    console.log("In UseEffect", turn);
  }, [turn]);

  const Attack = (attackType) => {
    let random = Math.floor(Math.random() * 100);
    if (attackType === "Dance") {
      if (random < 100) {
        /* random < 40 */
        console.log("You Danced on them");
        setAction("Dance");
        setEnemyAction("Hit");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
          setEnemyHealth(enemyHealth - 4);
          TimmyTurn();
        }, 4000);
        return;
      } else {
        /* You missed */
        console.log("You missed Dance");
        setAction("Miss");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
          TimmyTurn();
        }, 4000);
        return;
      }
    }

    if (attackType === "Attack") {
      if (random < 60) {
        /* random < 60 */
        console.log("You Deal Damage");
        setAction("Attack");
        setEnemyAction("Hit");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
          setEnemyHealth(enemyHealth - 2);
          TimmyTurn();
        }, 4000);
        return;
      } else {
        /* You missed */
        console.log("You missed");
        setAction("Miss");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
          TimmyTurn();
        }, 4000);
        return;
      }
    }
  };

  const TimmyTurn = () => {
    let attackRandom = Math.floor(Math.random() * 2);
    let random = Math.floor(Math.random() * 100);

    if (attackRandom === 0) {
      // Kick
      if (random < 90) {
        console.log("Timmy Kick");
        setAction("Hit");
        setEnemyAction("Kick");
        setTimeout(() => {
          setHealth(health - 2);
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
        }, 4000);
        checkWinCondition();
        return;
      } else {
        console.log("Timmy missed Kick");
        setEnemyAction("Miss");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
        }, 4000);
        checkWinCondition();
        return;
      }
    }
    if (attackRandom === 1) {
      // High Kick
      if (random < 90) {
        console.log("Timmy High Kick");
        setAction("Hit");
        setEnemyAction("HighKick");
        setTimeout(() => {
          setHealth(health - 2);

          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
        }, 4000);
        checkWinCondition();
        return;
      } else {
        console.log("Timmy missed High Kick");
        setEnemyAction("Miss");
        setTimeout(() => {
          setAction("NeutralIdle");
          setEnemyAction("NeutralIdle");
        }, 4000);
        checkWinCondition();
        return;
      }
    }
  };

  const checkWinCondition = () => {
    setTurn(turn + 1);
    if (enemyHealth <= 0) {
      // Call a function that creates the Defeat screen
      setEndScreenText("You survived");
      setIsOver(true);
    }
    if (health <= 0) {
      // Call a function that creates the victory screen
      setEndScreenText("You lost to Timmy");
      setIsOver(true);
      dispatch({
        type: "move to location",
        payload: {
          location: state.combatScreenX,
          cost: state.combatScreenWeight,
        },
      });
    }
  };

  return (
    <div className="map_container">
      <Canvas
        style={{ height: "100%" }}
        camera={{ fov: 75, position: [0, 1, 10] }}
      >
        <ambientLight />
        <Background />
        <Stage />
        <Suspense fallback={null}>
          {/* The Player */}
          <HealthBars
            position={[
              [-2, 1.7, 2],
              [-2, 1.7, 1.9],
              [-2, 2.2, 2],
              [-2, 1.7, 2.5],
            ]}
            name={"Main Character"}
            health={health}
          />
          <Anna
            action={action}
            position={[-2, -3.5, 0.6]}
            rotation={[Math.PI / 2, 0, -1.5]}
          />
          {/* The Enemy */}
          <HealthBars
            position={[
              [2, 1.7, 2],
              [2, 1.7, 1.9],
              [2, 2.2, 2],
              [2, 1.7, 2.5],
            ]}
            name={"Timmy"}
            health={enemyHealth}
          />
          <Timmy
            action={enemyAction}
            position={[2, -3.5, 0.9]}
            rotation={[Math.PI / 2, 0, 1.5]}
          />
        </Suspense>
        {/* UI Elements */}
        {/* Attack, Dance, Run Buttons */}
        {true ? (
          <group>
            <ActionButton
              position={[
                [-2.3, -4, 2],
                [-2.3, -4.05, 1.9],
                [-2.3, -3.9, 2.2],
              ]}
              rotation={[[-0.5, 0.5, 0]]}
              color={"orange"}
              actionText={"Attack"}
              action={() => {
                setTurn(turn + 1);
                Attack("Attack");
              }}
            />
            <ActionButton
              position={[
                [0, -4, 2],
                [0, -4.05, 1.9],
                [0, -3.9, 2.2],
              ]}
              rotation={[[-0.5, 0, 0]]}
              color={"cyan"}
              actionText={"Dance"}
              action={() => {
                setTurn(turn + 1);
                Attack("Dance");
              }}
            />

            <ActionButton
              position={[
                [2.3, -4, 2],
                [2.3, -4.05, 1.9],
                [2.3, -3.9, 2.2],
              ]}
              rotation={[[-0.5, -0.5, 0]]}
              color={"green"}
              actionText={"Run"}
              action={() => {}}
            />
          </group>
        ) : (
          <PreventActionButton
            rotation={[[-0.5, 0, 0]]}
            color={"red"}
            actionText={"TIMMY TURN"}
          />
        )}
        {/* End Screen */}
        {isOver ? <EndScreen text={endScreenText} action={() => {}} /> : <></>}
      </Canvas>
      {/* <div className="controls">
        <p>Health Controls</p>
        <button
          onClick={() => {
            setHealth(health - 1);
          }}
        >
          Reduce Health
        </button>
        <button
          onClick={() => {
            setEnemyHealth(enemyHealth - 1);
          }}
        >
          Reduce Enemy Health
        </button>
        <br />
        <p>Our Character</p>
        <button
          onClick={() => {
            setAction("NeutralIdle");
          }}
        >
          Idle
        </button>
        <button
          onClick={() => {
            setAction("Dance");
          }}
        >
          Dance
        </button>
        <button
          onClick={() => {
            setAction("Attack");
          }}
        >
          Attack
        </button>
        <button
          onClick={() => {
            setAction("Defeat");
          }}
        >
          Defeat
        </button>
        <br />
        <p>The Enemy</p>
        <button
          onClick={() => {
            setEnemyAction("NeutralIdle");
          }}
        >
          Idle
        </button>
        <button
          onClick={() => {
            setEnemyAction("HighKick");
          }}
        >
          High Kick
        </button>
        <button
          onClick={() => {
            setEnemyAction("Kick");
          }}
        >
          Kick
        </button>
        <button
          onClick={() => {
            setEnemyAction("Hit");
          }}
        >
          Hit
        </button>
        <button
          onClick={() => {
            setEnemyAction("Death");
          }}
        >
          Death
        </button>
      </div> */}
    </div>
  );
};

export default Combat;

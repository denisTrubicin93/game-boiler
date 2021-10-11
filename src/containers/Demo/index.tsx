import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sendMessageAction } from '../../features/Websocket/reducer';
// import Webcam from 'react-webcam';
// import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { RootState } from 'features';
import pokemonImg1 from './assets/pokemon_PNG112.png'
import pokemonImg2 from './assets/pokemon_PNG125.png'
import pokemonImg3 from './assets/pokemon_PNG150.png'

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: 'user',
// };

const WebcamCapture = () => {
  const dispatch = useDispatch();
  // const webcamRef = React.useRef(null);

  // const capture = React.useCallback(() => {
  //   // const imageSrc = webcamRef.current.getScreenshot();
  // }, [webcamRef]);

  const { coords } = useSelector((state: RootState) => state.arcade);
  const [pokemon, setPokemon] = useState<null | any>(null);
  const [popalsya, setPopalsya] = useState<null | any>(null);
  const pokemonList = [
    pokemonImg1,
    pokemonImg2,
    pokemonImg3
  ]

  console.log('pokemon', pokemon);

  useEffect(() => {
    if (pokemon) {
      const {x, y} = pokemon.pokemonCoords;
      const pa = {
        xMin: x,
        xMax: x + 150,
        yMin: y,
        yMax: y + 150,
      }

      const ha = {
        xMin: coords.x,
        xMax: coords.x + coords.w,
        yMin: coords.y,
        yMax: coords.y + coords.h,
      }

      setPopalsya(() =>
      ((pa.xMax > ha.xMax && ha.xMax > pa.xMin) && (pa.yMax > ha.yMax && ha.yMax > pa.yMin))
      || (pa.xMax > ha.xMax && ha.xMax > pa.xMin && pa.yMax > ha.yMin && ha.yMin > pa.yMin)
      || (pa.xMax > ha.xMin && ha.xMin > pa.xMin && pa.yMax > ha.yMax && ha.yMax > pa.yMin)
      || (pa.xMax > ha.xMin && ha.xMin > pa.xMin && pa.yMax > ha.yMin && ha.yMin > pa.yMin)
      )
    }
  }, [pokemon, coords])

  console.log(popalsya ? 'POPALSYA!!!' : 'NO :(');

  useEffect(() => {
    const pokemonInterval = setInterval(() => {
      setPokemon(() => {
        return {
          pokemonImage: pokemonList[Math.round(Math.random() * (pokemonList.length - 1))],
          pokemonCoords: {x: Math.floor(1130 * Math.random()), y: Math.floor(570 * Math.random())}
        }
      })
    }, 5000);
    const timer = setInterval(() => {
      dispatch(
        sendMessageAction({
          to: 'pose',
          message: {
            cmd: 'arcade_update',
            result: { event: 'arcade', x: Math.floor(1080 * Math.random()), y: Math.floor(520 * Math.random()), w: 200, h: 200 },
          },
        })
      );
    }, 1000);
    return () => {
      clearInterval(pokemonInterval);
      clearInterval(timer);
    }
  }, []);
  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '1280px',
            height: '720px',
            bgcolor: 'blanchedalmond',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: `${coords.w}px`,
              height: `${coords.h}px`,
              top: `${coords.y}px`,
              left: `${coords.x}px`,
              border: '3px solid #000',
              transition: '1s'
            }}
          />
          <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            top: `${pokemon?.pokemonCoords.y || 0}px`,
            left: `${pokemon?.pokemonCoords.x || 0}px`,
            background: `url(${pokemon?.pokemonImage || ''}) no-repeat center`,
            backgroundSize: 'contain',
            visibility: !!pokemon ? 'visible' : 'hidden',
            transition: '1s'
          }}
          >
            {/* <img style={{width:'100%'}} src={PokemonImg1} alt="" /> */}
          </Box>
          {/* <InsertEmoticonIcon
            sx={{
              fontSize: '150px',
              color: 'red',
              position: 'absolute',
              top: '30%',
              left: '40%',
            }}
          /> */}
          {/* <Webcam
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          /> */}
        </Box>
        {/* <button onClick={capture}>Capture photo</button> */}
      </Box>
    </>
  );
};

// const Demo: React.FC = () => {
//   return (
//     <div>
//       <p>This is Demo page</p>
//       <Link to="/">Go to Home</Link>
//     </div>
//   );
// };

export default WebcamCapture;

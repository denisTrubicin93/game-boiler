import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TotalArcade from './totalArcade';
import { sendMessageAction } from '../../features/Websocket/reducer';
import { setPoints } from '../../features/Arcade/reducer';
// import Webcam from 'react-webcam';
// import { styled } from '@mui/material/styles';
import { Box, styled, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { RootState } from 'features';
import pokemonImg1 from './assets/pokemon_PNG112.png';
import pokemonImg2 from './assets/pokemon_PNG125.png';
import pokemonImg3 from './assets/pokemon_PNG150.png';

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: 'user',
// };
const StatusBar = styled('div')({
  position: 'relative',
  // right: 0,
  // top: '-150px',
  width: '1280px',
  height: '150px',
  // borderRadius: '50%',
  // border: '10px solid blue',
  '& .timer': {
    position: 'absolute',
    left:'50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    padding:'10px 30px',
    borderRadius: '40px',
    border: '10px solid #000',
    background: '#ff4242', //#deeb14 #ff4242
    fontSize: '50px',
    animation: 'timerColor 60s linear',
    '& .timerIcon': {
      fontSize: '65px',
      verticalAlign: 'bottom',
      marginLeft: '20px',
      color:'#fff'
    }
  },
  '& .points': {
    position: 'absolute',
    right:'20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    backgroundColor: 'rgb(2,0,36)',
    background: 'radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
    '& .textPoints':{
      color: '#fff',
      fontSize: '60px',
      textAlign: 'center',
      lineHeight: '130px',
    }
  }

});
const WebcamCapture = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const webcamRef = React.useRef(null);

  // const capture = React.useCallback(() => {
  //   // const imageSrc = webcamRef.current.getScreenshot();
  // }, [webcamRef]);

  const { coords, points } = useSelector((state: RootState) => state.arcade);
  const [pokemon, setPokemon] = useState<null | any>(null);
  const [caught, setCaught] = useState<null | any>(null);
  const [seconds, setSeconds] = useState(30);

  const [pokemonOpacity, setPokemonOpacity] = useState<null | any>(1);
  const pokemonList = [
    pokemonImg1,
    pokemonImg2,
    pokemonImg3
  ]

  const changePokemon = () => {
    setPokemonOpacity(0)
    setTimeout(() => {
      setPokemonOpacity(1)
      setPokemon(() => {
        return {
          pokemonImage: pokemonList[Math.round(Math.random() * (pokemonList.length - 1))],
          pokemonCoords: {x: Math.floor(1130 * Math.random()), y: Math.floor(570 * Math.random())}
        }
      })
    }, 500);
  }

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

      setCaught(() =>
      ((ha.xMax > pa.xMax && pa.xMax > ha.xMin) && (ha.yMax > pa.yMax && pa.yMax > ha.yMin))
      || (ha.xMax > pa.xMax && pa.xMax > ha.xMin && ha.yMax > pa.yMin && pa.yMin > ha.yMin)
      || (ha.xMax > pa.xMin && pa.xMin > ha.xMin && ha.yMax > pa.yMax && pa.yMax > ha.yMin)
      || (ha.xMax > pa.xMin && pa.xMin > ha.xMin && ha.yMax > pa.yMin && pa.yMin > ha.yMin)
      )
    }
  }, [pokemon, coords])

  useEffect(() => {
    if (caught){
      changePokemon();
      dispatch(setPoints(points + 2));
      setCaught(() => false);
    }
  }, [caught])

  useEffect(() => {
    if(seconds > 0){
      setTimeout(() => {
        setSeconds(seconds - 1)
      }, 1000);
    }else history.push('/total');

  }, [seconds]);

  useEffect(() => {
    changePokemon()
    // const secondTimer = setInterval(() => {
    //     setSeconds(seconds - 1);
    // }, 1000);
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
      // clearInterval(secondTimer);
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
        <StatusBar>
          <Box className='timer' sx={{
            background: '#ff4242'
          }}>
            00:{seconds.toString().length > 1 ? seconds : `0${seconds}`}
            <AccessTimeIcon className='timerIcon'/>
          </Box>
          <Box className='points'>
            <Typography className='textPoints'>{ points }</Typography>
          </Box>
        </StatusBar>
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
              transition: '.5s'
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
            opacity: pokemonOpacity,
            transition: 'opacity .5s'
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
export { WebcamCapture, TotalArcade };

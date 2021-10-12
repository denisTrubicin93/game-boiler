import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import pokemonImg1 from './assets/pokemon_PNG112.png';
import pokemonImg2 from './assets/pokemon_PNG125.png';
import pokemonImg3 from './assets/pokemon_PNG150.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../features';

const TotalBox = styled('div')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  backgroundColor: 'rgb(63,94,251)',
  background:
    'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)',
  '& .total-point': {
    fontSize: '100px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
  },
  '& .pockemonImages': {
    position: 'absolute',
    left: '50%',
    bottom: '-100px',
    transform: 'translateX(-50%)',
    width: '100%',
  },
  '& .pockemonImages img': {
    width: '200px',
    height: '200px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '2',
    '&:first-child': {
      zIndex: '1',
      left: '0%',
    },
    '&:last-child': {
      zIndex: '1',
      left: '80%',
    },
  },
});
const TotalArcade = () => {
  const { points } = useSelector((state: RootState) => state.arcade);
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
          background: '#fbdc9d',
        }}
      >
        <Box>
          <TotalBox>
            <Typography className="total-point">{ points }</Typography>
            <Box className="pockemonImages">
              <img src={pokemonImg1} alt="" />
              <img src={pokemonImg2} alt="" />
              <img src={pokemonImg3} alt="" />
            </Box>
          </TotalBox>
        </Box>
      </Box>
    </>
  );
};

export default TotalArcade;

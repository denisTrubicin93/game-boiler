import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, styled, Typography } from '@mui/material';
import { sendMessageAction } from '../../features/Websocket/reducer';

// import { useMediapipe } from '../../components/common/useMediapipe';

const Countdown = styled('div')({
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
  '& .number': {
    fontSize: '100px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
  },
});

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [second, setSecond] = useState(5);
  useEffect(() => {
    if (second === 0){
      dispatch(
        sendMessageAction({
          to: 'pose',
          message: {
            cmd: 'hands_detect_start',
          },
        })
      )
      history.push('./demo');
    }
    setTimeout(() => {
      setSecond(() => second - 1);
    }, 1000);
  }, [history, second]);
  return (
    <>
      <Box
        sx={{
          width: window.innerWidth,
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fbdc9d',
        }}
      >
        <Box>
          <Countdown>
            <Typography className="number">{second}</Typography>
          </Countdown>
        </Box>
      </Box>
    </>
    // <p>This is Home</p>
    // <Link to="/demo">Go to Child page</Link>
  );
};

export default Home;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TotalArcade from './totalArcade';
import { sendMessageAction } from '../../features/Websocket/reducer';
import { setPoints } from '../../features/Arcade/reducer';
// import Webcam from 'react-webcam';
import { Box, styled, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { RootState } from 'features';
import violetSphereImg from './assets/violet-sphere.png';
import blueFireImg from './assets/blueFire.gif';
import fireworkImg from './assets/fireworknoloop.gif';

// const videoConstraints = {
//   width: 1920,
//   height: 1080,
//   facingMode: 'user',
// };
const StatusBar = styled('div')({
  position: 'relative',
  // right: 0,
  // top: '-150px',
  width: `${640 * 1.6875}px`,

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
    animation: 'timerColor 30s linear',
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
  const imgRef: any = useRef();
  // const webcamRef = React.useRef(null);

  const factorWidth = 1.6875;
  useEffect(() => {
    console.log(imgRef.current.naturalWidth, imgRef.current.naturalHeight)
    // const imageSrc = webcamRef.current.getScreenshot();
  }, [imgRef]);
  const { coords, points } = useSelector((state: RootState) => state.arcade);
  const [firework, setFirework] = useState<null | any>(null);
  const [playFirework, setPlayFirework] = useState(false)
  const [fireworkReady, setFireworkReady] = useState(false)
  const [caught, setCaught] = useState<null | any>(null);
  const [seconds, setSeconds] = useState(30);
  // const [base64, setBase64] = useState('');


  // const capture = async () => {
  //   const img = imgRef?.current as any;
  //   // let base64: string = '';
  //   if (img && img.src) {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     const ctx = canvas.getContext('2d');
  //     ctx!.drawImage(img,0,0,img.width,img.height);
  //     // const dataURL = canvas.toDataURL()
  //     console.log('source', ctx)
  //   }
  // }
  // console.log(capture())
  // useEffect(() => {
  //   if(img){
  //     console.log()
  //     const canvas = document.createElement('canvas')
  //     // canvas.width = img.
  //   }
  //   // const getFrameTimer = setInterval(() => {

  //   //   console.log('image', img);
  //   // },24)
  //   // return () => {
  //   //   clearInterval(getFrameTimer);
  //   // }
  // }, [base64])

  const [fireworkOpacity, setFireworkOpacity] = useState<null | any>(1);

  const changeFirework = () => {
    setPlayFirework(true)
    setTimeout(() => {
      setPlayFirework(false)
      setFireworkOpacity(0)
      setTimeout(() => {
        setFireworkOpacity(1)
        setFirework(() => {
          return {
            fireworkImage: violetSphereImg,
            fireworkCoords: {
              // x: 1000,
              x: Math.floor((640 * 1.6875 - 200) * Math.random()),
              y: 660
              // y: Math.floor(((150 - 150) * Math.random()))
            }
          }
        })
        setFireworkReady(true)
      }, 1000);
    }, 2000);

  }

  useEffect(() => {
    if (firework && fireworkReady) {
      console.log(firework)
      const {x, y} = firework.fireworkCoords;
      const fa = {
        xMin: x,
        xMax: x + 50,
        yMin: y,
        yMax: y + 50,
      }

      // const [hands] = coords.result;
      // const [leftHand, rightHand] = hands;
      // const [[xl1, yl1], [xl2, yl2]]: any[] = leftHand;
      // const [[xr1, yr1], [xr2, yr2]]: any[] = rightHand;
      const [leftHand, rightHand] = coords.result;
      const [[xl1, yl1], [xl2, yl2]] = leftHand;
      const [[xr1, yr1], [xr2, yr2]] = rightHand;

      const hla = {
        xMin: 1080 - (xl1 * factorWidth),
        xMax: 1080 - (xl2 * factorWidth),
        yMin: (yl1 * factorWidth),
        yMax: (yl2 * factorWidth),
      }
      const hra = {
        xMin: 1080 - (xr1 * factorWidth),
        xMax: 1080 - (xr2 * factorWidth),
        yMin: (yr1 * factorWidth),
        yMax: (yr2 * factorWidth),
      }
      if(
        ((fa.xMax > hla.xMax && hla.xMax > fa.xMin && fa.yMax > hla.yMax && hla.yMax > fa.yMin)
      || (fa.xMax > hla.xMax && hla.xMax > fa.xMin && fa.yMax > hla.yMin && hla.yMin > fa.yMin)
      || (fa.xMax > hla.xMin && hla.xMin > fa.xMin && fa.yMax > hla.yMax && hla.yMax > fa.yMin)
      || (fa.xMax > hla.xMin && hla.xMin > fa.xMin && fa.yMax > hla.yMin && hla.yMin > fa.yMin))

       ||((fa.xMax > hra.xMax && hra.xMax > fa.xMin && fa.yMax > hra.yMax && hra.yMax > fa.yMin)
       || (fa.xMax > hra.xMax && hra.xMax > fa.xMin && fa.yMax > hra.yMin && hra.yMin > fa.yMin)
       || (fa.xMax > hra.xMin && hra.xMin > fa.xMin && fa.yMax > hra.yMax && hra.yMax > fa.yMin)
       || (fa.xMax > hra.xMin && hra.xMin > fa.xMin && fa.yMax > hra.yMin && hra.yMin > fa.yMin))
      ){
        setFireworkReady(false)
        console.log(hla,hra,fa)
      }
      setCaught(() =>
      ((fa.xMax > hla.xMax && hla.xMax > fa.xMin && fa.yMax > hla.yMax && hla.yMax > fa.yMin)
      || (fa.xMax > hla.xMax && hla.xMax > fa.xMin && fa.yMax > hla.yMin && hla.yMin > fa.yMin)
      || (fa.xMax > hla.xMin && hla.xMin > fa.xMin && fa.yMax > hla.yMax && hla.yMax > fa.yMin)
      || (fa.xMax > hla.xMin && hla.xMin > fa.xMin && fa.yMax > hla.yMin && hla.yMin > fa.yMin))

       ||((fa.xMax > hra.xMax && hra.xMax > fa.xMin && fa.yMax > hra.yMax && hra.yMax > fa.yMin)
       || (fa.xMax > hra.xMax && hra.xMax > fa.xMin && fa.yMax > hra.yMin && hra.yMin > fa.yMin)
       || (fa.xMax > hra.xMin && hra.xMin > fa.xMin && fa.yMax > hra.yMax && hra.yMax > fa.yMin)
       || (fa.xMax > hra.xMin && hra.xMin > fa.xMin && fa.yMax > hra.yMin && hra.yMin > fa.yMin))
      )
    }
  }, [firework, coords])
  // 0: (2) [252, 482]
  // 1: (2) [268, 514]
  const [leftHand, rightHand] = coords.result;
  const [[xl1, yl1], [xl2, yl2]] = leftHand;
  const [[xr1, yr1], [xr2, yr2]] = rightHand;

  const hla = {
    xMin: 1080 - (xl1 * factorWidth),
    xMax: 1080 - (xl2 * factorWidth),
    yMin: (yl1 * factorWidth),
    yMax: (yl2 * factorWidth),
  }
  const hra = {
    xMin: 1080 - (xr1 * factorWidth),
    xMax: 1080 - (xr2 * factorWidth),
    yMin: (yr1 * factorWidth),
    yMax: (yr2 * factorWidth),
  }
  // const hla = {
  //   xMin: (10) * factorWidth,
  //   xMax: (630 * 1.6875) * factorWidth,
  //   yMin: (10) * factorWidth,
  //   yMax: (470 * 1.6875) * factorWidth,
  // }
  // const hra = {
  //   xMin: (200) * factorWidth,
  //   xMax: (500) * factorWidth,
  //   yMin: (200) * factorWidth,
  //   yMax: (500) * factorWidth,
  // }

  useEffect(() => {
    if (caught){
      changeFirework();
      dispatch(setPoints(points + 2));
      setCaught(() => false);
    }
  }, [caught])

  useEffect(() => {
    if(seconds > 0){
      setTimeout(() => {
        setSeconds(seconds - 1)
      }, 1000);
    }else{
      dispatch(
        sendMessageAction({
          to: 'pose',
          message: {
            cmd: 'hands_detect_stop',
          },
        })
      )
      history.push('/total');
    }

  }, [seconds]);

  useEffect(() => {
    changeFirework()
    // const secondTimer = setInterval(() => {
    //     setSeconds(seconds - 1);
    // }, 1000);
    // const timer = setInterval(() => {
    //   const xlRnd = Math.floor((window.innerWidth - 150) * Math.random())
    //   const ylRnd = Math.floor(930 * Math.random())
    //   const xrRnd = Math.floor((window.innerWidth - 150) * Math.random())
    //   const yrRnd = Math.floor(930 * Math.random())
    //   dispatch(
    //     // sendMessageAction({
    //     //   to: 'pose',
    //     //   message: {
    //     //     cmd: 'arcade_update',
    //     //     result: { event: 'arcade', x: Math.floor(1080 * Math.random()), y: Math.floor(520 * Math.random()), w: 200, h: 200 },
    //     //   },
    //     // })

    //     sendMessageAction({
    //       to: 'pose',
    //       message: {
    //         cmd: 'arcade_update',
    //         result: { event: 'hands_detect',
    //         result: [[[xlRnd,ylRnd],[xlRnd + 200,ylRnd + 200]],[[xrRnd,yrRnd],[xrRnd + 200,yrRnd + 200]]],
    //         image: ''
    //         },
    //       },
    //     })
    //   );
    // }, 1000);
    // return () => {
    //   // clearInterval(secondTimer);
    //   clearInterval(timer);
    // }
  }, []);
  return (
    <>
      <Box
        sx={{
          width: `${document.body.clientWidth}px`,
          height: `100vh`,
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
            width: `${640 * 1.6875}px`,
            // height: `${(document.body.clientWidth/1920)*1080}px`,
            height: `${480 * 1.6875}px`,
            bgcolor: '#000',
            overflow: 'hidden',
            // background: 'url(http://localhost:8090/vid)',
            // backgroundRepeat: 'no-repeat',
            // backgroundPosition: 'center',
            // backgroundSize: 'cover',
          }}
        >
          <img ref={imgRef} style={{width: '100%', height: '100%', transform: 'rotateY(180deg)'}}  src="http://localhost:8090/vid" alt="" />
          <Box
            sx={{
              position: 'absolute',
              width: `${(hla.xMax - hla.xMin) * 3}px`,
              height: `${(hla.yMax - hla.yMin) * 3}px`,
              top: `${hla.yMin}px`,
              left: `${hla.xMin}px`,
              transform: 'translate(-50%, -50%)',
              // border: '5px solid #fff',
              transition: '.05s'
            }}
          >
            <img src={blueFireImg} alt="" style={{width: "100%", height: '100%'}} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              width: `${(hra.xMax - hra.xMin) * 3}px`,
              height: `${(hra.yMax - hra.yMin) * 3}px`,
              top: `${hra.yMin}px`,
              left: `${hra.xMin}px`,
              transform: 'translate(-50%, -50%)',
              // border: '5px solid #fff',
              transition: '.05s'
            }}
          >
            <img src={blueFireImg} alt="" style={{width: "100%", height: '100%'}} />
          </Box>
          <Box
          sx={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            top: `${firework?.fireworkCoords.y || 0}px`,
            left: `${firework?.fireworkCoords.x || 0}px`,
            background: `url(${firework?.fireworkImage || ''}) no-repeat center`,
            backgroundSize: 'contain',
            visibility: !!firework ? 'visible' : 'hidden',
            opacity: fireworkOpacity,
            transition: 'opacity .5s',
            zIndex: '10'
          }}
          >
            {/* <img style={{width:'100%', transform: 'translateY(-70%)', zIndex: 1}} src={fireworkImg} alt="" /> */}
          </Box>
          <Box
          sx={{
            position: 'absolute',
            // width: '150px',
            // height: '150px',
            top: `${firework?.fireworkCoords.y || 0}px`,
            left: `${firework?.fireworkCoords.x || 0}px`,
            // background: `url(${fireworkImg}) no-repeat center`,
            // backgroundSize: 'contain',
            visibility: !!firework ? 'visible' : 'hidden',
            opacity: fireworkOpacity,
            transition: 'opacity .5s',
            zIndex: '1'
          }}
          >
            <img style={{ width:'200px', transform: 'translate(-73px, -80%)', zIndex: 1}} src={playFirework ? fireworkImg : ''} alt="" />
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
            height={'100%'}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={'100%'}
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

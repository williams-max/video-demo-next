import React, { useEffect, useState } from 'react'
import { Box, Button, CardActions } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import axios from 'axios';

import styles from './videoPlay.module.css'
const VideoPlay = () => {

    const urlProducction = "https://bakc-end-video-demo.vercel.app/api";
  //  "http://localhost:4000/api";
    const [contViewPlay, setContViewPlay] = useState(0)
    const [contViewTime, setContViewTime] = useState(0)
    const [contAuxTime, setContAuxTime] = useState(0)

    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        apiGetCntView()
        apiGetTimeView()

    }, []);

    const apiGetCntView = async () => {

   
        try {
            const result = await axios.get(`${urlProducction}/get-cont-view`)
          
            setContViewPlay(result.data.contview)
        } catch (error) {

            console.log(error)
        }
    }

    const apiGetTimeView = async () => {


        try {
            const result = await axios.get(`${urlProducction}/get-time-view`)

            setContViewTime(result.data.contview)
        } catch (error) {

            console.log(error)
        }
    }
    useEffect(() => {
        processoVideo();

        // llamar  a api
    }, [progress]);

    const processoVideo = async () => {
        if (document) {
            var myVideo = document.getElementById("myVideo");
            var numero;
            myVideo.ontimeupdate = (event) => {

                numero = Math.trunc(Number(myVideo.currentTime))
                setProgress(numero * 2.7)

  
                setContAuxTime(numero)
 
            }


        }
    }

    const playVideoBTN = async () => {
        if (document) {

            var myVideo = document.getElementById("myVideo");




            myVideo.play();

            var numero = Math.trunc(Number(myVideo.currentTime))
            setProgress(numero * 2.7)
      
            try {
                const result = await axios.post(`${urlProducction}/set-cont-view`, {
                    "contnumber": Number(contViewPlay + 1)
                })
                console.log("api set data cont view ", result.data)
           
            } catch (error) {

                console.log(error)
            }

            apiGetCntView();
        }
    }
    const pauseVideoBTN = async () => {
        if (document) {

            var myVideo = document.getElementById("myVideo");
            myVideo.pause();

      
            try {
                const result = await axios.get(`${urlProducction}/get-time-view`)
           
                const numeroApi = result.data.contview;
             var numeroActual = numeroApi + contAuxTime;


                await axios.post(`${urlProducction}/set-time-view`, {
                    "timenumber": Number(numeroActual)
                })

            } catch (error) {

                console.log(error)
            }
        }
    }

    const stopVideoBTN = () => {
        if (document) {

            var myVideo = document.getElementById("myVideo");
            myVideo.pause();
            myVideo.currentTime = 0;
        }
    }




    return (

        <>

            <video id="myVideo" width="65%"  >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" type="video/mp4" />

            </video>
            <Box sx={{ width: '65%' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <CardActions className={styles.boxbtns}>

                <CardActions>


                    <Button variant="outlined" id="playBtn" onClick={playVideoBTN}> Play </Button>
                    <Button variant="outlined" id="pauseBtn" onClick={pauseVideoBTN}> Pause </Button>
                    <Button variant="outlined" id="stopBtn" onClick={stopVideoBTN}> Stop </Button>
                </CardActions>
                <CardActions>


                    <Button>watch time <AccessAlarmsIcon /> {contViewTime + contAuxTime} sec</Button>
                    <Button>views <RemoveRedEyeIcon /> {contViewPlay} </Button>
                </CardActions>
            </CardActions>

        </>

    )
}

export default VideoPlay
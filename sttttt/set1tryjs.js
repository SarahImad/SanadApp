import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  Animated,  
  TouchableOpacity, 
  Text, 
  Modal, 
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Video, Audio, ResizeMode  } from 'expo-av';
import { transcribeSpeech } from '@/functions/transcribeSpeech';
import { recordSpeech } from '@/functions/recordSpeech';
import useWebFocus from '@/hooks/useWebFocus';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router'; 
import { Easing } from 'react-native';
import { useWindowDimensions } from 'react-native';

const questions = [
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741896992/boySleeping_pl7sly.mp4'},
    correctAnswer: 'sleepInbed', 
    images: [
      { source:{ uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741299662/sleepInbed_spnvwz.png' }, label: 'sleepInbed' , number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741299662/wakingUp_nzvwfl.png'}, label: 'wakingUp', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741299663/brushingTeeths_nmrjpi.png'}, label: 'brushingTeeths', number: 4, moveX: 6, moveY: -12 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741299662/pj_u7udwi.png'}, label: 'pj', number: 3, moveX: -9, moveY: -12 },
    ],
  },{
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741299358/bigAnimal_jkid6n.mp4'},
    images: [
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741300688/ant_pbcapd.png'}, label: 'ant', number: 2 , moveX: 7, moveY: 10 },
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741300686/rat_wx9lmm.png'}, label: 'rat', number: 1, moveX: -8, moveY: 10 },
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741300691/elephant_vpcbfp.png'}, label: 'elephant', number: 4, moveX: 6, moveY: -12 },
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741300689/dog_myf46z.png'}, label: 'dog', number: 3, moveX: -9, moveY: -12  }
     ],
    correctAnswer: 'elephant',
  },  
  { 
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741301665/cow_ea3mm0.mp4'},
    correctAnswer: 'cow',
    images: [
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741302063/camel_wuih0h.png'}, label: 'camel', number: 2, moveX: 7, moveY: 10  },
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741302058/zebra_cbch7o.png'}, label: 'zebra', number: 1,moveX: -8, moveY: 10 },
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741302066/goat_lljynr.png'}, label: 'goat', number: 4 , moveX: 6, moveY: -12},
    { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741302071/cow_lmq4jw.png'}, label: 'cow', number: 3, moveX: -9, moveY: -12   }
   ]
  }, 
  { 
   video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741397771/eye_xufzb7.mp4'},
    correctAnswer: 'eye',
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741395082/eye_s7bzbz.png'}, label: 'eye', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741395082/nose-removebg-preview_ulc4gq.png'}, label: 'nose', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741395082/ear_usgcke.png'}, label: 'ear', number: 4 , moveX: 6, moveY: -12},
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741395081/head_fzzch9.png'}, label: 'head', number: 3, moveX: -9, moveY: -12  }


   ]
  },
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741403051/cat2_ux6oim.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741396196/cat2_qkh7sx.png'}, label: 'cat2', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741396196/rabbite2_olgksc.png'}, label: 'rabbite2', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741396196/dog2_xs6qvt.png'}, label: 'dog2', number: 4 , moveX: 6, moveY: -12},
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741396196/bird_n1hqp7.png'}, label: 'bird', number: 3 , moveX: -9, moveY: -12}

   ],
    correctAnswer: 'cat2',
  },
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741457174/milk_fjl8e3.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741456194/glass_ep0b29.png'}, label: 'glass', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741456194/milk_ydmyu6.png'}, label: 'milk', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741456194/juice_ewcjcx.png'}, label: 'juice', number: 4 , moveX: 6, moveY: -10},
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741456194/water_wbt7eu.png'}, label: 'water', number: 3, moveX: -9, moveY: -12 }
    ],
    correctAnswer: 'milk',
    },
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741458015/baby_bx4qlr.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741457157/An_athlete_sp5oiu.png'}, label: 'athlete', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741457156/Baby_b6zpv0.png'}, label: 'Baby', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741457157/Pacifier_add3up.png'}, label: 'Pacifier', number: 4 , moveX: 6, moveY: -10},
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741457157/Approx._6_year_old_boy_y29uuu.png'}, label: 'Approx._6_year_old_boy', number: 3 , moveX: -9, moveY: -12 }
    ],
    correctAnswer: 'Baby',
  },
  {

    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741459199/apple_ensnj6.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741458178/Pear_xowjpb.png'}, label: 'Pear', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741458178/banana_p17cxr.png'}, label: 'banana', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741458178/An_apple_tbcqj9.png'}, label: 'apple', number: 4, moveX: 6, moveY: -10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741458178/Orange_s9ioao.png'}, label: 'Orange', number: 3 , moveX: -9, moveY: -12}
    ],
    correctAnswer: 'apple' ,
  },

  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741462810/shoe_rr9a04.mp4'},

    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741462976/sock_ux7nme.png'}, label: 'sock', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741462976/t_shirt_wjmh51.png'}, label: 't_shirt', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741462977/pants_sqhxaw.png'}, label: 'pants', number: 4, moveX: 6, moveY: -10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741462976/shoe_ypkj6g.png'}, label: 'shoe', number: 3 , moveX: -9, moveY: -12}
    ],
    correctAnswer: 'shoe' ,
  },
  {

    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741464305/car_di5o8q.mp4'},

    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741463883/3_wheel_bike_dnzyly.png'}, label: '3_wheel_bike', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741463881/bike_ejos71.png'}, label: 'bike', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741463882/car_mkse3u.png'}, label: 'car', number: 4, moveX: 6, moveY: -10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741463881/motorbike_lgykog.png'}, label: 'motorbike', number: 3 , moveX: -9, moveY: -12}
    ],
    correctAnswer: 'car' ,
  },
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741464959/spoon_hukf74.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741464571/cup_htpejz.png'}, label: 'cup', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741464571/fork_dmhekz.png'}, label: 'fork', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741464571/spoon_tqhnci.png'}, label: 'spoon', number: 4, moveX: 6, moveY: -10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741464570/knife_booco2.png'}, label: 'knife', number: 3 , moveX: -9, moveY: -12}
    ],
    correctAnswer: 'spoon' ,
  },
  {
    video: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1741465758/house_knx4lc.mp4'},
    images: [
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741465730/tent_ydsjeb.png'}, label: 'tent', number: 2, moveX: 7, moveY: 10  },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741465277/window_ug7qor.png'}, label: 'window', number: 1, moveX: -8, moveY: 10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741465734/school_r5cclv.png'}, label: 'school', number: 4, moveX: 6, moveY: -10 },
      { source: { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741465734/house_brtvrl.png'}, label: 'house', number: 3 , moveX: -9, moveY: -12}
    ],
    correctAnswer: 'house' ,
  },
  
];

const videoMappings = {
  0: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740522983/q1correct1_ygbefw.mp4'}, incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523126/q1wrong1_cafcl6.mp4'} },
  1: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523229/q2correct_sjttff.mp4'}, incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523237/q2wrong_xwbvpy.mp4'} },
  2: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523450/q3c_npwerk.mp4'}, incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523461/q3wrong_rdogdn.mp4'} },
  3: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523518/q4correct1_p95eif.mp4'} , incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523527/q4wrong2_vfyxj5.mp4'}  },
  4: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523566/q5correct1_nhlatk.mp4'} , incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523574/q5wrong1_trqhai.mp4'}  },
  5: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523622/q6correct_xhamew.mp4'} , incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523632/q6wrong2_czmoir.mp4'} },
  6: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523707/q7correct1_b7jzfy.mp4'} , incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523714/q7wrong1_ddxczw.mp4'}  },
  7: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523722/q8correct1_ovtlui.mp4'} , incorrect: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523743/q8wrong1_wr6qzq.mp4'}  },
  8: { correct: { uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740523815/errorr_ugzpbz.mp4'}  }
};

const wordToNumberMap = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
};

export default function App() {
  const [transcriptionText, setTranscriptionText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [testFinished, setTestFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showGrid, setShowGrid] = useState(true); 
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const audioRecordingRef = useRef(new Audio.Recording());
  const webAudioPermissionsRef = useRef(null);
  const videoRef = useRef(null);
  const isWebFocused = useWebFocus();
  const navigation = useNavigation();
  const videoScale = useRef(new Animated.Value(1)).current;
  const videoTranslateX = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  const fontSizePercentage = 0.018;  
  const dynamicFontSize = width * fontSizePercentage; 
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [animationValues] = useState(
    questions[0].images.map(() => new Animated.Value(1))
  );

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();
    setVideoSource(questions[currentQuestionIndex].video);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isWebFocused) {
      const getMicAccess = async () => {
        const permissions = await navigator.mediaDevices.getUserMedia({ audio: true });
        webAudioPermissionsRef.current = permissions;
      };
      if (!webAudioPermissionsRef.current) getMicAccess();
    } else {
      webAudioPermissionsRef.current?.getTracks().forEach(track => track.stop());
      webAudioPermissionsRef.current = null;
    }
  }, [isWebFocused]);

  const startRecording = async () => {
    setIsRecording(true);
    await recordSpeech(audioRecordingRef, setIsRecording, !!webAudioPermissionsRef.current);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const speechTranscript = await transcribeSpeech(audioRecordingRef);
      setTranscriptionText(speechTranscript || ""); 
      processTranscription(speechTranscript || "");
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const clearTranscription = () => {
    setTranscriptionText("");
  };

  const processTranscription = (transcription) => {
    const currentQuestion = questions[currentQuestionIndex];
    const transcriptionTrimmed = transcription.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
    
    const numberWords = Object.keys(wordToNumberMap).join('|');
    const numberRegex = new RegExp(`^(?:${numberWords}|\\d+)$`, 'i'); 
    
    const isValidSingleNumber = (text) => {
      const match = text.match(numberRegex);
      return match && match.length === 1;
    };
  
    const numberCandidates = transcriptionTrimmed.split(/\s+|,/); 
    
    const validNumbers = numberCandidates
      .map(candidate => {
        const cleanCandidate = candidate.replace(/[^a-zA-Z0-9]/g, '');
        const match = cleanCandidate.match(numberRegex);
        return match ? wordToNumberMap[match[0]] || parseInt(match[0], 10) : null;
      })
      .filter(num => num !== null && ![1, 2, 3, 4].includes(num));
  
    if (validNumbers.length !== 1) {
      handleInvalidAnswer();
      return;
    }
  
    const selectedNumber = validNumbers[0];
    const selectedImage = currentQuestion.images.find(image => image.number === selectedNumber);
    
    selectedImage ? handleImageSelect(selectedImage.label) : handleInvalidAnswer();
  };

  const handleInvalidAnswer = () => {
    setVideoSource(videoMappings[8].correct);
    setTimeout(() => setVideoSource(questions[currentQuestionIndex].video), 9000);
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        await videoRef.current?.loadAsync(questions[currentQuestionIndex].video, {}, false);
      } catch (error) {
        console.error('Video loading error:', error);
      }
    };
    loadVideo();
  }, [currentQuestionIndex]); 
  
  const handleImageSelect = (selectedLabel) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedLabel === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) setCorrectAnswers(prev => prev + 1);

    const videoMapping = videoMappings[currentQuestionIndex] || { correct: null, incorrect: null };
    setVideoSource(correct ? videoMapping.correct : videoMapping.incorrect);
    setSelectedImage(selectedLabel);

    handleAnimation(selectedLabel);
    setTimeout(() => !correct && handleAnimation(currentQuestion.correctAnswer), 4500);
    setTimeout(() => handleQuestionTransition(), 7000);
  };

  const hidebuttons = () => setShowButtons(false);

  const moveXValue = (19 / 100) * screenWidth;

  const handleQuestionTransition = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(() => {
        resetAnimations();
        setSelectedImage(null);
        clearTranscription();
      }, 10);
    } else {
      setShowGrid(false);  
      hidebuttons();
      setVideoSource({ uri: 'https://res.cloudinary.com/dniaeyw5w/video/upload/v1740869604/toSet1_nrxrmy.mp4' });

      Animated.parallel([
        Animated.timing(videoScale, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
        }),
        Animated.timing(videoTranslateX, {
          toValue: moveXValue, 
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => setIsQuizComplete(true));
    }
  };

  const handleAnimation = (selectedLabel) => {
    questions[currentQuestionIndex].images.forEach((image, index) => {
      if (image.label === selectedLabel) {
        Animated.spring(animationValues[index], {
          toValue: 1.5,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animationValues[index], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const resetAnimations = () => {
    animationValues.forEach(value => {
      Animated.timing(value, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleStopTest = () => {
    setTestFinished(true);
    setModalVisible(true);
    videoRef.current?.stopAsync();
  };

  const handleGoToResults = () => {
    alert(`You got ${correctAnswers} out of ${questions.length} correct!`);
    setModalVisible(false);
  };

  const handleContinueTest = () => {
    setTestFinished(false);
    setModalVisible(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
  };

  const getMoveX = (moveXPercent) => (moveXPercent / 100) * screenWidth;
  const getMoveY = (moveYPercent) => (moveYPercent / 100) * screenHeight;

  return ( 
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741036689/backgroundnew_cbi5vb.jpg' }}
        style={styles.background}
        resizeMode="stretch"
      >
        {showGrid && (
          <View style={styles.gridContainer}>
            {questions[currentQuestionIndex].images.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.gridItem,
                  { borderWidth: selectedImage ? 0 : 5, borderColor: 'rgba(225, 233, 226, 0.5)' },
                ]}
                onPress={() => handleImageSelect(item.label)}
              >
                <Animated.Image
                  source={item.source}
                  style={[
                    styles.image,
                    {
                      transform: [
                        { scale: animationValues[index] },
                        { 
                          translateX: animationValues[index].interpolate({
                            inputRange: [1, 1.5],
                            outputRange: [0, getMoveX(item.moveX)]
                          })
                        },
                        { 
                          translateY: animationValues[index].interpolate({
                            inputRange: [1, 1.5],
                            outputRange: [0, getMoveY(item.moveY)]
                          })
                        },
                      ],
                      opacity: animationValues[index],
                    },
                  ]}
                />
                {!selectedImage && (
                  <View style={styles.circle}>
                    <Text style={styles.circleText}>{item.number}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showButtons && <View style={styles.verticalLine} />}

        <Animated.View style={[
          styles.video,
          {
            transform: [
              { scale: videoScale },
              { translateX: videoTranslateX }
            ]
          }
        ]}>
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            shouldPlay={true}
          />
        </Animated.View>

        {isQuizComplete && (
          <Link href="/v1/set1" asChild>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Set 1</Text>
            </TouchableOpacity>
          </Link>
        )}

        {showButtons && (
          <View style={[styles.header, {
            position: 'absolute',
            top: '48%', 
            width: '100%',
            zIndex: 3,
            elevation: 3,
          }]}>
            <TouchableOpacity 
              style={[styles.stopButton, {
                position: 'absolute',
                right: '67%',
                top: '340%',
                zIndex: 4,
                backgroundColor: '#e1e9e2', 
                padding: 6,
              }]} 
              onPress={handleStopTest}
            >
              <Text style={[styles.stopButtonText, { color: 'rgb(132, 154, 139)', fontSize: dynamicFontSize }]}>
                Stop Test
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.replayIconContainer, {
                position: 'absolute',
                top: '200%',
                right: '60%',
                zIndex: 3,
              }]}
              onPress={() => videoRef.current?.replayAsync()}
            >
              <Image
                source={{ uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741036697/replay_iwjla6.png' }}
                style={[styles.replayIcon, {
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }]}
              />
            </TouchableOpacity>
          </View>
        )}

        {showButtons && (
          <View style={{
            position: 'absolute', 
            right: '73%',
            bottom: '22%',
            width: '12%', 
            height: '12%', 
            zIndex: 3,
          }}>
            <TouchableOpacity
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={isRecording || isTranscribing}
              style={{ opacity: isRecording || isTranscribing ? 0.5 : 1 }}
            >
              <Image 
                source={isRecording || isTranscribing
                  ? { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741036696/open_cmubmo.png' }
                  : { uri: 'https://res.cloudinary.com/dniaeyw5w/image/upload/v1741036687/closed_umbdzh.png' }}
                style={{     
                  width: '100%', 
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
              {(isRecording || isTranscribing) && (
                <ActivityIndicator style={styles.micActivity} color="white" />
              )}
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                {testFinished
                  ? `This is the trail set of the test!`
                  : "Do you want to stop the test?"}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleGoToResults}>
                  <Text style={styles.modalButton}>Results</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleContinueTest}>
                  <Text style={styles.modalButton}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showButtons && (
          <Text style={styles.footerText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startButton: {
    position: 'absolute',
    bottom: '14%',
    alignSelf: 'center',
    backgroundColor: 'rgb(225, 233, 226)',
    padding: '2%',
    borderRadius: 25,
    width: '30%',
    alignItems: 'center',
    zIndex: 2,
    left: '36%'
  },
  startButtonText: {
    color: 'rgb(132, 154, 139)',
    fontSize: 20,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    flex: 1,
    position: 'absolute',
    top: '15%',
    left: '47%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '42%',  
    height: '20%',
    zIndex: 3,
  },
  gridItem: {
    width: '45%',
    height: '160%',
    marginVertical: 15,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  video: {
    width: '60%',
    height: '60%',
    position: 'absolute',
    left: '6%',
    top: '15%',
    zIndex: 1,
  },
  micActivity: {
    position: 'absolute',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    left: '40%',
    fontSize: 18,
    color: '#fff',
  },
  verticalLine: {
    borderRightWidth: 5,
    borderRightColor: 'rgba(225, 233, 226, 0.5)',
    height: '50%',
    position: 'absolute',
    top: '30%',
    left: '44%',
  },
  header: {
    alignItems: 'center',
    height: '10%', 
    zIndex: 5,
  },
  stopButton: {
    borderRadius: 5,
    minWidth: '13%',
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
  },
  replayIconContainer: {
    width: '10%', 
    height: '95%',
    zIndex: 4,
  },
  replayIcon: {
    width: '100%', 
    height: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    fontSize: 18,
    color: 'blue',
  },
  circle: {
    position: 'absolute',
    bottom: '-10%',
    right: '40%',
    backgroundColor: 'rgba(225, 233, 226, 0.9)',
    width: '20%',
    height: '20%',
    borderRadius: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
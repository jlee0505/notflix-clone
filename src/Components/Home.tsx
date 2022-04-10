import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react"; 
import { getMovieNowPlaying, getMoviePopular, getMovieTopRated, IContent, IGetContentsResult } from "../api";
import { makeImagePath } from "../utils";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 38px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 15px;
  width: 50%;
`;

const Sliders = styled.div`
    width: 100%;
    height: 200vh;
    display: flex;
    flex-direction: column;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
  margin: 120px 0px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
  background-color: white;
  background-image: url(${(props)=>props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 180px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
      transform-origin: center left;
  }
  &:last-child {
      transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
    normal: {
        scale:1,
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type:"tween",
        },
    },
};

const infoVariants = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.1,
        type: "tween",
      },
    },
};

const offset = 6;

function Home () { 
    const sliders = ["Now Playing" ,"TOP Rated", "Popular"];
    const { data:nowPlayingData, isLoading:nowPlayingIsLoading } = useQuery<IGetContentsResult>(["movies", "nowPlaying"], getMovieNowPlaying);
    const { data:topRatedData, isLoading:topRatedIsLoading } = useQuery<IGetContentsResult>(["movies", "TopRated"], getMovieTopRated);
    const { data:popularData, isLoading:popularIsLoading } = useQuery<IGetContentsResult>(["movies", "Popular"], getMoviePopular);
    const data = nowPlayingData || topRatedData || popularData;
    const isLoading = nowPlayingIsLoading || topRatedIsLoading || popularIsLoading;
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false);
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length -1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    }
    const toggleLeaving = () => setLeaving((prev) => !prev)
    const onBoxClicked = (movieId:number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigate("/");
    return (
        <Wrapper>
            { isLoading ? (
                <Loader> Loading... </Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseIndex}
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}    
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                      <Sliders>
                        { sliders.map( (slider) => (   
                            <Slider>
                              <Title>{slider}</Title>
                              { (slider === "Now Playing") && (
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                  {nowPlayingData?.results.slice(1).slice(offset*index, offset*index+offset).map((movie)=>(
                                    <Box
                                        layoutId={movie.id+""}
                                        key={movie.id}
                                        onClick={()=> onBoxClicked(movie.id)}
                                        bgPhoto={makeImagePath(movie.backdrop_path,"w500")}
                                        variants={boxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{ type: "tween" }}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                  ))}
                                </Row>
                              )}
                              { (slider === "Popular") && (
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                  {popularData?.results.slice(1).slice(offset*index, offset*index+offset).map((movie)=>(
                                    <Box
                                        layoutId={movie.id+""}
                                        key={movie.id}
                                        onClick={()=> onBoxClicked(movie.id)}
                                        bgPhoto={makeImagePath(movie.backdrop_path,"w500")}
                                        variants={boxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{ type: "tween" }}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                  ))}
                                </Row>
                              )}
                              { (slider === "TOP Rated") && (
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                  {topRatedData?.results.slice(1).slice(offset*index, offset*index+offset).map((movie)=>(
                                    <Box
                                        layoutId={movie.id+""}
                                        key={movie.id}
                                        onClick={()=> onBoxClicked(movie.id)}
                                        bgPhoto={makeImagePath(movie.backdrop_path,"w500")}
                                        variants={boxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{ type: "tween" }}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                  ))}
                                </Row>
                              )}
                              
                            </Slider>
                        ))}
                      </Sliders>  
                        
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
      );
    }

export default Home;
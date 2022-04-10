import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react"; 
import { getSearch, IContent, IGetContentsResult } from "../api";
import { makeImagePath } from "../utils";
import { useNavigate, useMatch, useLocation } from "react-router-dom";

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

const Keywords = styled.p`
    width: 100%;
    height: 40vh;
    padding: 50px;
    display: flex;
    justify-content: start;
    align-items: center;
    background-color: black;
    color: ${props => props.theme.white.darker};
    font-size: 10px;
`;

const Rows = styled.div`
  position: relative;
  margin: 120px 0px;
  top: -150px;
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
  height: 100px;
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

function Search () { 
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword") as string;
    const { data, isLoading } = useQuery<IGetContentsResult>(["search", keyword], ()=> getSearch(keyword));
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/search/:searchId");
    console.log(bigMovieMatch);
    const { scrollY } = useViewportScroll();
    const onBoxClicked = (searchId:number) => {
        navigate(`/search/${searchId}`);
    };
    const onOverlayClick = () => navigate("/search");
    const rows = [1,2,3,4,5];
    return (
        <Wrapper>
            { isLoading ? (
                <Loader> Loading... </Loader>
            ) : (
                <>
                    <Keywords> 
                        <h3 style={{color:"gray", paddingRight:"10px"}}>다음과 관련된 컨텐츠:  </h3> {data?.results.map((search) => search.name+" | ")}
                    </Keywords>
                    <Rows>
                        { rows.map((row) => (
                            <>
                                <Row key={row}>
                                    {data?.results.map((search)=>(
                                    <Box
                                        layoutId={search.id+""}
                                        key={search.id}
                                        onClick={()=> onBoxClicked(search.id)}
                                        bgPhoto={makeImagePath( search.backdrop_path? search.backdrop_path : search.profile_path ||"" )}
                                        variants={boxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{ type: "tween" }}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{search.name}</h4>
                                        </Info>
                                    </Box>
                                    ))}
                                </Row>
                            </>
                        ))}
                    </Rows>
                </>
            )}
        </Wrapper>
      );
    }

export default Search;
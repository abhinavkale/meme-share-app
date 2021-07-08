import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.css";
require("dotenv").config();

export const Meme = () => {
  const [memes, setMemes] = useState([]);
  const [memeIndex, SetMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);

  const history = useHistory();

  const updateCaption = (e, index) => {
    const text = e.target.value || "";
    setCaptions(
      captions.map((c, i) => {
        if (index === i) {
          return text;
        } else {
          return c;
        }
      })
    );
  };

  const generateMeme = () => {
    const currentMeme = memes[memeIndex];
    const formData = new FormData();
    // var username = process.env.REACT_IMGFLIP_USERNAME;
    // var password = process.env.REACT_IMGFLIP_PASSWORD;

    var username = "dummyusermeme";
    var password = "dummyuser@123";

    formData.append("username", username);
    formData.append("password", password);
    formData.append("template_id", currentMeme.id);
    captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

    console.log(username);
    fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: formData,
    }).then((res) => {
      res.json().then((res) => {
        console.log(res);
        if (!res.data) alert("Enter input fields");
        else history.push(`/generated?url=${res.data.url}`);
      });
    });
  };

  const shuffleMemes = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then((res) => {
      res.json().then((res) => {
        // console.log(res);
        const _memes = res.data.memes;
        shuffleMemes(_memes);
        setMemes(_memes);
      });
    });
  }, []);

  useEffect(() => {
    if (memes.length) {
      setCaptions(Array(memes[memeIndex].box_count).fill(""));
    }
  }, [memeIndex, memes]);

  //   useEffect(() => {
  //     console.log(captions);
  //   }, [captions]);

  return memes.length ? (
    <div className={styles.container}>
      <button onClick={() => generateMeme()} className={styles.generate}>
        Generate
      </button>
      <button
        onClick={() => SetMemeIndex(memeIndex + 1)}
        className={styles.skip}
      >
        Skip
      </button>
      {captions.map((c, index) => (
        <input onChange={(e) => updateCaption(e, index)} key={index} />
      ))}
      <img src={memes[memeIndex].url} alt="" />
    </div>
  ) : (
    <>/</>
  );
};

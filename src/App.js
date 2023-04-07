import axios from 'axios';
import './App.css';

import { useState, useEffect, useRef } from 'react';

function App() {
  const [number, setNumber] = useState(1);
  const [lastNumber, setLastNumber] = useState();
  const [currComic, setCurrComic] = useState();
  const [error, setError] = useState();
  const inputRef = useRef();

  const getComicApi = (number) => ("https://xkcd.now.sh/?comic=" + number);

  const isStartDiabled = number === 1 ? true : false;

  const updateComicFunc = (number) => {
    axios
      .get(getComicApi(number))
      .then((resp) => {
        setCurrComic(prev => resp.data);
      })
  }

  const updateLastNumber = () => {
    axios
      .get(getComicApi("latest"))
      .then((resp) => {
        setLastNumber(prev => resp.data.num);
      })
  }

  useEffect(() => {
    updateLastNumber();
    updateComicFunc(number);
  }, [])

  const updateComic = (activity) => {
    switch (activity) {
      case "next":
        if (number < lastNumber) {
          setNumber(prev => prev + 1);
          updateComicFunc(number + 1);
        }
        break;
      case "prev":
        if (number > 1) {
          setNumber(prev => prev - 1);
          updateComicFunc(number - 1);
        }
        break;
      case "start":
        setNumber(prev => 1);
        updateComicFunc(1);
        break;
      case "last":
        updateLastNumber();
        setNumber(prev => lastNumber);
        updateComicFunc(lastNumber);
        break;
      case "random":
        const randomNum = Math.floor(Math.random() * lastNumber) + 1;
        setNumber(prev => randomNum);
        updateComicFunc(randomNum);
        break;
      default:
        break;
    }
  }

  const searchComic = () => {
    const num = inputRef.current.value;
    if (num >= 1 && num <= lastNumber && num !== number) {
      updateComicFunc(num);
    } else {
      setError(prev => "Please enter a valid number.");
    }
    inputRef.current.value = null;
  }

  return (
    <div className="container m-3">
      <div className="col-md-6 offset-3 ">
        {error &&
          <>
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
              {error}
              <button type="button" class="btn-close" onClick={() => setError(prev => null)}></button>
            </div>
          </>
        }
        <div className='row'>
          <div className='col-2'>
            <button className='btn btn-dark d-flex align-items-center' disabled={isStartDiabled} onClick={() => updateComic("start")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-start" viewBox="0 0 16 16">
                <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0V4zm7.5.633L5.696 8l5.804 3.367V4.633z" />
              </svg>
              <span>start</span>
            </button>
          </div>
          <div className='col-2'>
            <button className='btn btn-dark d-flex align-items-center' disabled={isStartDiabled} onClick={() => updateComic("prev")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
              </svg>
              <span>prev</span>
            </button>
          </div>
          <div className='col-4'>
            <button className='w-100 btn btn-dark d-flex align-items-center justify-content-center' onClick={() => updateComic("random")}>
              random
            </button>
          </div>
          <div className='col-2'>
            <button className='btn btn-dark d-flex align-items-center' onClick={() => updateComic("next")}>
              <span>next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
              </svg>
            </button>
          </div>
          <div className='col-2'>
            <button className='btn btn-dark d-flex align-items-center' onClick={() => updateComic("last")}>
              <span>last</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-end" viewBox="0 0 16 16">
                <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633 10.804 8 5 11.367V4.633z" />
              </svg>
            </button>
          </div>
        </div>
        <div className='row m-3 text-center'>
          {currComic &&
            <>
              <h2>{currComic.title}</h2>
              <img id={number} key={number} src={currComic.img} alt={currComic.alt} />
              <h4>ID: {currComic.num}</h4>
            </>
          }
        </div>
        <div className='row d-flex justify-content-center'>
          <div class="input-group w-50">
            <button class="btn btn-dark" type="button" onClick={() => updateLastNumber()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
              </svg>
            </button>
            <input type="text" ref={inputRef} class="form-control" placeholder="Search by ID..." />
            <button class="btn btn-dark" type="button" onClick={() => searchComic()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

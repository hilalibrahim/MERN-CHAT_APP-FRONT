// MusicPlayer.js
import { Button } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const MusicPlayer = ({ musicList }) => {
  const [audio] = useState(new Audio());
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to toggle play/pause state
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error('Failed to play audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  // Load and play the current track when component mounts
  useEffect(() => {
    const playMusic = () => {
      audio.src = musicList[currentTrackIndex];
      audio.loop = true;
      audio.play().catch(error => console.error('Failed to play audio:', error));
      setIsPlaying(true);
    };

    playMusic();

    return () => {
      audio.pause();
    };
  }, [audio, currentTrackIndex, musicList]);

  // Update the track when the current one ends
  useEffect(() => {
    const handleEnded = () => {
      setCurrentTrackIndex(prevIndex => (prevIndex + 1) % musicList.length);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [audio, musicList]);

  return (
    <div>
      {/* Button to toggle play/pause state */}
      <Button onClick={togglePlay}>{isPlaying ? 'Pause Music' : 'Play Music'}</Button>
    </div>
  );
};

export default MusicPlayer;

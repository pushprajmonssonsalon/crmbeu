import { useEffect, useState } from 'react';

   import "./Typewriter.css";
const Typewriter = ({ texts, speed = 100 }) => {
  const [currentText, setCurrentText] = useState(""); // To display current text
  const [isDeleting, setIsDeleting] = useState(false); // Toggle between typing and deleting
  const [currentIndex, setCurrentIndex] = useState(0); // Track which placeholder to use
  const [charIndex, setCharIndex] = useState(0); // Track current character in the placeholder
  const typingSpeed = 150; // Speed of typing in ms
  const deletingSpeed = 100; // Speed of deleting in ms
  const pauseTime = 1000; // Time to pause after fully typing the word

  useEffect(() => {
    // Get the current placeholder text
    const currentPlaceholder = texts[currentIndex];

    // Logic to handle typing and deleting
    if (isDeleting) {
      // Deleting one character at a time
      if (charIndex > 0) {
        setTimeout(() => {
          setCurrentText(currentPlaceholder.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
      } else {
        // When the word is fully deleted, switch to the next placeholder
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length); // Move to next placeholder
      }
    } else {
      // Typing one character at a time
      if (charIndex < currentPlaceholder.length) {
        setTimeout(() => {
          setCurrentText(currentPlaceholder.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        // Once the word is fully typed, pause for a bit before deleting
        setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    }
  }, [charIndex, isDeleting, currentIndex]);

  return (
    <div className='inline-block relative text-white  text-[1rem]'>
    {"We "+ currentText}
    <span className="cursor">|</span>
  </div>
  );
  };
  

  export default Typewriter;
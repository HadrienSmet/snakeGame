import { useRef } from "react";
import imageIntro from "../assets/snake-intro-removebg-bigger.png";

const OtherSide = () => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const startGame = () => {
        window.location.reload();
    };

    return (
        <div className="right-side">
            <img src={imageIntro} alt="Illu snake game" />
            <button ref={buttonRef} className="replay" onClick={startGame}>
                Recommencer
            </button>
        </div>
    );
};

export default OtherSide;

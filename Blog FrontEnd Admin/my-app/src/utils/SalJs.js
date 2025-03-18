import sal from "sal.js";
import "sal.js/dist/sal.css"; // Import CSS for animations
import "../Css/CoustomSal.css"
export const initializeSal = () => {
    sal({
        threshold: 0.5,  // Triggers animation when 50% of the element is visible
        once: false,  // Animation runs every time it enters the viewport
        disable: false,// Enables animations (auto-disable on low-power devices)
        once: true 
    });
};

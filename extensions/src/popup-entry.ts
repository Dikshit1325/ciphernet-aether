// Entry script to bundle Firebase compat and the existing popup script
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// expose `firebase` as global for the existing popup.js which expects window.firebase
(window as any).firebase = firebase;
// Also include analyzer and popup scripts so they are bundled together
import "../analyzer.js";
import "../popup.js";

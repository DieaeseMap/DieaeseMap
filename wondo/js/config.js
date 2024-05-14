    // Import the functions you need from the SDKs you need
    const firebase = require("firebase");
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyBJpemrlduUM39Z148LpJZEWGMh5PtOxlY",
      authDomain: "dieaesemap-8b17d.firebaseapp.com",
      projectId: "dieaesemap-8b17d",
      storageBucket: "dieaesemap-8b17d.appspot.com",
      messagingSenderId: "619550775577",
      appId: "1:619550775577:web:5f76ff5cc537ac104ccd88",
      measurementId: "G-3FLK08MTRZ"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    export default firebase;
import React, { useState } from "react";
import CommentModalApiContainer from "./src/CommentModalApiContainer.jsx";

function App() {
  const examplePostId = 1; // Change to a valid postId in your backend
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="App">
      <h1>Comments for Post #{examplePostId}</h1>
      <button onClick={() => setModalVisible(true)}>Open Comments Modal</button>
      <CommentModalApiContainer
        postId={examplePostId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

export default App;

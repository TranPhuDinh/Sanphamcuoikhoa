import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-lite.js"; 
import { firestore } from "../app.js";
// constructor function
function User(
  username,
  email,
  avatar = "https://www.google.com/imgres?q=avatar%20gmail&imgurl=https%3A%2F%2Fi.pinimg.com%2F564x%2Ffb%2F52%2Fe3%2Ffb52e39c5910bdbcc3b98d58d6ca6944.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F507006870540864947%2F&docid=sDv0HYVruOl4pM&tbnid=9JEcJP3E0uvGmM&vet=12ahUKEwj-5cTRqJ-MAxXYzzgGHYexBjwQM3oECDYQAA..i&w=512&h=512&hcb=2&ved=2ahUKEwj-5cTRqJ-MAxXYzzgGHYexBjwQM3oECDYQAA",
  point = 0
) {
  // tạo thuộc tính (property) cho đối tượng
  // this là từ khóa đại diện cho đối tượng được tạo ra từ constuctor function
  this.username = username;
  this.email = email;
  this.avatar = avatar;
  this.point = point;
  // tạo phương thức method cho đối tượng
  async function addUser() {
    const postsRef = collection(firestore, "users");
    await setDoc(doc(postsRef), {
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      point: this.point,
    });
  }

  async function getUser(uid) {
    // get doc from firestore
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // declare some var for current post
      this.username = docSnap.data().username;
      this.email = docSnap.data().email;
      this.avatar = docSnap.data().avatar;
      this.point = docSnap.data().point;
    } else {
      // docSnap.data() will be undefined in this case
console.log("No such document!");
    }
  }
  //   trả về đối tượng user sau khi được quy định thuộc tính và phương thức
  return {
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    point: this.point,
  };
}

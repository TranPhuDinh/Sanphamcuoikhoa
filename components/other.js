import {
    collection,
    getDocs,
    doc,
    setDoc,
    getDoc,
    query,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore-lite.js";

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

  function updateBlog() {
    const blogRef = doc(firestore, "blogs", this.id);
    setDoc(blogRef, {
      description: this.description,
      title: this.title,
      poster: this.poster,
      comments: this.comments,
      likes: this.likes,
      views: this.views + 1,
    });
  }

  async function deleteBlog() {
    await deleteDoc(doc(firestore, "blogs", this.id));
  }

  async function getBlogList() {
    const q = await query(collection(firestore, "blogs"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // list.push(doc);
    });
  }
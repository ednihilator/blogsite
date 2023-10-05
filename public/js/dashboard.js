const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();

  if (title && content) {
    //need to change stuff from project to post?
    const response = await fetch(`/api/posts`, {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert("Failed to create post");
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");
    //need to change stuff from project to post?
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    console.log(response);
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      console.log(response.ok);
      alert("Failed to delete post");
    }
  }
};

let postCreateBtn = document.querySelector(".new-post-form");
if (postCreateBtn) {
  postCreateBtn.addEventListener("submit", newFormHandler);
}

let postDelBtn = document.querySelector(".post-list");
if (postDelBtn) {
  postDelBtn.addEventListener("click", delButtonHandler);
}

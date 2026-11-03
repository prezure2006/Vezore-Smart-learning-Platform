import { useEffect, useState } from "react";
import "./editpage.css";
import { useParams } from "react-router-dom";

const EditPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");

  useEffect(() => {
    async function getVideo(id) {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/${id}`);
        const data = await response.json();
        setTitle(data.video.title);
        setDescr(data.video.description);
      } catch (error) {
        console.log(error.message);
      }
    }
    getVideo(id);
  }, [id]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/videos/updateinfo/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            title: title,
            description: descr,
          }),
        },
      );
      if (!response.ok) {
        console.log("Error");
      }
      console.log("Video Updated");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h1 className="heading-edit">Edit your video </h1>
      <div className="title-edit">
        <label htmlFor="title">Enter new Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="descr-edit">
        <label htmlFor="descr">Enter new description</label>
        <textarea
          id="descr"
          value={descr}
          name="description"
          onChange={(e) => setDescr(e.target.value)}
          required
        />
      </div>
      <div className="btn-save">
        <button type="submit">Save Changes </button>
      </div>
    </form>
  );
};
export default EditPage;

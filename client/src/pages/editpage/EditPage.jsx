import "./editpage.css";
const EditPage = () => {
  return (
    <form className="edit-form">
      <h1 className="heading-edit">Edit your video </h1>
      <div className="title-edit">
        <label htmlFor="title">Enter new Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter your new title"
        />
      </div>
      <div className="descr-edit">
        <label htmlFor="descr">Enter new description</label>
        <textarea
          id="descr"
          placeholder="Enter your new description"
          name="description"
        />
      </div>
      <div className="btn-save">
        <button type="submit">Save Changes </button>
      </div>
    </form>
  );
};
export default EditPage;

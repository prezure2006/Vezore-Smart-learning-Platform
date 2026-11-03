const EditPage = () => {
  return (
    <form>
      <h1>Edit your video </h1>
      <div className="title-edit">
        <label htmlFor="title">Enter new Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter your new title"
        />
      </div>
      <div className="title-edit">
        <label htmlFor="descr">Enter new description</label>
        <textarea
          id="descr"
          placeholder="Enter your new description"
          name="description"
        />
      </div>
    </form>
  );
};
export default EditPage;

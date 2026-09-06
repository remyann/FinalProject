const { randomUUID } = require("crypto");

// Use Node's built-in fetch so no Cloudinary package is needed.
const cloudinaryRequest = async (action, data) => {
  if (!process.env.CLOUDINARY_URL) throw new Error("Set CLOUDINARY_URL in the backend environment");
  const config = new URL(process.env.CLOUDINARY_URL);
  const credentials = `${decodeURIComponent(config.username)}:${decodeURIComponent(config.password)}`;
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.hostname}/image/${action}`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(credentials).toString("base64")}` },
    body: new URLSearchParams(data),
  });
  if (!response.ok) throw new Error("Cloudinary request failed. Please try again.");
  return response.json();
};

const uploadImage = async (file) => {
  const publicId = `pos-${randomUUID()}`;
  await cloudinaryRequest("upload", {
    file: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    public_id: publicId,
    allowed_formats: "jpg,png",
  });
  // A filename keeps the existing frontend and product schema compatible.
  return `cloudinary-${publicId}`;
};

const deleteImage = async (picture) => {
  if (!/^cloudinary-pos-[a-f0-9-]{36}$/.test(picture || "")) return;
  try {
    await cloudinaryRequest("destroy", { public_id: picture.slice(11), invalidate: "true" });
  } catch {
    console.error("Could not delete Cloudinary image:", picture);
  }
};

const listAll =
  (Model, searchableField = []) =>
    async (req, res) => {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit =
        req.query.limit == "ALL" ? null : parseInt(req.query.limit) || 15;
      const skip = (page - 1) * limit;

      const queryObj = {};

      if (search && searchableField.length > 0) {
        queryObj.$or = searchableField.map((field) => ({
          [field]: {
            $regex: search,
            $options: "i",
          },
        }));

      }
      let query = Model.find(queryObj);

      if (limit) {
        query = query.limit(limit);
      }

      const result = await query.skip(skip).sort({ createdAt: -1 }).populate('ProductType', 'ProductType');
      const total_record = await Model.find({
        ProductName: { $regex: search, $options: "i" },
      }).countDocuments();
      const total_page = Math.ceil(total_record / limit);

      //   const data = await Model.find();
      return res.status(200).json({
        data: result,
        total: result.length,
        total_record: 1,
        total_page: total_page,
      });
    };

const getOne = (Model) => async (req, res) => {
  const id = req.params.id;
  const result = await Model.findOne({ _id: id });
  if (!result) {
    return res.status(404).json({
      message: "Record is not found",
    });
  }
  return res.status(200).json({ data: result });
};

const create = (Model, uploadField) => async (req, res) => {
  let uploaded;
  try {
    const data = { ...req.body };
    delete data[uploadField];
    if (req.file) {
      uploaded = await uploadImage(req.file);
      data[uploadField] = uploaded;
    }
    const result = await Model.create(data);
    return res.status(201).json({ data: result, message: "Item has been added" });
  } catch (error) {
    await deleteImage(uploaded);
    return res.status(error.status || 400).json({ error: error.message });
  }
};

const removeAll = (Model) => async (req, res) => {
  const result = await Model.deleteMany({});
  return res.status(200).json({ message: "all records deleted" });
};

const remove = (Model, uploadField) => async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Product Not Found" });
    await deleteImage(result[uploadField]);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }
};

const update = (Model, uploadField) => async (req, res) => {
  let uploaded;
  try {
    const result = await Model.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "record is not found" });
    const data = { ...req.body };
    delete data[uploadField];
    if (req.file) {
      uploaded = await uploadImage(req.file);
      data[uploadField] = uploaded;
    }
    const updated = await Model.updateOne(
      { _id: result._id, [uploadField]: result[uploadField] },
      { $set: data },
      { runValidators: true },
    );
    if (!updated.matchedCount) throw new Error("Product changed. Refresh and try again.");
    if (uploaded) await deleteImage(result[uploadField]);
    return res.status(200).json({ message: "updated" });
  } catch (error) {
    await deleteImage(uploaded);
    return res.status(error.status || 400).json({ error: error.message });
  }
};

module.exports = {
  create,
  remove,
  removeAll,
  listAll,
  update,
  getOne,
};

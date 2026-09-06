const fs = require("fs");

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
  try {
    const data = req.body;
    console.log(req.file);
    data[uploadField] = req?.file?.filename;
    console.log(data);
    const result = await Model.create(data);
    res.status(201).json({ data: result, message: 'Item has been added' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeAll = (Model) => async (req, res) => {
  const result = await Model.deleteMany({});
  return res.status(200).json({ message: "all records deleted" });
};

const remove = (Model, uploadField) => async (req, res) => {
  try {
    // check if file exist
    const id = req.params.id;
    console.log("id = ", id);
    const data_result = await Model.findById(id);

    if (!data_result) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // delete file
    const file_path = "./uploads/" + data_result[uploadField];
    console.log("file_path: ", file_path);
    fs.unlink(file_path, (error) => {
      if (error) {
        console.log(error);
        return res
          .status(404)
          .json({ message: "file was not deleted: " + error });
      } else {
        console.log("file deteleted");
      }
    });

    // remove record from table
    const result = await Model.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = (Model, uploadField) => async (req, res) => {
  const id = req.params.id;
  const data_update = req.body;

  // check if record is exist
  const result = await Model.findOne({ _id: id });
  if (!result) {
    return res.status(404).json({ message: "record is not found" });
  }
  const req_body = req.body
  //   update
  const picture = req?.file?.filename || result.Picture;
  req_body['Picture'] = picture


  const update = await Model.updateOne({ _id: id }, req_body);

  console.log("update = ", update);

  return res.status(200).json({ message: "updated" });
};

module.exports = {
  create,
  remove,
  removeAll,
  listAll,
  update,
  getOne,
};

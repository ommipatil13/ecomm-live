import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(401).send({ message: "name is required" });
        }

        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "already category existed"
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in category"
        })
    }
};

//update category controller
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params //from url  

        const category = await categoryModel.findByIdAndUpdate(id,
            { name, slug: slugify(name) },
            { new: true })
        res.status(200).send({
            success: true,
            message: "category updated successfully",
            category,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error while updating category",
        })
    }
}

//get all category
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "get all category",
            category,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in get all category",
        })
    }

};

//single category
export const singleCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "get single category",
            category,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in single category",
        })
    }
}

//delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "deleted category ",
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error while deleting",
        })
    }
}
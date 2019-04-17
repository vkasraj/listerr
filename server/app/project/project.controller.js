const { ObjectId } = require("mongoose").Types;

const ProjectDAL = require("./project.dal");
const TemplateDAL = require("../template/template.dal");

const createProject = async (req, res, next) => {
    try {
        const {
            $user: { $id },
            body: { title, description, template }
        } = req;

        let extras = {};
        if (template) {
            const _template = await new TemplateDAL({
                _id: template
            }).findOne();

            if (!_template) {
                throw new $Error("Template not found", 409);
            }

            extras = {
                template,
                columns: _template.columns
            };
        }

        const project = await new ProjectDAL().create({
            author: $id,
            title,
            description,
            ...extras
        });

        res.status(201).json({
            success: "Project successfully created",
            project
        });
    } catch (error) {
        next(error);
    }
};

const getProjectList = async (req, res, next) => {
    try {
        const { $id } = req.$user;

        const projects = await new ProjectDAL({
            author: ObjectId($id)
        }).findAll({
            select: "title description createdAt updatedAt"
        });

        res.status(200).json({
            message: "Successful",
            projects
        });
    } catch (error) {
        next(error);
    }
};

const getProject = async (req, res, next) => {
    try {
        const {
            $user: { $id },
            params: { projectId }
        } = req;

        const project = await new ProjectDAL({
            _id: ObjectId(projectId),
            author: ObjectId($id)
        }).findOne();

        res.status(200).json({
            success: "Successful",
            project
        });
    } catch (error) {
        next(error);
    }
};

const rearrangeProject = async (req, res, next) => {
    try {
        const {
            $user: { $id },
            params: { projectId },
            body: { columnId, sourceIndex, destIndex }
        } = req;

        // If source and destination index are same
        // then no need to update => return
        if (sourceIndex === destIndex) {
            throw new $Error("Source and Destination are equal :/", 400);
        }

        // Finding columns length
        const project = await new ProjectDAL({
            _id: ObjectId(projectId),
            author: ObjectId($id)
        }).findOne({
            select: {
                columnsLength: {
                    $size: "$columns"
                }
            }
        });

        // Check if destination index of column is >= project total column length
        if (!project || destIndex >= project.columnsLength) {
            throw new $Error("Destination is out of range :/");
        }

        // Decrement columns index by 1 whose index are greater than source & less than destination index
        // Update dragged column index to destination index
        const updateColumn = await new ProjectDAL({
            author: $id,
            _id: projectId
        }).updateOne(
            {
                $inc: {
                    "columns.$[column1].order": -1
                },
                "columns.$[column2].order": destIndex
            },
            {
                updateOpt: {
                    arrayFilters: [
                        {
                            "column1.order": {
                                $gt: sourceIndex,
                                $lte: destIndex
                            }
                        },
                        {
                            "column2._id": columnId
                        }
                    ],
                    new: true
                },
                select: "_id"
            }
        );

        res.status(200).json({
            message: "Project successfully updated",
            project: updateColumn
        });
    } catch (error) {
        next(error);
    }
};

const updateProject = (req, res, next) => {
    try {
        res.status(200).json({
            message: "TODO: To be implemented"
        });
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const {
            $user: { $id },
            params: { projectId }
        } = req;

        const project = await new ProjectDAL({
            _id: projectId,
            author: $id
        }).deleteOne();

        /**
         * @todo Implement Undo feature
         */

        res.status(200).json({
            success: "Project successfully deleted",
            project
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getProjectList,
    getProject,
    rearrangeProject,
    updateProject,
    deleteProject
};

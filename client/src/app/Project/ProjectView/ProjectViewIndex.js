import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

import { projectGet, projectClear } from "../../../store/actions/index.action";
import { projectIssuesSelector } from "../../../store/selectors/project.selector";

import Loader from "../../../components/Loader/Loader";
import ProjectCardList from "../../../components/Project/ProjectCardList";
import DateFormat from "../../../components/DateFormat";
import DroppableWrapper from "../../../components/DragAndDrop/DroppableWrapper";
import DropContext from "../../../components/DragAndDrop/DropContext";

const useStyles = makeStyles({
    container: {
        width: "calc(100% + 16px)",
        margin: "-8px",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        boxSizing: "border-box"
    }
});

const ProjectViewIndex = ({
    match: { params },
    $projectGet,
    $projectClear,
    _currentProject,
    _currentIssues
}) => {
    const styles = useStyles();

    useEffect(() => {
        $projectGet(params.projectId);

        // Clearing the currently loaded project
        return $projectClear;
    }, [params.projectId]);

    if (!_currentProject) {
        return <Loader />;
    }

    const onDragEnd = data => console.log(data);

    return (
        <Fragment>
            <Grid container justify="space-between">
                <Grid item>
                    <Typography variant="h5">
                        {_currentProject.title}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        gutterBottom
                    >
                        {_currentProject.description}
                    </Typography>
                    <DateFormat
                        date={_currentProject.updatedAt}
                        prefix="updated"
                        paragraph
                    />
                </Grid>
                <Grid item>
                    <Button size="small" variant="contained" color="primary">
                        <AddIcon />
                        Add Card
                    </Button>
                </Grid>
            </Grid>
            <DropContext onDragEnd={onDragEnd}>
                <DroppableWrapper
                    id="project-column"
                    direction="horizontal"
                    type="PROJECT_COLUMN"
                    innerProps={{
                        className: styles.container
                    }}
                >
                    <ProjectCardList
                        columns={_currentProject.columns}
                        issues={_currentIssues}
                    />
                </DroppableWrapper>
            </DropContext>
        </Fragment>
    );
};

const mapStateToProps = ({ project: { current } }) => ({
    _currentProject: current,
    _currentIssues: projectIssuesSelector(current)
});

const mapDispatchToProps = {
    $projectGet: projectGet,
    $projectClear: projectClear
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectViewIndex);
